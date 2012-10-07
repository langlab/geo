(function() {
  var _ref,
    _this = this,
    __slice = [].slice;

  window.w = window;

  w.ck = window.CoffeeKup;

  w.wait = function(someTime, thenDo) {
    return setTimeout(thenDo, someTime);
  };

  w.doEvery = function(someTime, action) {
    return setInterval(action, someTime);
  };

  w.logging = true;

  w.log = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (w.logging) {
      return typeof console !== "undefined" && console !== null ? console.log.apply(console, args) : void 0;
    }
  };

  window.module = function(target, name, block) {
    var item, top, _i, _len, _ref, _ref1;
    if (arguments.length < 3) {
      _ref = [(typeof exports !== 'undefined' ? exports : window)].concat(__slice.call(arguments)), target = _ref[0], name = _ref[1], block = _ref[2];
    }
    top = target;
    _ref1 = name.split('.');
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      item = _ref1[_i];
      target = target[item] || (target[item] = {});
    }
    return block(target, top);
  };

  if ((_ref = window.filepicker) != null) {
    _ref.setKey('Ag4e6fVtyRNWgXY2t3Dccz');
  }

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module("BB", function(exports, glo) {
    var Collection, Model, Router, View, sync;
    sync = function(method, model, options) {
      console.log('emitting sync: ', this.syncName, method, model, options);
      return window.sock.emit('api', this.syncName, {
        method: method,
        model: model,
        options: options
      }, function(err, response) {
        console.log(err, response);
        if (err) {
          return options.error(response);
        } else {
          return options.success(response);
        }
      });
    };
    Model = (function(_super) {

      __extends(Model, _super);

      function Model() {
        return Model.__super__.constructor.apply(this, arguments);
      }

      Model.prototype.io = glo.io;

      Model.prototype.idAttribute = '_id';

      Model.prototype.initialize = function(options) {
        this.options = options;
        _.extend(this, this.options);
        return this;
      };

      Model.prototype.sync = sync;

      Model.prototype.api = function(method, data, cb) {
        return window.sock.emit('api', this.syncName, {
          method: method,
          model: this.toJSON(),
          options: data
        }, cb);
      };

      return Model;

    })(Backbone.Model);
    Collection = (function(_super) {

      __extends(Collection, _super);

      function Collection() {
        return Collection.__super__.constructor.apply(this, arguments);
      }

      Collection.prototype.io = glo.io;

      Collection.prototype.initialize = function(options) {
        this.options = options;
        _.extend(this, this.options);
        return this;
      };

      Collection.prototype.getByIds = function(ids) {
        return this.filter(function(m) {
          var _ref;
          return _ref = m.id, __indexOf.call(ids, _ref) >= 0;
        });
      };

      Collection.prototype.sync = sync;

      Collection.prototype.api = function(method, data, cb) {
        return window.sock.emit('api', this.syncName, {
          method: method,
          model: null,
          options: data
        }, cb);
      };

      return Collection;

    })(Backbone.Collection);
    View = (function(_super) {

      __extends(View, _super);

      function View() {
        this.tts = __bind(this.tts, this);

        this.sfx = __bind(this.sfx, this);
        return View.__super__.constructor.apply(this, arguments);
      }

      View.prototype.io = glo.io;

      View.prototype.initialize = function(options) {
        this.options = options;
        _.extend(this, this.options);
        return this;
      };

      View.prototype.sfx = function(name) {
        var el, pc;
        el = new Audio();
        el.src = "/sfx/" + name + "." + (Modernizr.audio.mp3 ? 'mp3' : 'wav');
        pc = new Popcorn(el);
        pc.play();
        pc.on('ended', function() {
          return pc.destroy();
        });
        return pc;
      };

      View.prototype.tts = function(options) {
        var el, gender, language, pc, rate, textToSay;
        language = options.language, gender = options.gender, textToSay = options.textToSay, rate = options.rate;
        el = new Audio();
        el.src = "http://tts.langlab.org/" + language + "/" + gender + "?text=" + textToSay + "&rate=" + rate;
        pc = new Popcorn(el);
        pc.play();
        pc.on('ended', function() {
          return pc.destroy();
        });
        return pc;
      };

      View.prototype.render = function() {
        if (typeof this.preRender === "function") {
          this.preRender();
        }
        this.$el.html(ck.render(this.template, this));
        if (typeof this.postRender === "function") {
          this.postRender();
        }
        return this;
      };

      View.prototype.open = function(cont) {
        if (cont == null) {
          cont = '#main';
        }
        this.$el.appendTo(cont);
        this.trigger('open', cont);
        this.isOpen = true;
        return this;
      };

      View.prototype.close = function() {
        this.unbind();
        this.undelegateEvents();
        this.remove();
        this.trigger('close');
        this.isOpen = false;
        return this;
      };

      return View;

    })(Backbone.View);
    Router = (function(_super) {

      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.initialize = function(options) {
        this.options = options;
        _.extend(this, this.options);
        return this;
      };

      Router.prototype.clearViews = function(exceptFor) {
        var key, view, _ref, _results;
        if (!_.isArray(exceptFor)) {
          exceptFor = [exceptFor];
        }
        _ref = this.views;
        _results = [];
        for (key in _ref) {
          view = _ref[key];
          if (!(__indexOf.call(exceptFor, key) >= 0)) {
            _results.push(view.close());
          }
        }
        return _results;
      };

      return Router;

    })(Backbone.Router);
    return _.extend(exports, {
      Model: Model,
      Collection: Collection,
      View: View,
      Router: Router
    });
  });

}).call(this);

(function() {

  console.log('ui');

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module("App.Welcome", function(exports, glo) {
    var Login, Model;
    Model = (function(_super) {

      __extends(Model, _super);

      function Model() {
        return Model.__super__.constructor.apply(this, arguments);
      }

      return Model;

    })(BB.Model);
    Login = (function(_super) {

      __extends(Login, _super);

      function Login() {
        return Login.__super__.constructor.apply(this, arguments);
      }

      Login.prototype.tagName = 'div';

      Login.prototype.className = 'login';

      Login.prototype.template = function() {
        return form({
          "class": 'form-horizontal'
        }, function() {
          div({
            "class": 'control-group'
          }, function() {
            return input({
              type: 'text',
              placeholder: 'email'
            });
          });
          return div({
            "class": 'control-group'
          }, function() {
            return input({
              type: 'password',
              placeholder: 'password'
            });
          });
        });
      };

      return Login;

    })(BB.View);
    return _.extend(exports({
      Model: Model,
      Login: Login
    }));
  });

}).call(this);
