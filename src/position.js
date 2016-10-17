export default class Position {
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
