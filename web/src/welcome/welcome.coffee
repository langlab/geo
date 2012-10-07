

module "App.Welcome", (exports, glo)->
  
  class Model extends BB.Model


  


  class Views.Main extends BB.View
    tagName: 'div'
    className: 'welcome'


    template: ->
      h3 "lingualab"
      ul class:'button-group', ->
        li -> a href:'#login', class:'small button',   "Sign in"
        li -> button class:'small success button', "Sign up"


  class Router extends BB.Router

    initialize: (@options)->
      _.extend @, @options
      @views.signin = new App.User.Views.Signin user: @data.user
      @views.signin.render()

    routes:
      'login':'login'

    login: ->
      @views.signin.reveal()
      


  _.extend exports, {
    Model: Model
    Views: Views
    Router: Router
  }

