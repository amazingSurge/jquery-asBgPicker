import $ from 'jquery';
import DEFAULTS from './defaults';
import STRINGS from './strings';
import Repeat from './repeat';
import Size from './size';
import Position from './position';
import Attachment from './attachment';

const NAMESPACE = 'asBgPicker';

// main constructor
class asBgPicker {
  constructor(element, options) {
    this.element = element;
    this.$element = $(element);

    this.options = $.extend(true, {}, DEFAULTS, options, this.$element.data());

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

      $(this).addClass(that.classes.hover);
    }).on('mouseleave', function() {
      if (that.disabled) {
        return;
      }

      $(this).removeClass(that.classes.hover);
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
    this.$wrap = $(this.options.tpl().replace(/\{\{namespace\}\}/g, this.namespace)
      .replace(/\{\{strings.placeholder\}\}/g, this.strings.placeholder)
      .replace(/\{\{strings.change\}\}/g, this.strings.change));
    this.$element.after(this.$wrap);

    this.$initiate = $(`.${this.namespace}-initiate`, this.$wrap);

    this.$info = $(`.${this.namespace}-info`, this.$wrap);
    this.$infoImageName = $(`.${this.namespace}-info-image-name`, this.$info);
    this.$remove = $(`.${this.namespace}-info-remove`, this.$info);
    this.$change = $(`.${this.namespace}-info-change`, this.$info);

    this.$expand = $(`.${this.namespace}-expand`, this.$wrap);
    this.$close = $(`.${this.namespace}-expand-close`, this.$expand);
    this.$imageWrap = $(`.${this.namespace}-expand-image-wrap`, this.$expand);
    this.$image = $(`.${this.namespace}-expand-image`, this.$expand);
  }

  _trigger(eventType,...params) {
    const data = [this].concat(params);

    // event
    this.$element.trigger(`asBgPicker::${eventType}`, data);

    // callback
    eventType = eventType.replace(/\b\w+\b/g, word => word.substring(0, 1).toUpperCase() + word.substring(1));
    const onFunction = `on${eventType}`;
    if (typeof this.options[onFunction] === 'function') {
      this.options[onFunction](...params);
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
    this._trigger('change', this.options.parse(this.val()), this.options.name, NAMESPACE);
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

  destory() {
    this.$element.data(NAMESPACE, null);
    this.$wrap.remove();
    this._trigger('destory');
  }

  static localize(lang, labels) {
    STRINGS[lang] = labels;
  }

  static setDefaults(options) {
    $.extend(true, DEFAULTS, $.isPlainObject(options) && options);
  }
}

export default asBgPicker;
