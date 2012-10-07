
module "App.Media", (exports,glo)->

  BB = glo.BB

  class Model extends BB.Model
    syncName: 'media' 

    type: ->
      @get('fpData').type.split('/')[0]

    currentProgress: ->
      parseInt @get('progress'), 10

    thumbnailSrc: ->
      if @type() is 'video'
        if @currentProgress() < 100
          "http://lorempixel.com/400/300/abstract/2/PROCESSING%20VIDEO/"
        else
          "#{CFG.S3.URL_ROOT}#{CFG.S3.MEDIA_BUCKET}/#{@get('urlBase')}_0004.png"
      else
        "/assets/sound.png"

    urlBase: ->
      "#{App.Utils.Encode.toHex @get('fpData').url}"

    src: ->
      if @type() is 'video'
        ext = if Modernizr.video.webm then 'webm' else 'mp4'
      else
        ext = 'mp3'

      "#{CFG.S3.URL_ROOT}#{CFG.S3.MEDIA_BUCKET}/#{@get('urlBase')}.#{ext}"


  class Collection extends BB.Collection
    syncName: 'media'
    model: Model

    dbEvent: (data)->
      {event, model, progress} = data
      if event is 'progress'
        m = @get(model._id)
        m.set 'progress', progress
        console.log 'updated: ',m

    fetchMyVideo: (options = {})->
      @api 'myVideo', options, (err, data)=>
        @reset data
        cb()

    fetchMyAudio: (options = {})->
      @api 'myAudio', options, (err, data)=>
        @reset data
        cb()

    fetchSharedVideo: (options = {})->
      options.type = 'video'
      @api 'sharedMediaOfType', options, (err, data)=>
        @reset data
        cb()


  class Router extends BB.Router

    initialize: (@options)->
      _.extend @, @options
      @data.media = new Collection
      @views.list = new Views.List collection: @data.media

    routes:
      'media':'list'
      'media/:id':'detail'


    list: ->
      @clearViews()
      
      @data.media.fetch {
        success: => @views.list.open()
      }

    detail: (id)->
      @clearViews()
      @views.detail = new Views.Detail model: new Model { _id: id }
      @views.detail.model.fetch {
        success: => @views.detail.render().open()
      }
      

  
  Views = {}



  class Views.IconItem extends BB.View

    tagName: 'li'
    className: 'span3 media-icon-item'

    initialize: ->
      @model.on 'change:progress', @updateProgress

    events:
      'click .delete': -> @model.destroy()

    updateProgress: =>
      if @model.currentProgress() < 100
        @$('.bar').css 'width', "#{@model.currentProgress()}%"
      else
        @render()

    template: ->
      span class:'thumbnail', ->
        img src:"#{@model.thumbnailSrc()}"
        if @model.currentProgress() < 100
          div class:'progress progress-striped active progress-warning', style:'height:10px', ->
            div class:'bar', style:"width: #{@model.currentProgress()}%"
        div class:'caption', ->
          a href:"#media/#{@model.id}", "#{@model.get('title')}"
          span class:'icon-trash delete'



  class Views.List extends BB.View

    tagName: 'div'
    className: 'media-list'

    initialize: ->
      @collection.on 'reset', =>
        @render()

      @collection.on 'add', =>
        @render()

      @collection.on 'remove', =>
        @render()

    events:
      
      'click .upload-file': ->
        
        fpOptions =
          metadata: true

        filepicker.getFile '*/*', fpOptions, @createFromUpload

    createFromUpload: (url,data)=>
      title = prompt 'Please enter a name for your media:', data.filename

      @collection.create {
        fpData: data
        fpUrl: url
        title: title
      }, {
        wait: true
      }


    template: ->
      div class:'button-group', ->
        button class:'button upload-file', "upload file"

      ul class:'thumbnails', ->
        
            

    render: ->
      super()

      for media in @collection.models
        v = new Views.IconItem model: media
        v.render().open @$('.thumbnails')

      @delegateEvents()
      @

  class Views.Detail extends BB.View

    tagName: 'div'
    className: 'media-detail'

    initialize: ->

    events:
      'change [data-field]':'save'

    save: (e)->
      field = $(e.currentTarget).attr('data-field')
      value = $(e.currentTarget).val()
      @model.save field, value

    sharingValues:
      'private':'Private'
      'colleagues':'Share with my colleagues'
      'everyone':'Share with everyone'
      
    template: ->
      div class:'row', ->
        div class:'span6', ->
          video controls:'controls', src:"#{@model.src()}"
        div class:'span6', ->
          div class:'control-group', ->
            input 'data-field':'title', type:'text', placeholder:'title', value:"#{@model.get('title')}"
          div class:'control-group', ->
            select 'data-field':'sharing', ->
              for value, label of @sharingValues
                option selected:"#{if @model.get('sharing') is value then 'selected' else ''}", value:"#{value}", "#{label}"
    



  _.extend exports, {
    Model: Model
    Collection: Collection
    Router: Router
    Views: Views
  }


module "App.YT", (exports, glo)->

  class Model extends Backbone.Model

    parse: (resp)->
      obj =
        id: resp.media$group.yt$videoid.$t
        duration: resp.media$group.yt$duration.seconds
        src: resp.media$group.media$content[0].url
        title: resp.media$group.media$title.$t
        description: resp.media$group.media$description.$t
        thumbnail: resp.media$group.media$thumbnail[2].url

  class Collection extends Backbone.Collection
    url: 'http://gdata.youtube.com/feeds/api/videos?v=2&alt=json'
    model: Model

    parse: (resp)->
      console.log resp.feed.entry
      resp.feed.entry

  _.extend exports, {
    Model: Model
    Collection: Collection
  }

  Views = {}


