cluster = require 'cluster'
numCPUs = require('os').cpus().length
http = require 'http'


spin = ->
  # express web server
  app = require './web/web'

  # get the http server out
  server = http.createServer app

  # set up the socket.io api
  api = require('./api/api')(server)


  server.listen 8080

  console.log 'running on port 8080!'


spin()
###

if cluster.isMaster
  
  for i in [1..numCPUs]
    cluster.fork()

  cluster.on 'exit', (worker)->
    console.log('worker ' + worker.process.pid + ' died')
else
  spin()

###

  