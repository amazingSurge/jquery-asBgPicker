export default {
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