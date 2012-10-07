
module "App", (exports, glo)->
  
  BB = glo.BB
  
  class Model
    name: 'Lab'

    constructor: ->
      window.filepicker?.setKey(w.CFG.FILEPICKER.KEY)

      @data =
        user: new App.User.Model
        media: new App.Media.Collection

      @views =
        home: new Home
        welcome: new App.Welcome.Views.Main

      @routers =
        main: new Router { data: @data, views: @views }
        media: new App.Media.Router { data: @data, views: @views }
        welcome: new App.Welcome.Router { data: @data, views: @views }

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
      if @data.user.isLoggedIn()
        @views.home.render().open()
      else
        @views.welcome.render().open()


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
    User: User
    Router: Router
    Views: Views
  }


$ ->
  window.app = new App.Model