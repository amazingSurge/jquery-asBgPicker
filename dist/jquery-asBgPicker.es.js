/**
* jQuery asBgPicker
* a jquery plugin
* Compiled: Tue Aug 16 2016 16:30:47 GMT+0800 (CST)
* @version v0.1.1
* @link https://github.com/amazingSurge/jquery-asBgPicker
* @copyright LGPL-3.0
*/
import $$1 from 'jQuery';

var defaults = {
  namespace: '',
  skin: null,
  image: 'images/defaults.png', // "..\/xxxx\/images\/xxxx.png"
  lang: 'en',
  repeat: {
    defaultValue: 'repeat',
    values: ['no-repeat', 'repeat', 'repeat-x', 'repeat-y'],
    tpl() {
      'use strict';
      return '<div class="{{namespace}}-repeat">' +
        '<span class="{{namespace}}-repeat-title">{{strings.bgRepeat}}</span>' +
        '<ul class="{{namespace}}-repeat-content">' +
        '<li class="repeat_no-repeat"></li>' +
        '<li class="repeat_repeat"></li>' +
        '<li class="repeat_repeat-x"></li>' +
        '<li class="repeat_repeat-y"></li>' +
        '</ul>' +
        '</div>';
    }
  },
  position: {
    defaultValue: 'top left',
    values: ['top left', 'top center', 'top right', 'center left', 'center center', 'center right', 'bottom left', 'bottom center', 'bottom right'],
    tpl() {
      'use strict';
      return '<div class="{{namespace}}-position">' +
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
        '</div>';
    }
  },
  size: {
    defaultValue: 'auto',
    values: ['auto', 'cover', 'contain', '100% 100%'],
    tpl() {
      'use strict';
      return '<div class="{{namespace}}-size">' +
        '<span class="{{namespace}}-size-title">{{strings.bgSize}}</span>' +
        '<ul class="{{namespace}}-size-content">' +
        '<li class="size_adapt-auto"></li>' +
        '<li class="size_adapt-width"></li>' +
        '<li class="size_adapt-height"></li>' +
        '<li class="size_adapt-all"></li>' +
        '</ul>' +
        '</div>';
    }
  },
  attachment: {
    namespace: 'asDropdown',
    defaultValue: 'scroll',
    values: ['scroll', 'fixed', 'inherit'],
    tpl() {
      'use strict';
      return '<div class="{{namespace}}-attachment">' +
        '<span class="{{namespace}}-attachment-title">{{strings.bgAttach}}</span>' +
        '<div class="{{namespace}}-attachment-content">' +
        '<div class="{{attachNamespace}} {{namespace}}-dropdown-trigger"><i class="asIcon-caret-down"></i></div>' +
        '<ul>' +
        '<li class="attachment_scroll">scroll</li>' +
        '<li class="attachment_fixed">fixed</li>' +
        '<li class="attachment_default">default</li>' +
        '</ul>' +
        '</div>' +
        '</div>';
    }
  },

  tpl() {
    'use strict';
    return '<div class="{{namespace}}">' +
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
      '</div>';
  },

  process(value) {
    'use strict';
    if (value && typeof value.image !== 'undefined' && value.image !== '') {
      return JSON.stringify(value);
    }
    return '';
  },

  parse(value) {
    'use strict';
    if (value) {
      return $.parseJSON(value);
    }
    return {};
  },

  getThumbnalil(image) {
    'use strict';
    let imageData, imageFormat, imageName, imagePath;

    imageData = image.match(/([\S]+[\/])([\S]+)(\.+\w+$)/i);
    imagePath = imageData[1];
    imageName = imageData[2];
    imageFormat = imageData[3];

    if (imageName.search('thumbnail') === 0) {
      return imagePath + imageName + imageFormat;
    }
    return `${imagePath}thumbnail-${imageName}${imageFormat}`;
  },
  select() {},
  onChange() {},
  strings: {}
};

const pluginName = 'asBgPicker';

defaults.namespace = pluginName;

// main constructor
class asBgPicker {
  constructor(element, options) {
    this.element = element;
    this.$element = $$1(element);

    this.options = $$1.extend({}, defaults, options, this.$element.data());

    // load lang strings
    if (typeof asBgPicker.Strings[this.options.lang] === 'undefined') {
      this.lang = 'en';
    } else {
      this.lang = this.options.lang;
    }
    this.strings = $$1.extend({}, asBgPicker.Strings[this.lang], this.options.strings);

    this.namespace = this.options.namespace;

    // public properties
    this.classes = {
      // status
      skin: `${this.namespace}_${this.options.skin}`,
      disabled: `${this.namespace}_disabled`,
      active: `${this.namespace}_active`,
      hover: `${this.namespace}_hover`,
      empty: `${this.namespace}_empty`,
      exist: `${this.namespace}_exist`,
      expand: `${this.namespace}_expand`
    };

    this.$element.addClass(`${this.namespace}-input`);
    // flag
    this.disabled = false;
    this.initialed = false;

    const self = this;
    $$1.extend(self, {
      init() {
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

      _bindEvent() {
        this.$initiate.on('click', () => {
          if (self.disabled) {
            return;
          }

          self.$wrap.addClass(self.classes.expand).removeClass(self.classes.exist);
        });

        this.$info.on('mouseenter', function() {
          if (self.disabled) {
            return;
          }

          $$1(this).addClass(self.classes.hover);
        }).on('mouseleave', function() {
          if (self.disabled) {
            return;
          }

          $$1(this).removeClass(self.classes.hover);
        });

        this.$change.on('click', () => {
          if (self.disabled) {
            return;
          }

          self.$wrap.addClass(self.classes.expand).removeClass(self.classes.exist);
        });

        this.$remove.on('click', () => {
          if (self.disabled) {
            return;
          }

          self.clear();

          return false;
        });

        this.$close.on('click', () => {
          if (self.disabled) {
            return;
          }

          self.$wrap.addClass(self.classes.exist).removeClass(self.classes.expand);
          return false;
        });

        this.$image.on('click', () => {
          if (self.disabled) {
            return;
          }

          self.options.select.call(self);
        });
      },
      _createHtml() {
        this.$wrap = $$1(this.options.tpl().replace(/\{\{namespace\}\}/g, this.namespace)
          .replace(/\{\{strings.placeholder\}\}/g, this.strings.placeholder)
          .replace(/\{\{strings.change\}\}/g, this.strings.change));
        this.$element.after(this.$wrap);

        this.$initiate = $$1(`.${this.namespace}-initiate`, this.$wrap);

        this.$info = $$1(`.${this.namespace}-info`, this.$wrap);
        this.$infoImageName = $$1(`.${this.namespace}-info-image-name`, this.$info);
        this.$remove = $$1(`.${this.namespace}-info-remove`, this.$info);
        this.$change = $$1(`.${this.namespace}-info-change`, this.$info);

        this.$expand = $$1(`.${this.namespace}-expand`, this.$wrap);
        this.$close = $$1(`.${this.namespace}-expand-close`, this.$expand);
        this.$imageWrap = $$1(`.${this.namespace}-expand-image-wrap`, this.$expand);
        this.$image = $$1(`.${this.namespace}-expand-image`, this.$expand);
      },

      _trigger(eventType,...params) {
        const data = [self].concat(params);

        // event
        self.$element.trigger(`asBgPicker::${eventType}`, data);

        // callback
        eventType = eventType.replace(/\b\w+\b/g, word => word.substring(0, 1).toUpperCase() + word.substring(1));
        const onFunction = `on${eventType}`;
        if (typeof self.options[onFunction] === 'function') {
          self.options[onFunction](...params);
        }
      },
      _setState(image) {
        if (!image || image === self.options.image) {
          self.$wrap.addClass(self.classes.empty);
        } else {
          self.$wrap.removeClass(self.classes.empty);
        }
      },
      _returnInfo(image) {
        let imgName;
        if (!image || image === self.options.image) {
          self.$infoImageName.text(self.strings.placeholder);
        } else {
          imgName = image.match(/([\S]+[\/])([\S]+\w+$)/i)[2];
          self.$infoImageName.text(imgName);
        }
      },
      _update() {
        if (self.value === null) {
          self.value = {};
        }

        self.$element.val(self.val());
        self._trigger('change', self.options.parse(self.val()), self.options.name, pluginName);
      },
      doRepeat: {
        values: self.options.repeat.values,
        defaultValue: self.options.repeat.defaultValue,
        init() {
          const that = this;

          const tplContent = self.options.repeat.tpl().replace(/\{\{namespace\}\}/g, self.namespace)
            .replace(/\{\{strings.bgRepeat\}\}/g, self.strings.bgRepeat);
          this.$tplRepeat = $$1(tplContent);
          self.$imageWrap.after(this.$tplRepeat);

          this.$repeat = self.$expand.find(`.${self.namespace}-repeat`);
          this.$items = this.$repeat.find('li');

          $$1.each(this.values, (key, value) => {
            that.$items.eq(key).data('repeat', value);
          });

          const value = typeof self.value.repeat !== 'undefined' ? self.value.repeat : this.defaultValue;
          this.set(value);

          this.bindEvent();
        },

        set(value) {
          let found = false;
          this.$items.removeClass(self.classes.active);
          for (let i = 0; i < this.values.length; i++) {
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

        clear() {
          this.set(this.defaultValue);
        },

        bindEvent() {
          const that = this;
          this.$repeat.on('click', 'li', function() {
            if (self.disabled) {
              return;
            }
            const value = $$1(this).data('repeat');
            that.set(value);
            self._update();
            return false;
          });
        }
      },

      doPosition: {
        values: self.options.position.values,
        defaultValue: self.options.position.defaultValue,
        init() {
          const that = this;

          const tplContent = self.options.position.tpl().replace(/\{\{namespace\}\}/g, self.namespace)
            .replace(/\{\{strings.bgPosition\}\}/g, self.strings.bgPosition);
          this.$tplPosition = $$1(tplContent);
          self.$imageWrap.after(this.$tplPosition);

          this.$position = self.$expand.find(`.${self.namespace}-position`);
          this.$items = this.$position.find('li');

          $$1.each(this.values, (key, value) => {
            that.$items.eq(key).data('position', value);
          });

          const value = typeof self.value.position !== 'undefined' ? self.value.position : this.defaultValue;
          this.set(value);

          this.bindEvent();
        },

        set(value) {
          let found = false;
          this.$items.removeClass(self.classes.active);
          for (let i = 0; i < this.values.length; i++) {
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

        clear() {
          this.set(this.defaultValue);
        },

        bindEvent() {
          const that = this;
          this.$position.on('click', 'li', function() {
            if (self.disabled) {
              return;
            }
            const value = $$1(this).data('position');
            that.set(value);
            self._update();
            return false;
          });
        }
      },

      doSize: {
        values: self.options.size.values,
        defaultValue: self.options.size.defaultValue,
        init() {
          const that = this;

          const tplContent = self.options.size.tpl().replace(/\{\{namespace\}\}/g, self.namespace)
            .replace(/\{\{strings.bgSize\}\}/g, self.strings.bgSize);
          this.$tplSize = $$1(tplContent);
          self.$imageWrap.after(this.$tplSize);

          this.$size = self.$expand.find(`.${self.namespace}-size`);
          this.$items = this.$size.find('li');

          $$1.each(this.values, (key, value) => {
            that.$items.eq(key).data('size', value);
          });

          const value = typeof self.value.size !== 'undefined' ? self.value.size : this.defaultValue;
          this.set(value);

          this.bindEvent();
        },
        set(value) {
          let found = false;
          this.$items.removeClass(self.classes.active);
          for (let i = 0; i < this.values.length; i++) {
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

        clear() {
          this.set(this.defaultValue);
        },

        bindEvent() {
          const that = this;
          this.$size.on('click', 'li', function() {
            if (self.disabled) {
              return;
            }
            const value = $$1(this).data('size');
            that.set(value);
            self._update();
            return false;
          });
        }
      },
      doAttachment: {
        values: self.options.attachment.values,
        defaultValue: self.options.attachment.defaultValue,
        init() {
          const that = this;
          const tplContent = self.options.attachment.tpl().replace(/\{\{attachNamespace\}\}/g, self.options.attachment.namespace)
            .replace(/\{\{namespace\}\}/g, self.namespace)
            .replace(/\{\{strings.bgAttach\}\}/g, self.strings.bgAttach);
          this.$tplAttachment = $$1(tplContent);
          self.$imageWrap.after(this.$tplAttachment);

          this.$attachment = self.$expand.find(`.${self.namespace}-attachment`);
          this.$items = this.$attachment.find('li');
          this.$dropdown = self.$expand.find(`.${self.options.attachment.namespace}`);
          this.values = self.options.attachment.values;

          $$1.each(this.values, (key, value) => {
            that.$items.eq(key).data('attachment', value);
          });

          this.$dropdown.asDropdown({
            namespace: self.options.attachment.namespace,
            imitateSelect: true,
            data: 'attachment',
            // select: that.attachment,
            onChange(value) {
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

          const value = typeof self.value.attachment !== 'undefined' ? self.value.attachment : this.defaultValue;
          this.set(value);
        },

        set(value) {
          let found = false;
          this.$items.removeClass(self.classes.active);
          for (let i = 0; i < this.values.length; i++) {
            if (value === this.values[i]) {
              this.$dropdown.data('asDropdown').set(value);
              found = true;
            }
          }

          if (!found) {
            this.set(this.defaultValue);
          }
        },

        clear() {
          this.set(this.defaultValue);
        }
      }
    });

    this._trigger('init');
    this.init();
  }

  val(value) {
    if (typeof value === 'undefined') {
      return this.options.process(this.value);
    }

    const valueObj = this.options.parse(value);

    if (valueObj) {
      this.set(valueObj);
    } else {
      this.clear();
    }
  }

  set(value, update) {
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

  clear(update) {
    this.value = {};

    if (update !== false) {
      const image = '';
      this.setImage(image);

      this.doRepeat.clear();
      this.doSize.clear();
      this.doPosition.clear();
      this.doAttachment.clear();
      this._update();
    }
  }

  setImage(image) {
    let thumbnailUrl;
    const self = this;
    this._setState(image);
    this._returnInfo(image);
    if (image === '' || typeof image === 'undefined') {
      this.$image.css({
        'background-image': 'none'
      });
    } else if (image || image !== this.options.image) {
      thumbnailUrl = this.options.getThumbnalil(image);
      const img = new Image();
      img.onload = () => {
        self.value.image = thumbnailUrl;
        self._returnInfo(self.value.image);
        self.$image.css({
          'background-image': `url('${self.value.image}')`
        });
      };
      img.onerror = () => {
        self.value.image = image;
        self._returnInfo(image);
        self._update();
        self.$image.css({
          'background-image': 'none'
        });
      };
      img.src = thumbnailUrl;
    }
  }

  setRepeat(repeat) {
    this.doRepeat.set(repeat);
    this._update();
  }
  setSize(size) {
    this.doSize.set(size);
    this._update();
  }
  setPosition(position) {
    this.doPosition.set(position);
    this._update();
  }
  setAttachment(attachment) {
    this.doAttachment.set(attachment);
    this._update();
  }

  get() {
    return this.value;
  }

  enable() {
    this.disabled = false;
    this.$wrap.removeClass(this.classes.disabled);
  }
  disable() {
    this.disabled = true;
    this.$wrap.addClass(this.classes.disabled);
  }
  destory() {
    this.$element.data(pluginName, null);
    this.$wrap.remove();
    this._trigger('destory');
  }

static _jQueryInterface(options, ...params) {
    'use strict';
    if (typeof options === 'string') {
      if (/^\_/.test(options)) {
        return false;
      } else if ((options === 'val' && params.length === 0)) {
        let api = this.first().data(pluginName);
        if (api && typeof api[options] === 'function') {
          return api[options](...params);
        }
      } else {
        return this.each(function() {
          let api = $$1.data(this, pluginName);
          if (api && typeof api[options] === 'function') {
            api[options](...params);
          }
        });
      }
    }
    return this.each(function() {
      if (!$$1.data(this, pluginName)) {
        $$1.data(this, pluginName, new asBgPicker(this, options));
      }
    });

  }

}

asBgPicker.Strings = {};

asBgPicker.localize = (lang, label) => {
  'use strict';
  asBgPicker.Strings[lang] = label;
};

asBgPicker.localize('en', {
  placeholder: 'Add Image',
  change: 'change',
  bgRepeat: 'Repeat',
  bgPosition: 'Position',
  bgAttach: 'Attach',
  bgSize: 'Scalling'
});

$$1.fn[pluginName] = asBgPicker._jQueryInterface;
$$1.fn[pluginName].constructor = asBgPicker;
$$1.fn[pluginName].noConflict = function() {
  'use strict';
  $$1.fn[pluginName] = JQUERY_NO_CONFLICT;
  return asBgPicker._jQueryInterface;
};

export default asBgPicker;