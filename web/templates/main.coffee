

template = ->
  doctype 5
  html ->
    head ->
      link rel:"stylesheet", type:"text/css", href:"./bootstrap.min.css"
      link rel:"stylesheet", type:"text/css", href:"./index.css"

    body ->
      h1 'hi'
      div id:'#main', class:'container'
      script type:"text/javascript", src:"/socket.io/socket.io.js"
      script type:"text/javascript", src:"./ck.js"
      script type:"text/javascript", src:"//api.filepicker.io/v0/filepicker.js"
      script type:"text/javascript", src:"./vendor.min.js"
      script type:"text/javascript", src:"./app.min.js"

module.exports = template