
require 'flour'
fs = require 'fs' 
EventEmitter = require('events').EventEmitter
{spawn} = require 'child_process'
async = require 'async'
_ = require 'underscore'
util = require 'util'


modules = ['ui','welcome','home','file','app']

task 'build:vendor', "bundle and minify the vendor javascript", ->
  bundle './web/vendor/*.js', './web/pub/vendor.min.js'


task 'build:style', "compile all css into one file", ->
  compile './web/src/index.styl', './web/pub/index.css'


task 'build:app', "bundle and minify all app module javascript into one file", ->

  script = ""
  saveScriptWhenDone = _.after (modules.length-1), ->
    # put the app js at the end
    fs.writeFileSync './web/pub/app.js', script, 'utf8'
    minify './web/pub/app.js', './web/pub/app.min.js'

  for module in modules
    bundle "./web/src/#{module}/*.coffee", '', (output)->
      script += output
      saveScriptWhenDone()


task 'build:assets', "copy all module images and fonts over to the public directory", ->
  
  for module in modules
    spawn 'cp', ['./web/pub/assets/']



task "dev", ->

  invoke 'build:style'
  invoke 'build:vendor'
  invoke 'build:app'
  
  watch './web/vendor/', ->
    invoke 'build:vendor'

  watch './web/src/', ->
    invoke 'build:style'
    invoke 'build:app'

    




