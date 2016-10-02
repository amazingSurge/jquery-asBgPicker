import $ from 'jquery';
import asBgPicker from './asBgPicker';
import info from './info';

const NAMESPACE = 'asBgPicker';
const OtherAsScrollbar = $.fn.asBgPicker;

const jQueryasBgPicker = function(options, ...args) {
  if (typeof options === 'string') {
    const method = options;

    if (/^_/.test(method)) {
      return false;
    } else if ((/^(get)/.test(method))) {
      const instance = this.first().data(NAMESPACE);
      if (instance && typeof instance[method] === 'function') {
        return instance[method](...args);
      }
    } else {
      return this.each(function() {
        const instance = $.data(this, NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          instance[method](...args);
        }
      });
    }
  }

  return this.each(function() {
    if (!$(this).data(NAMESPACE)) {
      $(this).data(NAMESPACE, new asBgPicker(this, options));
    }
  });
};

$.fn.asBgPicker = jQueryasBgPicker;

$.asBgPicker = $.extend({
  setDefaults: asBgPicker.setDefaults,
  localize: asBgPicker.localize,
  noConflict: function() {
    $.fn.asBgPicker = OtherAsScrollbar;
    return jQueryasBgPicker;
  }
}, info);
