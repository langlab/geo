
io = require 'socket.io'
redis = require 'redis'
RedisStore = require 'socket.io/lib/stores/redis'
_ = require 'underscore'
util = require 'util'
Password = require './lib/password'

pub    = redis.createClient()
sub    = redis.createClient()
client = redis.createClient()

red = redis.createClient()

services =
  user: require './db/user'


api = (server)->

  sio = io.listen server

  sio.set 'store', new RedisStore {
    redisPub : pub
    redisSub : sub
    redisClient : client
  }

  sio.configure ->

    sio.set 'authorization', (hs,cb)->
      hs.role = 'none'
      cookies = hs.headers.cookie?.split(';')

      ssidStr = _.find cookies, (i)-> /sessionId/.test(i)
      ssid = (unescape ssidStr?.split('=')[1])[2..25]
      console.log 'ssid:',ssid

      studentKeyStr = _.find cookies, (i)-> /studentKey/.test(i)
      studentKey = if studentKeyStr? then unescape studentKeyStr?.split('=')[1] else null

      if studentKey?
        console.log 'studentKey: ',studentKey
        cb null, true

        ###
        red.get "lingualabio:studentAuth:#{key}", (err, student)->
          if student
            hs.studentId = student._id
            hs.role = 'student'
          else
            hs.role = 'none'
          cb null, true

        ###
      
      else

        console.log 'getting session...'
        # find the session in redis
        red.get "sess:#{ssid}", (err, sessStr)->
          console.log "session:", JSON.parse sessStr, err
          if sessStr
            hs.sess = JSON.parse sessStr
            hs.teacherId = hs.userId = hs.sess?.auth?.userId
            if hs.teacherId 
              hs.role = 'teacher'
            else
              hs.role = 'none'

          cb null, true



  # socket API
  sio.on 'connection', (client)->
    {role, userId} = client.handshake

    # keep track of the sockets by userId
    if userId
      console.log 'user joining self socket: ',userId
      client.join "self:#{userId}"

    client.on 'api', (schema, data, cb)->
      data.handshake = client.handshake
      { method, model, options, handshake } = data
      api = services[schema].api data, cb

    client.on 'handshake', (cb)->
      console.log 'handshake'
      cb null, client.handshake


  emitEventFunc = (schema) ->
    # send back a schema-specific event-emitting function that takes data
    # as a parameter

    (data)-> 
      { who, group } = data
      who = [ who ] unless _.isArray who
      for client in who
        sio.sockets.in("self:#{client}").emit 'api', schema, data

      if group
        sio.sockets.in("group:#{group}").emit 'api', schema, data

  for schema, service of services
    service.on 'event', emitEventFunc(schema)

  sio

module.exports = api