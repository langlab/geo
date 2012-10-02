_ = require 'underscore'

module.exports =

  statics:

    # provide a user-facing api base upon the handshake
    # each schema can override the access function, which should return
    # a list of allowed methods based upon the handshake 

    api: (data, cb)->
      {handshake, method, model, options} = data
      access = @access handshake
      
      if method in (access?.allowedFunctions ? [])
        data.access = access
        if (id = model?._id) 
          # if a model is specified, find it and call the method on it
          @findById id, (err, obj)->
            if err then cb err, null
            else obj[method] data, cb
        else
          # otherwise call a static/class method
          @[method] data, cb

      else
        cb { message: 'unauthorized' }, null


    echo: (data, cb)->
      data.who = data.handshake.userId
      @emit 'event', data
      cb null, data


    
