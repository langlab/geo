_ = require 'underscore'

module.exports =

  statics:

    # provide a user-facing api base upon the handshake
    # each schema can override the access function, which should return
    # a list of allowed methods based upon the handshake 

    api: (data, cb)->
      {handshake, method, model, options} = data
    
      if (id = model?._id) and method isnt 'read' 
        # if a model is specified, find it and call the method on it
        @findById id, (err, obj)=>
          if err then cb err, null
          else 
            obj[method] data, cb
            obj.on 'event', (data)=>
              @emit 'event', data
      else
        # otherwise call a static/class method
        if @[method]?
          @[method] data, cb
        else cb { message: 'invalid method' }, null



    echo: (data, cb)->
      data.who = data.handshake.userId
      @emit 'event', data
      cb null, data


    
