
require 'flour'
fs = require 'fs' 
EventEmitter = require('events').EventEmitter
{spawn,exec} = require 'child_process'
async = require 'async'
_ = require 'underscore'
util = require 'util'

modules = {
  app: ['all','app','welcome','home','media']
}


vendor = (cb)->
  bundle './web/vendor/*.js', './web/pub/vendor.min.js', cb

style = (cb)->
  compile './web/src/index.styl', './web/pub/index.css', cb

module = (name,cb)->
  script = ""

  saveScriptWhenDone = _.after (modules[name].length-1), ->
    fs.writeFileSync "./web/pub/#{name}.js", script, 'utf8'
    if cb then cb()
    # minify "./web/pub/app.js", "./web/pub/app.min.js", cb

  for app in modules[name]
    bundle "./web/src/#{app}/*.coffee", '', (output)->
      script += output
      saveScriptWhenDone()

commit = (msg)->
  msg ?= "small changes"
  dep = exec "git add . && git commit -a -m '#{msg}' && git push"
  dep.stdout.on 'data', (data)-> console.log "git: #{data}"
  dep.stderr.on 'data', (data)-> console.log "git: #{data}"
  dep.on 'exit', -> console.log 'done.'



task 'build:vendor', "bundle and minify the vendor javascript", vendor
task 'build:style', "compile all css into one file", style
task 'build:module', "bundle and minify all app module javascript into one file", module 'app'

option '-m', '--message [MESSAGE]', 'commit and push with message'
task 'commit', "commit changes and push", (options)-> 
  commit options.message



task "dev", ->

  vendor -> style -> module 'app'

  watch './web/vendor/', -> vendor
  watch './web/src/', -> style -> module 'app'




