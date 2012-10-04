
module "BB", (exports, glo)->

  sync = (method,model,options)->
    console.log 'emitting sync: ',@syncName, method, model, options
    window.sock.emit 'api', @syncName, {
      method: method
      model: model
      options: options
    }, (err, response)->
      console.log err,response
      if err then options.error response
      else options.success response




  class Model extends Backbone.Model
    io: glo.io
    idAttribute: '_id'

    initialize: (@options)->
      _.extend @, @options
      @

    sync: sync

    api: (method, data, cb)->
      window.sock.emit 'api', @syncName, {
        method: method
        model: @toJSON()
        options: data
      }, cb


  class Collection extends Backbone.Collection
    io: glo.io

    initialize: (@options)->
      _.extend @, @options
      @

    getByIds: (ids)->
      @filter (m)-> m.id in ids

    sync: sync

    api: (method, data, cb)->
      window.sock.emit 'api', @syncName, {
        method: method
        model: null
        options: data
      }, cb



  class View extends Backbone.View
    io: glo.io

    initialize: (@options)->
      _.extend @, @options
      @

    # play sound effects
    sfx: (name)=>
      el = new Audio()
      el.src = "/sfx/#{name}.#{if Modernizr.audio.mp3 then 'mp3' else 'wav'}"
      pc = new Popcorn el
      pc.play()
      pc.on 'ended', -> pc.destroy()
      pc

    # speak text
    tts: (options)=>
      {language,gender,textToSay,rate} = options
      el = new Audio()
      el.src = "http://tts.langlab.org/#{language}/#{gender}?text=#{textToSay}&rate=#{rate}"
      #el = $('<audio/>').attr('src',"http://tts.langlab.org/#{language}/#{gender}?text=#{textToSay}&rate=#{rate}")[0]
      pc = new Popcorn el
      pc.play()
      pc.on 'ended', -> pc.destroy()
      pc

    # base rendering function
    render: ->
      @preRender?()
      @$el.html ck.render @template, @
      @postRender?()
      @

    open: (cont = '#main')->
      @$el.appendTo cont
      @trigger 'open', cont
      @isOpen = true
      @

    close: ->
      @unbind()
      @undelegateEvents()
      @remove()
      @trigger 'close'
      @isOpen = false
      @


  class Router extends Backbone.Router
    initialize: (@options)->
      _.extend @, @options
      @

    clearViews: (exceptFor)->
      if not _.isArray exceptFor then exceptFor = [exceptFor]
      view.close() for key,view of @views when not (key in exceptFor)


  _.extend exports, {
    Model: Model
    Collection: Collection
    View: View
    Router: Router
  }
