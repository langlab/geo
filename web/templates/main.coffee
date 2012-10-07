

template = ->
  doctype 5
  html ->
    head ->
      link rel:"stylesheet", type:"text/css", href:"./foundation.min.css"
      link rel:"stylesheet", type:"text/css", href:"./index.css"

    body ->
      div id:'main'
      div id:'modals'
      script """
        window.CFG = JSON.parse('#{JSON.stringify @CFG.CLIENT()}');
      """
      script type:"text/javascript", src:"/socket.io/socket.io.js"
      script type:"text/javascript", src:"./ck.js"
      script type:"text/javascript", src:"//api.filepicker.io/v0/filepicker.js"
      script type:"text/javascript", src:"./vendor.min.js"
      script src:'//www.dailycred.com/public/js/dailycred.coffee', type:'text/javascript'
      script type:"text/javascript", src:"./app.js"
      

module.exports = template