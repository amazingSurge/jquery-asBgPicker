export default class Attachment {
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
