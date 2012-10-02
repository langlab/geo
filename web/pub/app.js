(function() {

  console.log('welcome');

}).call(this);
(function() {

  console.log('ui');

}).call(this);
(function() {

  console.log('home');

}).call(this);
(function() {

  console.log('file');

}).call(this);
(function() {
  var _this = this,
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

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module("BB", function(exports, glo) {
    var Collection, Model, Router, View;
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
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module("App", function(exports, glo) {
    var BB, Home, Model, Router, Views;
    BB = glo.BB;
    Model = (function() {

      Model.prototype.name = 'Lab';

      function Model() {
        var _this = this;
        this.socketConnect();
        this.connection.on('connect', function() {
          return _this.views.home.render().open();
        });
        this.routers = {
          main: new Router
        };
        this.views = {
          home: new Home
        };
      }

      Model.prototype.socketConnect = function() {
        this.connection = window.sock = window.io.connect("/");
        this.connectionView = new App.Connection.Views.Main({
          model: this.connection
        });
        return this;
      };

      return Model;

    })();
    Router = (function(_super) {

      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      return Router;

    })(BB.Router);
    Views = {};
    Home = (function(_super) {

      __extends(Home, _super);

      function Home() {
        return Home.__super__.constructor.apply(this, arguments);
      }

      Home.prototype.template = function() {};

      return Home;

    })(BB.View);
    return _.extend(exports, {
      Model: Model,
      Router: Router,
      Views: Views
    });
  });

  $(function() {
    return window.app = new App.Model;
  });

}).call(this);
