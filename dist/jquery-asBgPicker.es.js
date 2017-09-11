/**
* jQuery asBgPicker v0.1.4
* https://github.com/amazingSurge/jquery-asBgPicker
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/
import $$1 from 'jquery';

/* eslint no-empty-function: "off" */

var DEFAULTS = {
  namespace: 'asBgPicker',
  skin: null,
  image: 'images/defaults.png',
  lang: 'en',
  repeat: {
    defaultValue: 'repeat',
    values: ['no-repeat', 'repeat', 'repeat-x', 'repeat-y'],
    tpl: function() {
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
    tpl: function() {
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
    tpl: function() {
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
    tpl: function() {
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

  tpl: function() {
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

  process: function(value) {
    'use strict';
    if (value && typeof value.image !== 'undefined' && value.image !== '') {
      return JSON.stringify(value);
    }
    return '';
  },

  parse: function(value) {
    'use strict';
    if (value) {
      return $.parseJSON(value);
    }
    return {};
  },

  getThumbnalil: function(image) {
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
  select: function() {},
  onChange: function() {}
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

class Repeat {
  constructor(instance) {
    this.instance = instance;
    this.values = instance.options.repeat.values;
    this.defaultValue = instance.options.repeat.defaultValue;

    this.init();
  }

  init() {
    const tplContent = this.instance.options.repeat.tpl().replace(/\{\{namespace\}\}/g, this.instance.namespace)
      .replace(/\{\{strings.bgRepeat\}\}/g, this.instance.strings.bgRepeat);
    this.$tplRepeat = $(tplContent);
    this.instance.$imageWrap.after(this.$tplRepeat);

    this.$repeat = this.instance.$expand.find(`.${this.instance.namespace}-repeat`);
    this.$items = this.$repeat.find('li');

    $.each(this.values, (key, value) => {
      this.$items.eq(key).data('repeat', value);
    });

    const value = typeof this.instance.value.repeat !== 'undefined' ? this.instance.value.repeat : this.defaultValue;
    this.set(value);

    this.bindEvent();
  }

  set(value) {
    let found = false;
    this.$items.removeClass(this.instance.classes.active);
    for (let i = 0; i < this.values.length; i++) {
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

  clear() {
    this.set(this.defaultValue);
  }

  bindEvent() {
    const that = this;
    this.$repeat.on('click', 'li', function() {
      if (that.instance.disabled) {
        return;
      }
      const value = $(this).data('repeat');
      that.set(value);
      that.instance._update();
      return false;
    });
  }
}

class Size {
  constructor(instance) {
    this.instance = instance;
    this.values = instance.options.size.values;
    this.defaultValue = instance.options.size.defaultValue;

    this.init();
  }

  init() {
    const tplContent = this.instance.options.size.tpl().replace(/\{\{namespace\}\}/g, this.instance.namespace)
      .replace(/\{\{strings.bgSize\}\}/g, this.instance.strings.bgSize);
    this.$tplSize = $(tplContent);
    this.instance.$imageWrap.after(this.$tplSize);

    this.$size = this.instance.$expand.find(`.${this.instance.namespace}-size`);
    this.$items = this.$size.find('li');

    $.each(this.values, (key, value) => {
      this.$items.eq(key).data('size', value);
    });

    const value = typeof this.instance.value.size !== 'undefined' ? this.instance.value.size : this.defaultValue;
    this.set(value);

    this.bindEvent();
  }

  set(value) {
    let found = false;
    this.$items.removeClass(this.instance.classes.active);
    for (let i = 0; i < this.values.length; i++) {
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

  clear() {
    this.set(this.defaultValue);
  }

  bindEvent() {
    const that = this;
    this.$size.on('click', 'li', function() {
      if (that.instance.disabled) {
        return;
      }
      const value = $(this).data('size');
      that.set(value);
      that.instance._update();
      return false;
    });
  }
}

class Position {
  constructor(instance) {
    this.instance = instance;
    this.values = instance.options.position.values;
    this.defaultValue = instance.options.position.defaultValue;

    this.init();
  }

  init() {
    const tplContent = this.instance.options.position.tpl().replace(/\{\{namespace\}\}/g, this.instance.namespace)
      .replace(/\{\{strings.bgPosition\}\}/g, this.instance.strings.bgPosition);
    this.$tplPosition = $(tplContent);
    this.instance.$imageWrap.after(this.$tplPosition);

    this.$position = this.instance.$expand.find(`.${this.instance.namespace}-position`);
    this.$items = this.$position.find('li');

    $.each(this.values, (key, value) => {
      this.$items.eq(key).data('position', value);
    });

    const value = typeof this.instance.value.position !== 'undefined' ? this.instance.value.position : this.defaultValue;
    this.set(value);

    this.bindEvent();
  }

  set(value) {
    let found = false;
    this.$items.removeClass(this.instance.classes.active);
    for (let i = 0; i < this.values.length; i++) {
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

  clear() {
    this.set(this.defaultValue);
  }

  bindEvent() {
    const that = this;
    this.$position.on('click', 'li', function() {
      if (that.instance.disabled) {
        return;
      }
      const value = $(this).data('position');
      that.set(value);
      that.instance._update();
      return false;
    });
  }
}

class Attachment {
  constructor(instance) {
    this.instance = instance;
    this.values = instance.options.attachment.values;
    this.defaultValue = instance.options.attachment.defaultValue;

    this.init();
  }

  init() {
    const tplContent = this.instance.options.attachment.tpl().replace(/\{\{attachNamespace\}\}/g, this.instance.options.attachment.namespace)
      .replace(/\{\{namespace\}\}/g, this.instance.namespace)
      .replace(/\{\{strings.bgAttach\}\}/g, this.instance.strings.bgAttach);
    this.$tplAttachment = $(tplContent);
    this.instance.$imageWrap.after(this.$tplAttachment);

    this.$attachment = this.instance.$expand.find(`.${this.instance.namespace}-attachment`);
    this.$items = this.$attachment.find('li');
    this.$dropdown = this.instance.$expand.find(`.${this.instance.options.attachment.namespace}`);
    this.values = this.instance.options.attachment.values;

    $.each(this.values, (key, value) => {
      this.$items.eq(key).data('attachment', value);
    });

    const that = this;

    this.$dropdown.asDropdown({
      namespace: this.instance.options.attachment.namespace,
      imitateSelect: true,
      data: 'attachment',
      // select: this.instance.attachment,
      onChange(value) {
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

    const value = typeof this.instance.value.attachment !== 'undefined' ? this.instance.value.attachment : this.defaultValue;
    this.set(value);
  }

  set(value) {
    let found = false;
    this.$items.removeClass(this.instance.classes.active);
    for (let i = 0; i < this.values.length; i++) {
      if (value === this.values[i]) {
        this.$dropdown.data('asDropdown').set(value);
        found = true;
      }
    }

    if (!found) {
      this.set(this.defaultValue);
    }
  }

  clear() {
    this.set(this.defaultValue);
  }
}

const NAMESPACE$1 = 'asBgPicker';

// main constructor
class asBgPicker {
  constructor(element, options) {
    this.element = element;
    this.$element = $$1(element);

    this.options = $$1.extend(true, {}, DEFAULTS, options, this.$element.data());

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

    this._trigger('init');
    this._init();
  }

  _init() {
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

  _bindEvent() {
    const that = this;
    this.$initiate.on('click', () => {
      if (that.disabled) {
        return;
      }

      that.$wrap.addClass(that.classes.expand).removeClass(that.classes.exist);
    });

    this.$info.on('mouseenter', function() {
      if (that.disabled) {
        return;
      }

      $$1(this).addClass(that.classes.hover);
    }).on('mouseleave', function() {
      if (that.disabled) {
        return;
      }

      $$1(this).removeClass(that.classes.hover);
    });

    this.$change.on('click', () => {
      if (that.disabled) {
        return;
      }

      that.$wrap.addClass(that.classes.expand).removeClass(that.classes.exist);
    });

    this.$remove.on('click', () => {
      if (that.disabled) {
        return;
      }

      that.clear();

      return false;
    });

    this.$close.on('click', () => {
      if (that.disabled) {
        return;
      }

      that.$wrap.addClass(that.classes.exist).removeClass(that.classes.expand);
      return false;
    });

    this.$image.on('click', () => {
      if (that.disabled) {
        return;
      }

      that.options.select.call(that);
    });
  }

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
  }

  _trigger(eventType, ...params) {
    const data = [this].concat(params);

    // event
    this.$element.trigger(`${NAMESPACE$1}::${eventType}`, data);

    // callback
    eventType = eventType.replace(/\b\w+\b/g, (word) => {
      return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
    const onFunction = `on${eventType}`;

    if (typeof this.options[onFunction] === 'function') {
      this.options[onFunction].apply(this, params);
    }
  }

  _setState(image) {
    if (!image || image === this.options.image) {
      this.$wrap.addClass(this.classes.empty);
    } else {
      this.$wrap.removeClass(this.classes.empty);
    }
  }

  _returnInfo(image) {
    let imgName;
    if (!image || image === this.options.image) {
      this.$infoImageName.text(this.strings.placeholder);
    } else {
      imgName = image.match(/([\S]+[\/])([\S]+\w+$)/i)[2];
      this.$infoImageName.text(imgName);
    }
  }

  _update() {
    if (this.value === null) {
      this.value = {};
    }

    this.$element.val(this.val());
    this._trigger('change', this.options.parse(this.val()));
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

  clear(update) {
    this.value = {};

    if (update !== false) {
      const image = '';
      this.setImage(image);

      this.repeat.clear();
      this.size.clear();
      this.position.clear();
      this.attachment.clear();
      this._update();
    }
  }

  setImage(image) {
    let thumbnailUrl;
    const that = this;
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
        that.value.image = thumbnailUrl;
        that._returnInfo(that.value.image);
        that.$image.css({
          'background-image': `url('${that.value.image}')`
        });
      };
      img.onerror = () => {
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

  setRepeat(repeat) {
    this.repeat.set(repeat);
    this._update();
  }

  setSize(size) {
    this.size.set(size);
    this._update();
  }

  setPosition(position) {
    this.position.set(position);
    this._update();
  }

  setAttachment(attachment) {
    this.attachment.set(attachment);
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

  destroy() {
    this.$element.data(NAMESPACE$1, null);
    this.$wrap.remove();
    this._trigger('destroy');
  }

  static localize(lang, labels) {
    STRINGS[lang] = labels;
  }

  static setDefaults(options) {
    $$1.extend(true, DEFAULTS, $$1.isPlainObject(options) && options);
  }
}

var info = {
  version:'0.1.4'
};

const NAMESPACE = 'asBgPicker';
const OtherAsBgPicker = $$1.fn.asBgPicker;

const jQueryAsBgPicker = function(options, ...args) {
  if (typeof options === 'string') {
    const method = options;

    if (/^_/.test(method)) {
      return false;
    } else if ((/^(get)$/.test(method)) || (method === 'val' && args.length === 0)) {
      const instance = this.first().data(NAMESPACE);
      if (instance && typeof instance[method] === 'function') {
        return instance[method](...args);
      }
    } else {
      return this.each(function() {
        const instance = $$1.data(this, NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          instance[method](...args);
        }
      });
    }
  }

  return this.each(function() {
    if (!$$1(this).data(NAMESPACE)) {
      $$1(this).data(NAMESPACE, new asBgPicker(this, options));
    }
  });
};

$$1.fn.asBgPicker = jQueryAsBgPicker;

$$1.asBgPicker = $$1.extend({
  setDefaults: asBgPicker.setDefaults,
  localize: asBgPicker.localize,
  noConflict: function() {
    $$1.fn.asBgPicker = OtherAsBgPicker;
    return jQueryAsBgPicker;
  }
}, info);
