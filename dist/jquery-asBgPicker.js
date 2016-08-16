/**
* jQuery asBgPicker
* a jquery plugin
* Compiled: Tue Aug 16 2016 16:30:47 GMT+0800 (CST)
* @version v0.1.1
* @link https://github.com/amazingSurge/jquery-asBgPicker
* @copyright LGPL-3.0
*/
(function(global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'jQuery'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('jQuery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.jQuery);
    global.jqueryAsBgPicker = mod.exports;
  }
})(this,

  function(exports, _jQuery) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _jQuery2 = _interopRequireDefault(_jQuery);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;

          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);

        if (staticProps)
          defineProperties(Constructor, staticProps);

        return Constructor;
      };
    }();

    var defaults = {
      namespace: '',
      skin: null,
      image: 'images/defaults.png', // "..\/xxxx\/images\/xxxx.png"
      lang: 'en',
      repeat: {
        defaultValue: 'repeat',
        values: ['no-repeat', 'repeat', 'repeat-x', 'repeat-y'],
        tpl: function tpl() {
          'use strict';

          return '<div class="{{namespace}}-repeat">' + '<span class="{{namespace}}-repeat-title">{{strings.bgRepeat}}</span>' + '<ul class="{{namespace}}-repeat-content">' + '<li class="repeat_no-repeat"></li>' + '<li class="repeat_repeat"></li>' + '<li class="repeat_repeat-x"></li>' + '<li class="repeat_repeat-y"></li>' + '</ul>' + '</div>';
        }
      },
      position: {
        defaultValue: 'top left',
        values: ['top left', 'top center', 'top right', 'center left', 'center center', 'center right', 'bottom left', 'bottom center', 'bottom right'],
        tpl: function tpl() {
          'use strict';

          return '<div class="{{namespace}}-position">' + '<span class="{{namespace}}-position-title">{{strings.bgPosition}}</span>' + '<ul class="{{namespace}}-position-content">' + '<li class="postion_top-left"></li>' + '<li class="postion_top-center"></li>' + '<li class="postion_top-right"></li>' + '<li class="postion_center-left"></li>' + '<li class="postion_center-center"></li>' + '<li class="postion_center-right"></li>' + '<li class="postion_bottom-left"></li>' + '<li class="postion_bottom-center"></li>' + '<li class="postion_bottom-right"></li>' + '</ul>' + '</div>';
        }
      },
      size: {
        defaultValue: 'auto',
        values: ['auto', 'cover', 'contain', '100% 100%'],
        tpl: function tpl() {
          'use strict';

          return '<div class="{{namespace}}-size">' + '<span class="{{namespace}}-size-title">{{strings.bgSize}}</span>' + '<ul class="{{namespace}}-size-content">' + '<li class="size_adapt-auto"></li>' + '<li class="size_adapt-width"></li>' + '<li class="size_adapt-height"></li>' + '<li class="size_adapt-all"></li>' + '</ul>' + '</div>';
        }
      },
      attachment: {
        namespace: 'asDropdown',
        defaultValue: 'scroll',
        values: ['scroll', 'fixed', 'inherit'],
        tpl: function tpl() {
          'use strict';

          return '<div class="{{namespace}}-attachment">' + '<span class="{{namespace}}-attachment-title">{{strings.bgAttach}}</span>' + '<div class="{{namespace}}-attachment-content">' + '<div class="{{attachNamespace}} {{namespace}}-dropdown-trigger"><i class="asIcon-caret-down"></i></div>' + '<ul>' + '<li class="attachment_scroll">scroll</li>' + '<li class="attachment_fixed">fixed</li>' + '<li class="attachment_default">default</li>' + '</ul>' + '</div>' + '</div>';
        }
      },

      tpl: function tpl() {
        'use strict';

        return '<div class="{{namespace}}">' + '<div class="{{namespace}}-initiate">' + '<i></i>{{strings.placeholder}}' + '</div>' + '<div class="{{namespace}}-info">' + '<div class="{{namespace}}-info-image">' + '<i></i><span class="{{namespace}}-info-image-name">{{strings.placeholder}}</span>' + '</div>' + '<div class="{{namespace}}-info-change">{{strings.change}}</div>' + '<a class="{{namespace}}-info-remove" href=""></a>' + '</div>' + '<div class="{{namespace}}-expand">' + '<a class="{{namespace}}-expand-close" href="#"></a>' + '<div class="{{namespace}}-expand-image-wrap">' + '<div class="{{namespace}}-expand-image"></div>' + '</div>' + '</div>' + '</div>';
      },
      process: function process(value) {
        'use strict';

        if (value && typeof value.image !== 'undefined' && value.image !== '') {

          return JSON.stringify(value);
        }

        return '';
      },
      parse: function parse(value) {
        'use strict';

        if (value) {

          return $.parseJSON(value);
        }

        return {};
      },
      getThumbnalil: function getThumbnalil(image) {
        'use strict';

        var imageData = void 0,
          imageFormat = void 0,
          imageName = void 0,
          imagePath = void 0;

        imageData = image.match(/([\S]+[\/])([\S]+)(\.+\w+$)/i);
        imagePath = imageData[1];
        imageName = imageData[2];
        imageFormat = imageData[3];

        if (imageName.search('thumbnail') === 0) {

          return imagePath + imageName + imageFormat;
        }

        return imagePath + 'thumbnail-' + imageName + imageFormat;
      },
      select: function select() {},
      onChange: function onChange() {},

      strings: {}
    };

    var pluginName = 'asBgPicker';

    defaults.namespace = pluginName;

    // main constructor

    var asBgPicker = function() {
      function asBgPicker(element, options) {
        _classCallCheck(this, asBgPicker);

        this.element = element;
        this.$element = (0, _jQuery2.default)(element);

        this.options = _jQuery2.default.extend({}, defaults, options, this.$element.data());

        // load lang strings

        if (typeof asBgPicker.Strings[this.options.lang] === 'undefined') {
          this.lang = 'en';
        } else {
          this.lang = this.options.lang;
        }
        this.strings = _jQuery2.default.extend({}, asBgPicker.Strings[this.lang], this.options.strings);

        this.namespace = this.options.namespace;

        // public properties
        this.classes = {
          // status
          skin: this.namespace + '_' + this.options.skin,
          disabled: this.namespace + '_disabled',
          active: this.namespace + '_active',
          hover: this.namespace + '_hover',
          empty: this.namespace + '_empty',
          exist: this.namespace + '_exist',
          expand: this.namespace + '_expand'
        };

        this.$element.addClass(this.namespace + '-input');
        // flag
        this.disabled = false;
        this.initialed = false;

        var self = this;
        _jQuery2.default.extend(self, {
          init: function init() {
            this._createHtml();

            if (this.options.skin) {
              this.$wrap.addClass(this.classes.skin);
            }

            this.value = this.options.parse(this.$element.val());

            this.set(this.value, false);

            if (this.options.disabled) {
              this.disable();
            }
            // init

            if (!this.value.image) {
              this.$wrap.addClass(this.classes.empty);
            }

            this.doSize.init();
            this.doAttachment.init();
            this.doPosition.init();
            this.doRepeat.init();

            this.$wrap.addClass(this.classes.exist);

            this._bindEvent();

            this.initialed = true;
            // after init end trigger 'ready'
            this._trigger('ready');
          },
          _bindEvent: function _bindEvent() {
            this.$initiate.on('click',

              function() {
                if (self.disabled) {

                  return;
                }

                self.$wrap.addClass(self.classes.expand).removeClass(self.classes.exist);
              }
            );

            this.$info.on('mouseenter',

              function() {
                if (self.disabled) {

                  return;
                }

                (0, _jQuery2.default)(this).addClass(self.classes.hover);
              }
            ).on('mouseleave',

              function() {
                if (self.disabled) {

                  return;
                }

                (0, _jQuery2.default)(this).removeClass(self.classes.hover);
              }
            );

            this.$change.on('click',

              function() {
                if (self.disabled) {

                  return;
                }

                self.$wrap.addClass(self.classes.expand).removeClass(self.classes.exist);
              }
            );

            this.$remove.on('click',

              function() {
                if (self.disabled) {

                  return;
                }

                self.clear();

                return false;
              }
            );

            this.$close.on('click',

              function() {
                if (self.disabled) {

                  return;
                }

                self.$wrap.addClass(self.classes.exist).removeClass(self.classes.expand);

                return false;
              }
            );

            this.$image.on('click',

              function() {
                if (self.disabled) {

                  return;
                }

                self.options.select.call(self);
              }
            );
          },
          _createHtml: function _createHtml() {
            this.$wrap = (0, _jQuery2.default)(this.options.tpl().replace(/\{\{namespace\}\}/g, this.namespace).replace(/\{\{strings.placeholder\}\}/g, this.strings.placeholder).replace(/\{\{strings.change\}\}/g, this.strings.change));
            this.$element.after(this.$wrap);

            this.$initiate = (0, _jQuery2.default)('.' + this.namespace + '-initiate', this.$wrap);

            this.$info = (0, _jQuery2.default)('.' + this.namespace + '-info', this.$wrap);
            this.$infoImageName = (0, _jQuery2.default)('.' + this.namespace + '-info-image-name', this.$info);
            this.$remove = (0, _jQuery2.default)('.' + this.namespace + '-info-remove', this.$info);
            this.$change = (0, _jQuery2.default)('.' + this.namespace + '-info-change', this.$info);

            this.$expand = (0, _jQuery2.default)('.' + this.namespace + '-expand', this.$wrap);
            this.$close = (0, _jQuery2.default)('.' + this.namespace + '-expand-close', this.$expand);
            this.$imageWrap = (0, _jQuery2.default)('.' + this.namespace + '-expand-image-wrap', this.$expand);
            this.$image = (0, _jQuery2.default)('.' + this.namespace + '-expand-image', this.$expand);
          },
          _trigger: function _trigger(eventType) {
            for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              params[_key - 1] = arguments[_key];
            }

            var data = [self].concat(params);

            // event
            self.$element.trigger('asBgPicker::' + eventType, data);

            // callback
            eventType = eventType.replace(/\b\w+\b/g,

              function(word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
              }
            );
            var onFunction = 'on' + eventType;

            if (typeof self.options[onFunction] === 'function') {
              var _self$options;

              (_self$options = self.options)[onFunction].apply(_self$options, params);
            }
          },
          _setState: function _setState(image) {
            if (!image || image === self.options.image) {
              self.$wrap.addClass(self.classes.empty);
            } else {
              self.$wrap.removeClass(self.classes.empty);
            }
          },
          _returnInfo: function _returnInfo(image) {
            var imgName = void 0;

            if (!image || image === self.options.image) {
              self.$infoImageName.text(self.strings.placeholder);
            } else {
              imgName = image.match(/([\S]+[\/])([\S]+\w+$)/i)[2];
              self.$infoImageName.text(imgName);
            }
          },
          _update: function _update() {
            if (self.value === null) {
              self.value = {};
            }

            self.$element.val(self.val());
            self._trigger('change', self.options.parse(self.val()), self.options.name, pluginName);
          },

          doRepeat: {
            values: self.options.repeat.values,
            defaultValue: self.options.repeat.defaultValue,
            init: function init() {
              var that = this;

              var tplContent = self.options.repeat.tpl().replace(/\{\{namespace\}\}/g, self.namespace).replace(/\{\{strings.bgRepeat\}\}/g, self.strings.bgRepeat);
              this.$tplRepeat = (0, _jQuery2.default)(tplContent);
              self.$imageWrap.after(this.$tplRepeat);

              this.$repeat = self.$expand.find('.' + self.namespace + '-repeat');
              this.$items = this.$repeat.find('li');

              _jQuery2.default.each(this.values,

                function(key, value) {
                  that.$items.eq(key).data('repeat', value);
                }
              );

              var value = typeof self.value.repeat !== 'undefined' ? self.value.repeat : this.defaultValue;
              this.set(value);

              this.bindEvent();
            },
            set: function set(value) {
              var found = false;
              this.$items.removeClass(self.classes.active);

              for (var i = 0; i < this.values.length; i++) {

                if (value === this.values[i]) {
                  self.value.repeat = value;
                  this.$items.eq(i).addClass(self.classes.active);
                  self.$image.css({
                    'background-repeat': value
                  });
                  found = true;
                }
              }

              if (!found) {
                this.set(this.defaultValue);
              }
            },
            clear: function clear() {
              this.set(this.defaultValue);
            },
            bindEvent: function bindEvent() {
              var that = this;
              this.$repeat.on('click', 'li',

                function() {
                  if (self.disabled) {

                    return;
                  }
                  var value = (0, _jQuery2.default)(this).data('repeat');
                  that.set(value);
                  self._update();

                  return false;
                }
              );
            }
          },

          doPosition: {
            values: self.options.position.values,
            defaultValue: self.options.position.defaultValue,
            init: function init() {
              var that = this;

              var tplContent = self.options.position.tpl().replace(/\{\{namespace\}\}/g, self.namespace).replace(/\{\{strings.bgPosition\}\}/g, self.strings.bgPosition);
              this.$tplPosition = (0, _jQuery2.default)(tplContent);
              self.$imageWrap.after(this.$tplPosition);

              this.$position = self.$expand.find('.' + self.namespace + '-position');
              this.$items = this.$position.find('li');

              _jQuery2.default.each(this.values,

                function(key, value) {
                  that.$items.eq(key).data('position', value);
                }
              );

              var value = typeof self.value.position !== 'undefined' ? self.value.position : this.defaultValue;
              this.set(value);

              this.bindEvent();
            },
            set: function set(value) {
              var found = false;
              this.$items.removeClass(self.classes.active);

              for (var i = 0; i < this.values.length; i++) {

                if (value === this.values[i]) {
                  self.value.position = value;
                  this.$items.eq(i).addClass(self.classes.active);
                  self.$image.css({
                    'background-position': value
                  });
                  found = true;
                }
              }

              if (!found) {
                this.set(this.defaultValue);
              }
            },
            clear: function clear() {
              this.set(this.defaultValue);
            },
            bindEvent: function bindEvent() {
              var that = this;
              this.$position.on('click', 'li',

                function() {
                  if (self.disabled) {

                    return;
                  }
                  var value = (0, _jQuery2.default)(this).data('position');
                  that.set(value);
                  self._update();

                  return false;
                }
              );
            }
          },

          doSize: {
            values: self.options.size.values,
            defaultValue: self.options.size.defaultValue,
            init: function init() {
              var that = this;

              var tplContent = self.options.size.tpl().replace(/\{\{namespace\}\}/g, self.namespace).replace(/\{\{strings.bgSize\}\}/g, self.strings.bgSize);
              this.$tplSize = (0, _jQuery2.default)(tplContent);
              self.$imageWrap.after(this.$tplSize);

              this.$size = self.$expand.find('.' + self.namespace + '-size');
              this.$items = this.$size.find('li');

              _jQuery2.default.each(this.values,

                function(key, value) {
                  that.$items.eq(key).data('size', value);
                }
              );

              var value = typeof self.value.size !== 'undefined' ? self.value.size : this.defaultValue;
              this.set(value);

              this.bindEvent();
            },
            set: function set(value) {
              var found = false;
              this.$items.removeClass(self.classes.active);

              for (var i = 0; i < this.values.length; i++) {

                if (value === this.values[i]) {
                  self.value.size = value;
                  this.$items.eq(i).addClass(self.classes.active);
                  self.$image.css({
                    'background-size': value
                  });
                  found = true;
                }
              }

              if (!found) {
                this.set(this.defaultValue);
              }
            },
            clear: function clear() {
              this.set(this.defaultValue);
            },
            bindEvent: function bindEvent() {
              var that = this;
              this.$size.on('click', 'li',

                function() {
                  if (self.disabled) {

                    return;
                  }
                  var value = (0, _jQuery2.default)(this).data('size');
                  that.set(value);
                  self._update();

                  return false;
                }
              );
            }
          },
          doAttachment: {
            values: self.options.attachment.values,
            defaultValue: self.options.attachment.defaultValue,
            init: function init() {
              var that = this;
              var tplContent = self.options.attachment.tpl().replace(/\{\{attachNamespace\}\}/g, self.options.attachment.namespace).replace(/\{\{namespace\}\}/g, self.namespace).replace(/\{\{strings.bgAttach\}\}/g, self.strings.bgAttach);
              this.$tplAttachment = (0, _jQuery2.default)(tplContent);
              self.$imageWrap.after(this.$tplAttachment);

              this.$attachment = self.$expand.find('.' + self.namespace + '-attachment');
              this.$items = this.$attachment.find('li');
              this.$dropdown = self.$expand.find('.' + self.options.attachment.namespace);
              this.values = self.options.attachment.values;

              _jQuery2.default.each(this.values,

                function(key, value) {
                  that.$items.eq(key).data('attachment', value);
                }
              );

              this.$dropdown.asDropdown({
                namespace: self.options.attachment.namespace,
                imitateSelect: true,
                data: 'attachment',
                onChange: function onChange(value) {
                  if (self.disabled) {

                    return;
                  }
                  self.value.attachment = value;
                  self._update();
                  self.$image.css({
                    'background-attachment': self.value.attachment
                  });
                }
              });

              var value = typeof self.value.attachment !== 'undefined' ? self.value.attachment : this.defaultValue;
              this.set(value);
            },
            set: function set(value) {
              var found = false;
              this.$items.removeClass(self.classes.active);

              for (var i = 0; i < this.values.length; i++) {

                if (value === this.values[i]) {
                  this.$dropdown.data('asDropdown').set(value);
                  found = true;
                }
              }

              if (!found) {
                this.set(this.defaultValue);
              }
            },
            clear: function clear() {
              this.set(this.defaultValue);
            }
          }
        });

        this._trigger('init');
        this.init();
      }

      _createClass(asBgPicker, [{
        key: 'val',
        value: function val(value) {
          if (typeof value === 'undefined') {

            return this.options.process(this.value);
          }

          var valueObj = this.options.parse(value);

          if (valueObj) {
            this.set(valueObj);
          } else {
            this.clear();
          }
        }
      }, {
        key: 'set',
        value: function set(value, update) {
          this.value = value;

          this.setImage(value.image);

          if (update !== false) {

            if (typeof value.repeat !== 'undefined') {
              this.doRepeat.set(value.repeat);
            } else {
              this.doRepeat.clear();
            }

            if (typeof value.size !== 'undefined') {
              this.doSize.set(value.size);
            } else {
              this.doSize.clear();
            }

            if (typeof value.position !== 'undefined') {
              this.doPosition.set(value.position);
            } else {
              this.doPosition.clear();
            }

            if (typeof value.attachment !== 'undefined') {
              this.doAttachment.set(value.attachment);
            } else {
              this.doAttachment.clear();
            }

            this._update();
          }
        }
      }, {
        key: 'clear',
        value: function clear(update) {
          this.value = {};

          if (update !== false) {
            var image = '';
            this.setImage(image);

            this.doRepeat.clear();
            this.doSize.clear();
            this.doPosition.clear();
            this.doAttachment.clear();
            this._update();
          }
        }
      }, {
        key: 'setImage',
        value: function setImage(image) {
          var thumbnailUrl = void 0;
          var self = this;
          this._setState(image);
          this._returnInfo(image);

          if (image === '' || typeof image === 'undefined') {
            this.$image.css({
              'background-image': 'none'
            });
          } else if (image || image !== this.options.image) {
            thumbnailUrl = this.options.getThumbnalil(image);
            var img = new Image();
            img.onload = function() {
              self.value.image = thumbnailUrl;
              self._returnInfo(self.value.image);
              self.$image.css({
                'background-image': 'url(\'' + self.value.image + '\')'
              });
            }
            ;
            img.onerror = function() {
              self.value.image = image;
              self._returnInfo(image);
              self._update();
              self.$image.css({
                'background-image': 'none'
              });
            }
            ;
            img.src = thumbnailUrl;
          }
        }
      }, {
        key: 'setRepeat',
        value: function setRepeat(repeat) {
          this.doRepeat.set(repeat);
          this._update();
        }
      }, {
        key: 'setSize',
        value: function setSize(size) {
          this.doSize.set(size);
          this._update();
        }
      }, {
        key: 'setPosition',
        value: function setPosition(position) {
          this.doPosition.set(position);
          this._update();
        }
      }, {
        key: 'setAttachment',
        value: function setAttachment(attachment) {
          this.doAttachment.set(attachment);
          this._update();
        }
      }, {
        key: 'get',
        value: function get() {
          return this.value;
        }
      }, {
        key: 'enable',
        value: function enable() {
          this.disabled = false;
          this.$wrap.removeClass(this.classes.disabled);
        }
      }, {
        key: 'disable',
        value: function disable() {
          this.disabled = true;
          this.$wrap.addClass(this.classes.disabled);
        }
      }, {
        key: 'destory',
        value: function destory() {
          this.$element.data(pluginName, null);
          this.$wrap.remove();
          this._trigger('destory');
        }
      }], [{
        key: '_jQueryInterface',
        value: function _jQueryInterface(options) {
          'use strict';

          for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            params[_key2 - 1] = arguments[_key2];
          }

          if (typeof options === 'string') {

            if (/^\_/.test(options)) {

              return false;
            } else if (options === 'val' && params.length === 0) {
              var api = this.first().data(pluginName);

              if (api && typeof api[options] === 'function') {

                return api[options].apply(api, params);
              }
            } else {

              return this.each(

                function() {
                  var api = _jQuery2.default.data(this, pluginName);

                  if (api && typeof api[options] === 'function') {
                    api[options].apply(api, params);
                  }
                }
              );
            }
          }

          return this.each(

            function() {
              if (!_jQuery2.default.data(this, pluginName)) {
                _jQuery2.default.data(this, pluginName, new asBgPicker(this, options));
              }
            }
          );
        }
      }]);

      return asBgPicker;
    }();

    asBgPicker.Strings = {};

    asBgPicker.localize = function(lang, label) {
      'use strict';

      asBgPicker.Strings[lang] = label;
    }
    ;

    asBgPicker.localize('en', {
      placeholder: 'Add Image',
      change: 'change',
      bgRepeat: 'Repeat',
      bgPosition: 'Position',
      bgAttach: 'Attach',
      bgSize: 'Scalling'
    });

    _jQuery2.default.fn[pluginName] = asBgPicker._jQueryInterface;
    _jQuery2.default.fn[pluginName].constructor = asBgPicker;
    _jQuery2.default.fn[pluginName].noConflict = function() {
      'use strict';

      _jQuery2.default.fn[pluginName] = JQUERY_NO_CONFLICT;

      return asBgPicker._jQueryInterface;
    }
    ;

    exports.default = asBgPicker;
  }
);