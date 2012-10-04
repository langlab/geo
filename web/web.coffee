CFG = require '../conf'
express = require 'express'
everyauth = require 'everyauth'
RedisStore = require('connect-redis')(express)
store = new RedisStore()
app = express()
ck = require 'coffeekup'


User = require '../api/db/user'

everyauth.everymodule.userPkey '_id'

everyauth.everymodule.findUserById (userId, cb)->
  User.findById userId, cb

everyauth.twitter
  .consumerKey(CFG.TWITTER.CONSUMER_KEY)
  .consumerSecret(CFG.TWITTER.CONSUMER_SECRET)
  .callbackPath('/twitter/callback')
  .findOrCreateUser( (session, accessToken, accessTokenSecret, twitterData)->
    
    promise = @Promise()

    User.auth twitterData, (err,resp)->
      #console.log util.inspect resp
      if err
        promise.fail err
        return
      else
        console.log 'fulfilling promise:'
        promise.fulfill resp

    return promise

  ).redirectPath('/')

everyauth.dailycred
  .appId('b1c1e826-0e69-4fc5-b8c6-1205f6b23118')
  .findOrCreateUser( (session, accessToken, accessTokenExtra, dcUserMetadata)->
    promise = @Promise()

    User.dcAuth dcUserMetadata, (err,resp)->
      #console.log util.inspect resp
      if err
        console.log 'promise failed!',err
        promise.fail err
        return
      else
        console.log 'fulfilling promise'
        promise.fulfill resp

    return promise

  ).redirectPath '/'


app.configure ->
  app.use express.cookieParser()
  app.use express.session {
    secret: 'keyboardCat'
    key: 'sessionId'
    cookie: { domain: '.langlab.org' }
    store: store
  }

  app.use everyauth.middleware()
  app.use express.bodyParser()


app.get '/user', (req,res)->
  res.json {
    user: req.user
    session: req.session
    ssId: res.session?.id
  }


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

