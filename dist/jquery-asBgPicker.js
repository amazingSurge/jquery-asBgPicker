/**
* jQuery asBgPicker v0.1.4
* https://github.com/amazingSurge/jquery-asBgPicker
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/
(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(require('jquery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.jQuery);
    global.jqueryAsBgPickerEs = mod.exports;
  }
})(this, function(_jquery) {
  'use strict';

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule
      ? obj
      : {
          default: obj
        };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  /* eslint no-empty-function: "off" */

  var DEFAULTS = {
    namespace: 'asBgPicker',
    skin: null,
    image: 'images/defaults.png',
    lang: 'en',
    repeat: {
      defaultValue: 'repeat',
      values: ['no-repeat', 'repeat', 'repeat-x', 'repeat-y'],
      tpl: function tpl() {
        return (
          '<div class="{{namespace}}-repeat">' +
          '<span class="{{namespace}}-repeat-title">{{strings.bgRepeat}}</span>' +
          '<ul class="{{namespace}}-repeat-content">' +
          '<li class="repeat_no-repeat"></li>' +
          '<li class="repeat_repeat"></li>' +
          '<li class="repeat_repeat-x"></li>' +
          '<li class="repeat_repeat-y"></li>' +
          '</ul>' +
          '</div>'
        );
      }
    },

    position: {
      defaultValue: 'top left',
      values: [
        'top left',
        'top center',
        'top right',
        'center left',
        'center center',
        'center right',
        'bottom left',
        'bottom center',
        'bottom right'
      ],
      tpl: function tpl() {
        return (
          '<div class="{{namespace}}-position">' +
          '<span class="{{namespace}}-position-title">{{strings.bgPosition}}</span>' +
          '<ul class="{{namespace}}-position-content">' +
          '<li class="postion_top-left"></li>' +
          '<li class="postion_top-center"></li>' +
          '<li class="postion_top-right"></li>' +
          '<li class="postion_center-left"></li>' +
          '<li class="postion_center-center"></li>' +
          '<li class="postion_center-right"></li>' +
          '<li class="postion_bottom-left"></li>' +
          '<li class="postion_bottom-center"></li>' +
          '<li class="postion_bottom-right"></li>' +
          '</ul>' +
          '</div>'
        );
      }
    },

    size: {
      defaultValue: 'auto',
      values: ['auto', 'cover', 'contain', '100% 100%'],
      tpl: function tpl() {
        return (
          '<div class="{{namespace}}-size">' +
          '<span class="{{namespace}}-size-title">{{strings.bgSize}}</span>' +
          '<ul class="{{namespace}}-size-content">' +
          '<li class="size_adapt-auto"></li>' +
          '<li class="size_adapt-width"></li>' +
          '<li class="size_adapt-height"></li>' +
          '<li class="size_adapt-all"></li>' +
          '</ul>' +
          '</div>'
        );
      }
    },

    attachment: {
      namespace: 'asDropdown',
      defaultValue: 'scroll',
      values: ['scroll', 'fixed', 'inherit'],
      tpl: function tpl() {
        return (
          '<div class="{{namespace}}-attachment">' +
          '<span class="{{namespace}}-attachment-title">{{strings.bgAttach}}</span>' +
          '<div class="{{namespace}}-attachment-content">' +
          '<div class="{{attachNamespace}} {{namespace}}-dropdown-trigger"><i class="asIcon-caret-down"></i></div>' +
          '<ul>' +
          '<li class="attachment_scroll">scroll</li>' +
          '<li class="attachment_fixed">fixed</li>' +
          '<li class="attachment_default">default</li>' +
          '</ul>' +
          '</div>' +
          '</div>'
        );
      }
    },

    tpl: function tpl() {
      return (
        '<div class="{{namespace}}">' +
        '<div class="{{namespace}}-initiate">' +
        '<i></i>{{strings.placeholder}}' +
        '</div>' +
        '<div class="{{namespace}}-info">' +
        '<div class="{{namespace}}-info-image">' +
        '<i></i><span class="{{namespace}}-info-image-name">{{strings.placeholder}}</span>' +
        '</div>' +
        '<div class="{{namespace}}-info-change">{{strings.change}}</div>' +
        '<a class="{{namespace}}-info-remove" href=""></a>' +
        '</div>' +
        '<div class="{{namespace}}-expand">' +
        '<a class="{{namespace}}-expand-close" href="#"></a>' +
        '<div class="{{namespace}}-expand-image-wrap">' +
        '<div class="{{namespace}}-expand-image"></div>' +
        '</div>' +
        '</div>' +
        '</div>'
      );
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
    onChange: function onChange() {}
  };

  var STRINGS = {
    en: {
      placeholder: 'Add Image',
      change: 'change',
      bgRepeat: 'Repeat',
      bgPosition: 'Position',
      bgAttach: 'Attach',
      bgSize: 'Scalling'
    }
  };

  var Repeat = (function() {
    function Repeat(instance) {
      _classCallCheck(this, Repeat);

      this.instance = instance;
      this.values = instance.options.repeat.values;
      this.defaultValue = instance.options.repeat.defaultValue;

      this.init();
    }

    _createClass(Repeat, [
      {
        key: 'init',
        value: function init() {
          var _this = this;

          var tplContent = this.instance.options.repeat
            .tpl()
            .replace(/\{\{namespace\}\}/g, this.instance.namespace)
            .replace(
              /\{\{strings.bgRepeat\}\}/g,
              this.instance.strings.bgRepeat
            );
          this.$tplRepeat = $(tplContent);
          this.instance.$imageWrap.after(this.$tplRepeat);

          this.$repeat = this.instance.$expand.find(
            '.' + this.instance.namespace + '-repeat'
          );
          this.$items = this.$repeat.find('li');

          $.each(this.values, function(key, value) {
            _this.$items.eq(key).data('repeat', value);
          });

          var value =
            typeof this.instance.value.repeat !== 'undefined'
              ? this.instance.value.repeat
              : this.defaultValue;
          this.set(value);

          this.bindEvent();
        }
      },
      {
        key: 'set',
        value: function set(value) {
          var found = false;
          this.$items.removeClass(this.instance.classes.active);
          for (var i = 0; i < this.values.length; i++) {
            if (value === this.values[i]) {
              this.instance.value.repeat = value;
              this.$items.eq(i).addClass(this.instance.classes.active);
              this.instance.$image.css({
                'background-repeat': value
              });
              found = true;
            }
          }
          if (!found) {
            this.set(this.defaultValue);
          }
        }
      },
      {
        key: 'clear',
        value: function clear() {
          this.set(this.defaultValue);
        }
      },
      {
        key: 'bindEvent',
        value: function bindEvent() {
          var that = this;
          this.$repeat.on('click', 'li', function() {
            if (that.instance.disabled) {
              return;
            }
            var value = $(this).data('repeat');
            that.set(value);
            that.instance._update();
            return false;
          });
        }
      }
    ]);

    return Repeat;
  })();

  var Size = (function() {
    function Size(instance) {
      _classCallCheck(this, Size);

      this.instance = instance;
      this.values = instance.options.size.values;
      this.defaultValue = instance.options.size.defaultValue;

      this.init();
    }

    _createClass(Size, [
      {
        key: 'init',
        value: function init() {
          var _this2 = this;

          var tplContent = this.instance.options.size
            .tpl()
            .replace(/\{\{namespace\}\}/g, this.instance.namespace)
            .replace(/\{\{strings.bgSize\}\}/g, this.instance.strings.bgSize);
          this.$tplSize = $(tplContent);
          this.instance.$imageWrap.after(this.$tplSize);

          this.$size = this.instance.$expand.find(
            '.' + this.instance.namespace + '-size'
          );
          this.$items = this.$size.find('li');

          $.each(this.values, function(key, value) {
            _this2.$items.eq(key).data('size', value);
          });

          var value =
            typeof this.instance.value.size !== 'undefined'
              ? this.instance.value.size
              : this.defaultValue;
          this.set(value);

          this.bindEvent();
        }
      },
      {
        key: 'set',
        value: function set(value) {
          var found = false;
          this.$items.removeClass(this.instance.classes.active);
          for (var i = 0; i < this.values.length; i++) {
            if (value === this.values[i]) {
              this.instance.value.size = value;
              this.$items.eq(i).addClass(this.instance.classes.active);
              this.instance.$image.css({
                'background-size': value
              });
              found = true;
            }
          }
          if (!found) {
            this.set(this.defaultValue);
          }
        }
      },
      {
        key: 'clear',
        value: function clear() {
          this.set(this.defaultValue);
        }
      },
      {
        key: 'bindEvent',
        value: function bindEvent() {
          var that = this;
          this.$size.on('click', 'li', function() {
            if (that.instance.disabled) {
              return;
            }
            var value = $(this).data('size');
            that.set(value);
            that.instance._update();
            return false;
          });
        }
      }
    ]);

    return Size;
  })();

  var Position = (function() {
    function Position(instance) {
      _classCallCheck(this, Position);

      this.instance = instance;
      this.values = instance.options.position.values;
      this.defaultValue = instance.options.position.defaultValue;

      this.init();
    }

    _createClass(Position, [
      {
        key: 'init',
        value: function init() {
          var _this3 = this;

          var tplContent = this.instance.options.position
            .tpl()
            .replace(/\{\{namespace\}\}/g, this.instance.namespace)
            .replace(
              /\{\{strings.bgPosition\}\}/g,
              this.instance.strings.bgPosition
            );
          this.$tplPosition = $(tplContent);
          this.instance.$imageWrap.after(this.$tplPosition);

          this.$position = this.instance.$expand.find(
            '.' + this.instance.namespace + '-position'
          );
          this.$items = this.$position.find('li');

          $.each(this.values, function(key, value) {
            _this3.$items.eq(key).data('position', value);
          });

          var value =
            typeof this.instance.value.position !== 'undefined'
              ? this.instance.value.position
              : this.defaultValue;
          this.set(value);

          this.bindEvent();
        }
      },
      {
        key: 'set',
        value: function set(value) {
          var found = false;
          this.$items.removeClass(this.instance.classes.active);
          for (var i = 0; i < this.values.length; i++) {
            if (value === this.values[i]) {
              this.instance.value.position = value;
              this.$items.eq(i).addClass(this.instance.classes.active);
              this.instance.$image.css({
                'background-position': value
              });
              found = true;
            }
          }

          if (!found) {
            this.set(this.defaultValue);
          }
        }
      },
      {
        key: 'clear',
        value: function clear() {
          this.set(this.defaultValue);
        }
      },
      {
        key: 'bindEvent',
        value: function bindEvent() {
          var that = this;
          this.$position.on('click', 'li', function() {
            if (that.instance.disabled) {
              return;
            }
            var value = $(this).data('position');
            that.set(value);
            that.instance._update();
            return false;
          });
        }
      }
    ]);

    return Position;
  })();

  var Attachment = (function() {
    function Attachment(instance) {
      _classCallCheck(this, Attachment);

      this.instance = instance;
      this.values = instance.options.attachment.values;
      this.defaultValue = instance.options.attachment.defaultValue;

      this.init();
    }

    _createClass(Attachment, [
      {
        key: 'init',
        value: function init() {
          var _this4 = this;

          var tplContent = this.instance.options.attachment
            .tpl()
            .replace(
              /\{\{attachNamespace\}\}/g,
              this.instance.options.attachment.namespace
            )
            .replace(/\{\{namespace\}\}/g, this.instance.namespace)
            .replace(
              /\{\{strings.bgAttach\}\}/g,
              this.instance.strings.bgAttach
            );
          this.$tplAttachment = $(tplContent);
          this.instance.$imageWrap.after(this.$tplAttachment);

          this.$attachment = this.instance.$expand.find(
            '.' + this.instance.namespace + '-attachment'
          );
          this.$items = this.$attachment.find('li');
          this.$dropdown = this.instance.$expand.find(
            '.' + this.instance.options.attachment.namespace
          );
          this.values = this.instance.options.attachment.values;

          $.each(this.values, function(key, value) {
            _this4.$items.eq(key).data('attachment', value);
          });

          var that = this;

          this.$dropdown.asDropdown({
            namespace: this.instance.options.attachment.namespace,
            imitateSelect: true,
            data: 'attachment',
            onChange: function onChange(value) {
              if (that.instance.disabled) {
                return;
              }
              that.instance.value.attachment = value;
              that.instance._update();
              that.instance.$image.css({
                'background-attachment': that.instance.value.attachment
              });
            }
          });

          var value =
            typeof this.instance.value.attachment !== 'undefined'
              ? this.instance.value.attachment
              : this.defaultValue;
          this.set(value);
        }
      },
      {
        key: 'set',
        value: function set(value) {
          var found = false;
          this.$items.removeClass(this.instance.classes.active);
          for (var i = 0; i < this.values.length; i++) {
            if (value === this.values[i]) {
              this.$dropdown.data('asDropdown').set(value);
              found = true;
            }
          }

          if (!found) {
            this.set(this.defaultValue);
          }
        }
      },
      {
        key: 'clear',
        value: function clear() {
          this.set(this.defaultValue);
        }
      }
    ]);

    return Attachment;
  })();

  var NAMESPACE$1 = 'asBgPicker';

  // main constructor

  var asBgPicker = (function() {
    function asBgPicker(element, options) {
      _classCallCheck(this, asBgPicker);

      this.element = element;
      this.$element = (0, _jquery2.default)(element);

      this.options = _jquery2.default.extend(
        true,
        {},
        DEFAULTS,
        options,
        this.$element.data()
      );

      // load lang strings
      if (typeof STRINGS[this.options.lang] === 'undefined') {
        this.lang = 'en';
      } else {
        this.lang = this.options.lang;
      }

      this.strings = STRINGS[this.lang];

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

      this._trigger('init');
      this._init();
    }

    _createClass(
      asBgPicker,
      [
        {
          key: '_init',
          value: function _init() {
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

            this.size = new Size(this);
            this.attachment = new Attachment(this);
            this.position = new Position(this);
            this.repeat = new Repeat(this);

            this.$wrap.addClass(this.classes.exist);

            this._bindEvent();

            this.initialed = true;
            // after init end trigger 'ready'
            this._trigger('ready');
          }
        },
        {
          key: '_bindEvent',
          value: function _bindEvent() {
            var that = this;
            this.$initiate.on('click', function() {
              if (that.disabled) {
                return;
              }

              that.$wrap
                .addClass(that.classes.expand)
                .removeClass(that.classes.exist);
            });

            this.$info
              .on('mouseenter', function() {
                if (that.disabled) {
                  return;
                }

                (0, _jquery2.default)(this).addClass(that.classes.hover);
              })
              .on('mouseleave', function() {
                if (that.disabled) {
                  return;
                }

                (0, _jquery2.default)(this).removeClass(that.classes.hover);
              });

            this.$change.on('click', function() {
              if (that.disabled) {
                return;
              }

              that.$wrap
                .addClass(that.classes.expand)
                .removeClass(that.classes.exist);
            });

            this.$remove.on('click', function() {
              if (that.disabled) {
                return;
              }

              that.clear();

              return false;
            });

            this.$close.on('click', function() {
              if (that.disabled) {
                return;
              }

              that.$wrap
                .addClass(that.classes.exist)
                .removeClass(that.classes.expand);
              return false;
            });

            this.$image.on('click', function() {
              if (that.disabled) {
                return;
              }

              that.options.select.call(that);
            });
          }
        },
        {
          key: '_createHtml',
          value: function _createHtml() {
            this.$wrap = (0, _jquery2.default)(
              this.options
                .tpl()
                .replace(/\{\{namespace\}\}/g, this.namespace)
                .replace(
                  /\{\{strings.placeholder\}\}/g,
                  this.strings.placeholder
                )
                .replace(/\{\{strings.change\}\}/g, this.strings.change)
            );
            this.$element.after(this.$wrap);

            this.$initiate = (0, _jquery2.default)(
              '.' + this.namespace + '-initiate',
              this.$wrap
            );

            this.$info = (0, _jquery2.default)(
              '.' + this.namespace + '-info',
              this.$wrap
            );
            this.$infoImageName = (0, _jquery2.default)(
              '.' + this.namespace + '-info-image-name',
              this.$info
            );
            this.$remove = (0, _jquery2.default)(
              '.' + this.namespace + '-info-remove',
              this.$info
            );
            this.$change = (0, _jquery2.default)(
              '.' + this.namespace + '-info-change',
              this.$info
            );

            this.$expand = (0, _jquery2.default)(
              '.' + this.namespace + '-expand',
              this.$wrap
            );
            this.$close = (0, _jquery2.default)(
              '.' + this.namespace + '-expand-close',
              this.$expand
            );
            this.$imageWrap = (0, _jquery2.default)(
              '.' + this.namespace + '-expand-image-wrap',
              this.$expand
            );
            this.$image = (0, _jquery2.default)(
              '.' + this.namespace + '-expand-image',
              this.$expand
            );
          }
        },
        {
          key: '_trigger',
          value: function _trigger(eventType) {
            for (
              var _len = arguments.length,
                params = Array(_len > 1 ? _len - 1 : 0),
                _key = 1;
              _key < _len;
              _key++
            ) {
              params[_key - 1] = arguments[_key];
            }

            var data = [this].concat(params);

            // event
            this.$element.trigger(NAMESPACE$1 + '::' + eventType, data);

            // callback
            eventType = eventType.replace(/\b\w+\b/g, function(word) {
              return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            var onFunction = 'on' + eventType;

            if (typeof this.options[onFunction] === 'function') {
              this.options[onFunction].apply(this, params);
            }
          }
        },
        {
          key: '_setState',
          value: function _setState(image) {
            if (!image || image === this.options.image) {
              this.$wrap.addClass(this.classes.empty);
            } else {
              this.$wrap.removeClass(this.classes.empty);
            }
          }
        },
        {
          key: '_returnInfo',
          value: function _returnInfo(image) {
            var imgName = void 0;
            if (!image || image === this.options.image) {
              this.$infoImageName.text(this.strings.placeholder);
            } else {
              imgName = image.match(/([\S]+[\/])([\S]+\w+$)/i)[2];
              this.$infoImageName.text(imgName);
            }
          }
        },
        {
          key: '_update',
          value: function _update() {
            if (this.value === null) {
              this.value = {};
            }

            this.$element.val(this.val());
            this._trigger('change', this.options.parse(this.val()));
          }
        },
        {
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
        },
        {
          key: 'set',
          value: function set(value, update) {
            this.value = value;

            this.setImage(value.image);

            if (update !== false) {
              if (typeof value.repeat !== 'undefined') {
                this.repeat.set(value.repeat);
              } else {
                this.repeat.clear();
              }
              if (typeof value.size !== 'undefined') {
                this.size.set(value.size);
              } else {
                this.size.clear();
              }
              if (typeof value.position !== 'undefined') {
                this.position.set(value.position);
              } else {
                this.position.clear();
              }
              if (typeof value.attachment !== 'undefined') {
                this.attachment.set(value.attachment);
              } else {
                this.attachment.clear();
              }

              this._update();
            }
          }
        },
        {
          key: 'clear',
          value: function clear(update) {
            this.value = {};

            if (update !== false) {
              var image = '';
              this.setImage(image);

              this.repeat.clear();
              this.size.clear();
              this.position.clear();
              this.attachment.clear();
              this._update();
            }
          }
        },
        {
          key: 'setImage',
          value: function setImage(image) {
            var thumbnailUrl = void 0;
            var that = this;
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
                that.value.image = thumbnailUrl;
                that._returnInfo(that.value.image);
                that.$image.css({
                  'background-image': "url('" + that.value.image + "')"
                });
              };
              img.onerror = function() {
                that.value.image = image;
                that._returnInfo(image);
                that._update();
                that.$image.css({
                  'background-image': 'none'
                });
              };
              img.src = thumbnailUrl;
            }
          }
        },
        {
          key: 'setRepeat',
          value: function setRepeat(repeat) {
            this.repeat.set(repeat);
            this._update();
          }
        },
        {
          key: 'setSize',
          value: function setSize(size) {
            this.size.set(size);
            this._update();
          }
        },
        {
          key: 'setPosition',
          value: function setPosition(position) {
            this.position.set(position);
            this._update();
          }
        },
        {
          key: 'setAttachment',
          value: function setAttachment(attachment) {
            this.attachment.set(attachment);
            this._update();
          }
        },
        {
          key: 'get',
          value: function get() {
            return this.value;
          }
        },
        {
          key: 'enable',
          value: function enable() {
            this.disabled = false;
            this.$wrap.removeClass(this.classes.disabled);
          }
        },
        {
          key: 'disable',
          value: function disable() {
            this.disabled = true;
            this.$wrap.addClass(this.classes.disabled);
          }
        },
        {
          key: 'destroy',
          value: function destroy() {
            this.$element.data(NAMESPACE$1, null);
            this.$wrap.remove();
            this._trigger('destroy');
          }
        }
      ],
      [
        {
          key: 'localize',
          value: function localize(lang, labels) {
            STRINGS[lang] = labels;
          }
        },
        {
          key: 'setDefaults',
          value: function setDefaults(options) {
            _jquery2.default.extend(
              true,
              DEFAULTS,
              _jquery2.default.isPlainObject(options) && options
            );
          }
        }
      ]
    );

    return asBgPicker;
  })();

  var info = {
    version: '0.1.4'
  };

  var NAMESPACE = 'asBgPicker';
  var OtherAsBgPicker = _jquery2.default.fn.asBgPicker;

  var jQueryAsBgPicker = function jQueryAsBgPicker(options) {
    for (
      var _len2 = arguments.length,
        args = Array(_len2 > 1 ? _len2 - 1 : 0),
        _key2 = 1;
      _key2 < _len2;
      _key2++
    ) {
      args[_key2 - 1] = arguments[_key2];
    }

    if (typeof options === 'string') {
      var method = options;

      if (/^_/.test(method)) {
        return false;
      } else if (
        /^(get)$/.test(method) ||
        (method === 'val' && args.length === 0)
      ) {
        var instance = this.first().data(NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          return instance[method].apply(instance, args);
        }
      } else {
        return this.each(function() {
          var instance = _jquery2.default.data(this, NAMESPACE);
          if (instance && typeof instance[method] === 'function') {
            instance[method].apply(instance, args);
          }
        });
      }
    }

    return this.each(function() {
      if (!(0, _jquery2.default)(this).data(NAMESPACE)) {
        (0, _jquery2.default)(this).data(
          NAMESPACE,
          new asBgPicker(this, options)
        );
      }
    });
  };

  _jquery2.default.fn.asBgPicker = jQueryAsBgPicker;

  _jquery2.default.asBgPicker = _jquery2.default.extend(
    {
      setDefaults: asBgPicker.setDefaults,
      localize: asBgPicker.localize,
      noConflict: function noConflict() {
        _jquery2.default.fn.asBgPicker = OtherAsBgPicker;
        return jQueryAsBgPicker;
      }
    },
    info
  );
});
