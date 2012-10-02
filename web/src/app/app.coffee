
module "App", (exports, glo)->
  
  BB = glo.BB
  
  class Model
    name: 'Lab'

    constructor: ->
      @socketConnect()
      @connection.on 'connect', =>
        @views.home.render().open()

      @routers =
        main: new Router

      @views =
        home: new Home

    socketConnect: ->
      @connection = window.sock = window.io.connect "/"
      @connectionView = new App.Connection.Views.Main { model: @connection }
      @

  class Router extends BB.Router


  Views = {}

  class Home extends BB.View
    template: ->


  _.extend exports, {
    Model: Model
    Router: Router
    Views: Views
  }


$ ->
  window.app = new App.Model