
module "App", (exports, glo)->
  
  BB = glo.BB
  
  class Model
    name: 'LangLab'

    constructor: ->

      @data =
        media: new App.Media.Collection

      @views =
        home: new Home

      @routers =
        main: new Router { data: @data, views: @views }
        media: new App.Media.Router { data: @data, views: @views }

      @socketConnect()

      @connection.on 'connect', =>
        
        glo.Backbone.history.start() unless glo.Backbone.History.started

        

      

    socketConnect: ->
      @connection = window.sock = window.io.connect "/"
      #@connectionView = new App.Connection.Views.Main { model: @connection }
      @

  class Router extends BB.Router

    routes:
      '': 'home'

    home: -> 
      @views.home.render().open()


  Views = {}

  class Home extends BB.View
    className:'home-root'
    
    template: ->
      div class:'row', ->
        a class:'span4 h3', href:"#media", "Media"
        a class:'span4 h3', href:"#students", "Students"
        a class:'span4 h3', href:"#activities", "Activities"


  _.extend exports, {
    Model: Model
    Router: Router
    Views: Views
  }


$ ->
  window.app = new App.Model