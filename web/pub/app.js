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
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module("App", function(exports, glo) {
    var BB, Home, Model, Router, Views;
    BB = glo.BB;
    Model = (function() {

      Model.prototype.name = 'LangLab';

      function Model() {
        var _this = this;
        this.data = {
          media: new App.Media.Collection
        };
        this.views = {
          home: new Home
        };
        this.routers = {
          main: new Router({
            data: this.data,
            views: this.views
          }),
          media: new App.Media.Router({
            data: this.data,
            views: this.views
          })
        };
        this.socketConnect();
        this.connection.on('connect', function() {
          if (!glo.Backbone.History.started) {
            return glo.Backbone.history.start();
          }
        });
      }

      Model.prototype.socketConnect = function() {
        this.connection = window.sock = window.io.connect("/");
        return this;
      };

      return Model;

    })();
    Router = (function(_super) {

      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.routes = {
        '': 'home'
      };

      Router.prototype.home = function() {
        return this.views.home.render().open();
      };

      return Router;

    })(BB.Router);
    Views = {};
    Home = (function(_super) {

      __extends(Home, _super);

      function Home() {
        return Home.__super__.constructor.apply(this, arguments);
      }

      Home.prototype.className = 'home-root';

      Home.prototype.template = function() {
        return div({
          "class": 'row'
        }, function() {
          a({
            "class": 'span4 h3',
            href: "#media"
          }, "Media");
          a({
            "class": 'span4 h3',
            href: "#students"
          }, "Students");
          return a({
            "class": 'span4 h3',
            href: "#activities"
          }, "Activities");
        });
      };

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
(function() {

  console.log('ui');

}).call(this);
(function() {

  console.log('welcome');

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.CFG = {
    S3: {
      KEY: 'AKIAIUJTVW7ZLSILOJRA',
      SECRET: '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',
      MEDIA_BUCKET: 'geolab-media',
      URL_ROOT: 'https://s3.amazonaws.com/'
    }
  };

  module("App.Media", function(exports, glo) {
    var BB, Collection, Model, Router, Views;
    BB = glo.BB;
    Model = (function(_super) {

      __extends(Model, _super);

      function Model() {
        return Model.__super__.constructor.apply(this, arguments);
      }

      Model.prototype.syncName = 'media';

      Model.prototype.type = function() {
        return this.get('fpData').type.split('/')[0];
      };

      Model.prototype.currentProgress = function() {
        return parseInt(this.get('progress'), 10);
      };

      Model.prototype.thumbnailSrc = function() {
        if (this.type() === 'video') {
          if (this.currentProgress() < 100) {
            return "http://lorempixel.com/400/300/abstract/2/PROCESSING%20VIDEO/";
          } else {
            return "" + CFG.S3.URL_ROOT + CFG.S3.MEDIA_BUCKET + "/" + (this.get('urlBase')) + "_0004.png";
          }
        } else {
          return "/assets/sound.png";
        }
      };

      Model.prototype.urlBase = function() {
        return "" + (App.Utils.Encode.toHex(this.get('fpData').url));
      };

      Model.prototype.src = function() {
        var ext;
        if (this.type() === 'video') {
          ext = Modernizr.video.webm ? 'webm' : 'mp4';
        } else {
          ext = 'mp3';
        }
        return "" + CFG.S3.URL_ROOT + CFG.S3.MEDIA_BUCKET + "/" + (this.get('urlBase')) + "." + ext;
      };

      return Model;

    })(BB.Model);
    Collection = (function(_super) {

      __extends(Collection, _super);

      function Collection() {
        return Collection.__super__.constructor.apply(this, arguments);
      }

      Collection.prototype.syncName = 'media';

      Collection.prototype.model = Model;

      Collection.prototype.dbEvent = function(data) {
        var event, m, model, progress;
        event = data.event, model = data.model, progress = data.progress;
        if (event === 'progress') {
          m = this.get(model._id);
          m.set('progress', progress);
          return console.log('updated: ', m);
        }
      };

      Collection.prototype.fetchMyVideo = function(options) {
        var _this = this;
        if (options == null) {
          options = {};
        }
        return this.api('myVideo', options, function(err, data) {
          _this.reset(data);
          return cb();
        });
      };

      Collection.prototype.fetchMyAudio = function(options) {
        var _this = this;
        if (options == null) {
          options = {};
        }
        return this.api('myAudio', options, function(err, data) {
          _this.reset(data);
          return cb();
        });
      };

      Collection.prototype.fetchSharedVideo = function(options) {
        var _this = this;
        if (options == null) {
          options = {};
        }
        options.type = 'video';
        return this.api('sharedMediaOfType', options, function(err, data) {
          _this.reset(data);
          return cb();
        });
      };

      return Collection;

    })(BB.Collection);
    Router = (function(_super) {

      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.initialize = function(options) {
        this.options = options;
        _.extend(this, this.options);
        return this.data.media = new Collection;
      };

      Router.prototype.routes = {
        'media': 'list',
        'media/:id': 'detail'
      };

      Router.prototype.list = function() {
        var _this = this;
        this.clearViews();
        this.views.list = new Views.List({
          collection: this.data.media
        });
        return this.data.media.fetch({
          success: function() {
            return _this.views.list.open();
          }
        });
      };

      Router.prototype.detail = function(id) {
        var _this = this;
        this.clearViews();
        this.views.detail = new Views.Detail({
          model: new Model({
            _id: id
          })
        });
        return this.views.detail.model.fetch({
          success: function() {
            return _this.views.detail.render().open();
          }
        });
      };

      return Router;

    })(BB.Router);
    Views = {};
    Views.IconItem = (function(_super) {

      __extends(IconItem, _super);

      function IconItem() {
        this.updateProgress = __bind(this.updateProgress, this);
        return IconItem.__super__.constructor.apply(this, arguments);
      }

      IconItem.prototype.tagName = 'li';

      IconItem.prototype.className = 'span3 media-icon-item';

      IconItem.prototype.initialize = function() {
        return this.model.on('change:progress', this.updateProgress);
      };

      IconItem.prototype.events = {
        'click .delete': function() {
          return this.model.destroy();
        }
      };

      IconItem.prototype.updateProgress = function() {
        if (this.model.currentProgress() < 100) {
          return this.$('.bar').css('width', "" + (this.model.currentProgress()) + "%");
        } else {
          return this.render();
        }
      };

      IconItem.prototype.template = function() {
        return span({
          "class": 'thumbnail'
        }, function() {
          img({
            src: "" + (this.model.thumbnailSrc())
          });
          if (this.model.currentProgress() < 100) {
            div({
              "class": 'progress progress-striped active progress-warning',
              style: 'height:10px'
            }, function() {
              return div({
                "class": 'bar',
                style: "width: " + (this.model.currentProgress()) + "%"
              });
            });
          }
          return div({
            "class": 'caption'
          }, function() {
            a({
              href: "#media/" + this.model.id
            }, "" + (this.model.get('title')));
            return span({
              "class": 'icon-trash delete'
            });
          });
        });
      };

      return IconItem;

    })(BB.View);
    Views.List = (function(_super) {

      __extends(List, _super);

      function List() {
        this.createFromUpload = __bind(this.createFromUpload, this);
        return List.__super__.constructor.apply(this, arguments);
      }

      List.prototype.tagName = 'div';

      List.prototype.className = 'media-list';

      List.prototype.initialize = function() {
        var _this = this;
        this.collection.on('reset', function() {
          return _this.render();
        });
        this.collection.on('add', function() {
          return _this.render();
        });
        return this.collection.on('remove', function() {
          return _this.render();
        });
      };

      List.prototype.events = {
        'click .upload-file': function() {
          var fpOptions;
          fpOptions = {
            metadata: true
          };
          return filepicker.getFile('*/*', fpOptions, this.createFromUpload);
        }
      };

      List.prototype.createFromUpload = function(url, data) {
        var title;
        title = prompt('Please enter a name for your media:', data.filename);
        return this.collection.create({
          fpData: data,
          fpUrl: url,
          title: title
        }, {
          wait: true
        });
      };

      List.prototype.template = function() {
        div({
          "class": 'btn-group'
        }, function() {
          return button({
            "class": 'btn upload-file'
          }, "upload file");
        });
        return ul({
          "class": 'thumbnails'
        }, function() {});
      };

      List.prototype.render = function() {
        var media, v, _i, _len, _ref;
        List.__super__.render.call(this);
        _ref = this.collection.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          media = _ref[_i];
          v = new Views.IconItem({
            model: media
          });
          v.render().open(this.$('.thumbnails'));
        }
        return this;
      };

      return List;

    })(BB.View);
    Views.Detail = (function(_super) {

      __extends(Detail, _super);

      function Detail() {
        return Detail.__super__.constructor.apply(this, arguments);
      }

      Detail.prototype.tagName = 'div';

      Detail.prototype.className = 'media-detail';

      Detail.prototype.initialize = function() {};

      Detail.prototype.events = {
        'change [data-field]': 'save'
      };

      Detail.prototype.save = function(e) {
        var field, value;
        field = $(e.currentTarget).attr('data-field');
        value = $(e.currentTarget).val();
        return this.model.save(field, value);
      };

      Detail.prototype.sharingValues = {
        'private': 'Private',
        'colleagues': 'Share with my colleagues',
        'everyone': 'Share with everyone'
      };

      Detail.prototype.template = function() {
        return div({
          "class": 'row'
        }, function() {
          div({
            "class": 'span6'
          }, function() {
            return video({
              controls: 'controls',
              src: "" + (this.model.src())
            });
          });
          return div({
            "class": 'span6'
          }, function() {
            div({
              "class": 'control-group'
            }, function() {
              return input({
                'data-field': 'title',
                type: 'text',
                placeholder: 'title',
                value: "" + (this.model.get('title'))
              });
            });
            return div({
              "class": 'control-group'
            }, function() {
              return select({
                'data-field': 'sharing'
              }, function() {
                var label, value, _ref, _results;
                _ref = this.sharingValues;
                _results = [];
                for (value in _ref) {
                  label = _ref[value];
                  _results.push(option({
                    selected: "" + (this.model.get('sharing') === value ? 'selected' : ''),
                    value: "" + value
                  }, "" + label));
                }
                return _results;
              });
            });
          });
        });
      };

      return Detail;

    })(BB.View);
    return _.extend(exports, {
      Model: Model,
      Collection: Collection,
      Router: Router,
      Views: Views
    });
  });

  module("App.YT", function(exports, glo) {
    var Collection, Model, Views;
    Model = (function(_super) {

      __extends(Model, _super);

      function Model() {
        return Model.__super__.constructor.apply(this, arguments);
      }

      Model.prototype.parse = function(resp) {
        var obj;
        return obj = {
          id: resp.media$group.yt$videoid.$t,
          duration: resp.media$group.yt$duration.seconds,
          src: resp.media$group.media$content[0].url,
          title: resp.media$group.media$title.$t,
          description: resp.media$group.media$description.$t,
          thumbnail: resp.media$group.media$thumbnail[2].url
        };
      };

      return Model;

    })(Backbone.Model);
    Collection = (function(_super) {

      __extends(Collection, _super);

      function Collection() {
        return Collection.__super__.constructor.apply(this, arguments);
      }

      Collection.prototype.url = 'http://gdata.youtube.com/feeds/api/videos?v=2&alt=json';

      Collection.prototype.model = Model;

      Collection.prototype.parse = function(resp) {
        console.log(resp.feed.entry);
        return resp.feed.entry;
      };

      return Collection;

    })(Backbone.Collection);
    _.extend(exports, {
      Model: Model,
      Collection: Collection
    });
    return Views = {};
  });

}).call(this);
(function() {

  console.log('home');

}).call(this);
