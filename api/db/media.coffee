CFG = require '../../conf'
mongoose = require 'mongoose'
mongoose.connect 'mongodb://localhost/lab'
_ = require 'underscore'
api = require './api'
ytinfo = require('ytdl').getInfo
ytdl = require 'youtube-dl'
knox = require('knox').createClient {
  key: CFG.S3.KEY
  secret: CFG.S3.SECRET
  bucket: CFG.S3.MEDIA_BUCKET
}

Zen = require '../lib/zen'


{Schema} = mongoose
{ObjectId} = Schema

User = require './user'

MediaSchema = new Schema {
  created: type: Date, default: Date.now()
  userId: type: ObjectId, ref: User

  sharing: String # colleagues, students, all
  
  fpData: {}
  fpUrl: String
  yt: String

  title: String
  urlBase: String

  progress: Number

}

MediaSchema.methods =
  
  type: ->
    @fpData.type.split('/')[0]

  encode: ->

  update: (data,cb)->
    {model,options,handshake:{userId}} = data
    delete model._id
    delete model.userId
    _.extend @, model
    @save (err)=>
      cb err, @

  delete: (data,cb)->
    @remove (err)=>
      cb err, @


_.extend MediaSchema.statics, api.statics

_.extend MediaSchema.statics, {

  create: (data,cb)->
    {model,options,handshake:{userId}} = data

    newMedia = new @ model
    newMedia.userId = userId
    newMedia.urlBase = (new Buffer model.fpData.key).toString('hex')
    
    newMedia.save (err)=>
      
      cb err, newMedia
      @encode(newMedia) if newMedia.type() in ['video','audio']
      

  encode: (media)->
    zen = new Zen media
      
    zen.encode (job)=>
      console.log 'encoding job', job
    
    zen.on 'progress', (data)=>
      media.progress = data.progress.progress
      media.save (err)=>
        @emit 'event', {
          who: media.userId
          event: 'progress'
          model: media
          progress: data.progress.progress
        }

  createFromYouTube: (ytid)=>
    url = "http://www.youtube.com/watch?v=#{ytid}"

    formatsToFind = ['mp4','webm']
    formats = {}

    ytinfo url, (err,info)->
      console.log _.pluck info.formats, 'container'
      for format in formatsToFind
        console.log itags = (_.map (_.filter info.formats, (v)-> v.container is format), (fm)-> parseInt(fm.itag, 10))
        formats[format] = _.max itags
      console.log formats

      for type,itag of formats
        dl = ytdl.download url, './tmp', ["--format=#{itag}"]

        dl.on 'progress', (data)->
          console.log data

        dl.on 'end', (data)->
          knox.putFile "./tmp/#{data.filename}", "/#{data.filename}", (err, res)->
            if err then console.log err
            console.log "#{data.filename} finished."


  myVideo: (data, cb)->
    {model,options,handshake:{userId}} = data
    @find { userId: userId, 'fpData.type': /video/ }, cb

  myAudio: (data, cb)->
    {model,options,handshake:{userId}} = data
    @find { userId: userId, 'fpData.type': /audio/ }, cb

  myMediaOfType: (data, cb)->
    {model,options,handshake:{userId}} = data
    {type} = options
    @find { userId: userId, 'fpData.type': ///#{type}///}, cb

  sharedMediaOfType: (data, cb)->
    {model,options,handshake:{userId}} = data
    {type} = options
    @where('sharing').in(['everyone','colleagues']).exec cb

  getYTVideo: (data, cb)->
    {model,options,handshake:{userId}} = data
    {ytid} = options
    @createFromYouTube ytid


  read: (data,cb)->
    {model,options,handshake:{userId}} = data

    if (id = model._id)
      @findOne { userId: userId, _id: model._id }, cb
    else
      @find { userId: userId }, cb

}

module.exports = Media = mongoose.model 'media', MediaSchema