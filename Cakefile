
require 'flour'
fs = require 'fs' 
EventEmitter = require('events').EventEmitter
{spawn,exec} = require 'child_process'
async = require 'async'
_ = require 'underscore'
util = require 'util'


modules = ['app','ui','welcome','home','media']

vendor = (cb)->
  bundle './web/vendor/*.js', './web/pub/vendor.min.js', cb

style = (cb)->
  compile './web/src/index.styl', './web/pub/index.css', cb

app = (cb)->

  script = ""
  saveScriptWhenDone = _.after (modules.length-1), ->
    # put the app js at the end
    fs.writeFileSync './web/pub/app.js', script, 'utf8'
    minify './web/pub/app.js', './web/pub/app.min.js', cb

  for module in modules
    bundle "./web/src/#{module}/*.coffee", '', (output)->
      script += output
      saveScriptWhenDone()

assets = (cb)->
  for module in modules
    spawn 'cp', ["./web/src/#{module}/assets/*",'./web/pub/assets/']
    spawn.on 'exit', cb()

deploy = (msg)->
  msg ?= "small changes"
  dep = exec "git add . && git commit -a -m '#{msg}' && git push"
  dep.stdout.on 'data', (data)-> console.log "git: #{data}"
  dep.stderr.on 'data', (data)-> console.log "git: #{data}"
  dep.on 'exit', -> console.log 'done.'


task 'build:vendor', "bundle and minify the vendor javascript", vendor
task 'build:style', "compile all css into one file", style
task 'build:app', "bundle and minify all app module javascript into one file", app
task 'build:assets', "copy all module images and fonts over to the public directory", assets
task 'deploy', "deploy to server", deploy



task "dev", ->

  vendor style app deploy 'small changes'

  watch './web/src', -> vendor style app deploy

  watch './geo.coffee', -> deploy
  watch './web/web.coffee', -> deploy 'small changes'
  watch './api/', -> deploy


  



