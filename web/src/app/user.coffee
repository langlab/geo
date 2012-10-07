
module "App.User", (exports, glo)->
  
  class User extends BB.Model

    isLoggedIn: -> false


  _.extend exports, {
    Model: Model
  }