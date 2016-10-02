
export default class Repeat {
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
