window.w = window
w.ck = window.CoffeeKup

# make setTimeout and setInterval less awkward
# by switching the parameters!!

w.wait = (someTime,thenDo) ->
  setTimeout thenDo, someTime
w.doEvery = (someTime,action)->
  setInterval action, someTime

w.logging = true #turn on/off console logging

w.log = (args...)=>
  if w.logging
    console?.log args...

# to create modules/namespaces
window.module = (target, name, block) ->
  [target, name, block] = [(if typeof exports isnt 'undefined' then exports else window), arguments...] if arguments.length < 3
  top    = target
  target = target[item] or= {} for item in name.split '.'
  block target, top

window.filepicker?.setKey('Ag4e6fVtyRNWgXY2t3Dccz')
# Stripe?.setPublishableKey('pk_04LnDZEuRgae5hqjKjFaWjFyTYFgs')




