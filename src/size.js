export default class Size {
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
