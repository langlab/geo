CFG = require '../conf'
express = require 'express'
everyauth = require 'everyauth'
RedisStore = require('connect-redis')(express)
store = new RedisStore()
app = express()
ck = require 'coffeekup'


User = require '../api/db/user'


app.configure ->
  app.use express.cookieParser()
  app.use express.session {
    secret: 'keyboardCat'
    key: 'sessionId'
    cookie: { domain: '.langlab.org' }
    store: store
  }
  app.use express.bodyParser()

templates =
  main: require './templates/main'


app.get '/user', (req,res)->
  res.json {
    user: req.user
    session: req.session
    ssId: res.session?.id
  }

app.get '/', (req,res)->
  res.send ck.render templates.main, { req: req, res: res }

# serving assets
serveFile = (path,res)->
  res.sendfile "#{__dirname}/pub/#{path}"

app.get '/:path?', (req,res)->
  {path} = req.params
  path ?= 'index.html'
  serveFile path, res

app.get '/assets/:path', (req,res)->
  {path} = req.params
  serveFile "assets/#{path}", res


module.exports = app

