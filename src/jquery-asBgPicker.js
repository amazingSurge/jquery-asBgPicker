/*
 * asBgPicker
 * https://github.com/amazingSurge/jquery-asBgPicker
 *
 * Copyright (c) 2014 amazingSurge
 * Licensed under the GPL license.
 */
(function($, document, window, undefined) {
    "use strict";

    var pluginName = 'asBgPicker';

    // main constructor
    var Plugin = $[pluginName] = function(element, options) {
        this.element = element;
        this.$element = $(element);

        this.options = $.extend({}, Plugin.defaults, options, this.$element.data());

        // load lang strings
        if (typeof Plugin.Strings[this.options.lang] === 'undefined') {
            this.lang = 'en';
        } else {
            this.lang = this.options.lang;
        }
        this.strings = $.extend({}, Plugin.Strings[this.lang], this.options.strings);

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

        // flag
        this.disabled = false;
        this.initialed = false;

        var self = this;
        $.extend(self, {
            init: function() {
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

            _bindEvent: function() {
                this.$initiate.on('click', function() {
                    if (self.disabled) {
                        return;
                    }

                    self.$wrap.addClass(self.classes.expand).removeClass(self.classes.exist);
                });

                this.$info.on('mouseenter', function() {
                    if (self.disabled) {
                        return;
                    }

                    $(this).addClass(self.classes.hover);
                }).on('mouseleave', function() {
                    if (self.disabled) {
                        return;
                    }

                    $(this).removeClass(self.classes.hover);
                });

                this.$change.on("click", function() {
                    if (self.disabled) {
                        return;
                    }

                    self.$wrap.addClass(self.classes.expand).removeClass(self.classes.exist);
                });

                this.$remove.on("click", function() {
                    if (self.disabled) {
                        return;
                    }

                    self.clear();

                    return false;
                });

                this.$close.on("click", function() {
                    if (self.disabled) {
                        return;
                    }

                    self.$wrap.addClass(self.classes.exist).removeClass(self.classes.expand);
                    return false;
                });

                this.$image.on('click', function() {
                    if (self.disabled) {
                        return;
                    }

                    self.options.select.call(self);
                });
            },
            _createHtml: function() {
                this.$wrap = $(this.options.tpl().replace(/\{\{namespace\}\}/g, this.namespace)
                    .replace(/\{\{strings.placeholder\}\}/g, this.strings.placeholder)
                    .replace(/\{\{strings.change\}\}/g, this.strings.change));
                this.$element.after(this.$wrap);

                this.$initiate = $('.' + this.namespace + '-initiate', this.$wrap);

                this.$info = $('.' + this.namespace + '-info', this.$wrap);
                this.$info_imageName = $('.' + this.namespace + '-info-image-name', this.$info);
                this.$remove = $('.' + this.namespace + '-info-remove', this.$info);
                this.$change = $('.' + this.namespace + '-info-change', this.$info);

                this.$expand = $('.' + this.namespace + '-expand', this.$wrap);
                this.$close = $('.' + this.namespace + '-expand-close', this.$expand);
                this.$image_wrap = $('.' + this.namespace + '-expand-image-wrap', this.$expand);
                this.$image = $('.' + this.namespace + '-expand-image', this.$expand);
            },

            _trigger: function(eventType) {
                var method_arguments = Array.prototype.slice.call(arguments, 1),
                    data = [self].concat(method_arguments);

                // event
                self.$element.trigger('asBgPicker::' + eventType, data);

                // callback
                eventType = eventType.replace(/\b\w+\b/g, function(word) {
                    return word.substring(0, 1).toUpperCase() + word.substring(1);
                });
                var onFunction = 'on' + eventType;
                if (typeof self.options[onFunction] === 'function') {
                    self.options[onFunction].apply(self, method_arguments);
                }
            },
            _setState: function(image) {
                if (!image || image === self.options.image) {
                    self.$wrap.addClass(self.classes.empty);
                } else {
                    self.$wrap.removeClass(self.classes.empty);
                }
            },
            _returnInfo: function(image) {
                var img_name;
                if (!image || image === self.options.image) {
                    self.$info_imageName.text(self.strings.placeholder);
                } else {
                    img_name = image.match(/([\S]+[\/])([\S]+\w+$)/i)[2];
                    self.$info_imageName.text(img_name);
                }
            },
            _update: function() {
                if (self.value === null) {
                    self.value = {};
                }

                self.$element.val(self.val());
                self._trigger('change', self.options.parse(self.val()), self.options.name, pluginName);
            },

            doRepeat: {
                values: self.options.repeat.values,
                default_value: self.options.repeat.default_value,
                init: function() {
                    var that = this;

                    var tpl_content = self.options.repeat.tpl().replace(/\{\{namespace\}\}/g, self.namespace)
                        .replace(/\{\{strings.bgRepeat\}\}/g, self.strings.bgRepeat);
                    this.$tpl_repeat = $(tpl_content);
                    self.$image_wrap.after(this.$tpl_repeat);

                    this.$repeat = self.$expand.find('.' + self.namespace + '-repeat');
                    this.$items = this.$repeat.find('li');

                    $.each(this.values, function(key, value) {
                        that.$items.eq(key).data('repeat', value);
                    });

                    var value = typeof self.value.repeat !== 'undefined' ? self.value.repeat : this.default_value;
                    this.set(value);

                    this.bindEvent();
                },

                set: function(value) {
                    var found = false;
                    this.$items.removeClass(self.classes.active);
                    for (var i = 0; i < this.values.length; i++) {
                        if (value === this.values[i]) {
                            self.value.repeat = value;
                            this.$items.eq(i).addClass(self.classes.active);
                            self.$image.css({
                                "background-repeat": value
                            });
                            found = true;
                        }
                    }
                    if (!found) {
                        this.set(this.default_value);
                    }
                },

                clear: function() {
                    this.set(this.default_value);
                },

                bindEvent: function() {
                    var that = this;
                    this.$repeat.on("click", "li", function() {
                        if (self.disabled) {
                            return;
                        }
                        var value = $(this).data("repeat");
                        that.set(value);
                        self._update();
                        return false;
                    });
                }
            },

            doPosition: {
                values: self.options.position.values,
                default_value: self.options.position.default_value,
                init: function() {
                    var that = this;

                    var tpl_content = self.options.position.tpl().replace(/\{\{namespace\}\}/g, self.namespace)
                        .replace(/\{\{strings.bgPosition\}\}/g, self.strings.bgPosition);
                    this.$tpl_position = $(tpl_content);
                    self.$image_wrap.after(this.$tpl_position);

                    this.$position = self.$expand.find('.' + self.namespace + '-position');
                    this.$items = this.$position.find('li');

                    $.each(this.values, function(key, value) {
                        that.$items.eq(key).data('position', value);
                    });

                    var value = typeof self.value.position !== 'undefined' ? self.value.position : this.default_value;
                    this.set(value);

                    this.bindEvent();
                },

                set: function(value) {
                    var found = false;
                    this.$items.removeClass(self.classes.active);
                    for (var i = 0; i < this.values.length; i++) {
                        if (value === this.values[i]) {
                            self.value.position = value;
                            this.$items.eq(i).addClass(self.classes.active);
                            self.$image.css({
                                "background-position": value
                            });
                            found = true;
                        }
                    }

                    if (!found) {
                        this.set(this.default_value);
                    }
                },

                clear: function() {
                    this.set(this.default_value);
                },

                bindEvent: function() {
                    var that = this;
                    this.$position.on("click", "li", function() {
                        if (self.disabled) {
                            return;
                        }
                        var value = $(this).data("position");
                        that.set(value);
                        self._update();
                        return false;
                    });
                }
            },

            doSize: {
                values: self.options.size.values,
                default_value: self.options.size.default_value,
                init: function() {
                    var that = this;

                    var tpl_content = self.options.size.tpl().replace(/\{\{namespace\}\}/g, self.namespace)
                        .replace(/\{\{strings.bgSize\}\}/g, self.strings.bgSize);
                    this.$tpl_size = $(tpl_content);
                    self.$image_wrap.after(this.$tpl_size);

                    this.$size = self.$expand.find('.' + self.namespace + '-size');
                    this.$items = this.$size.find('li');

                    $.each(this.values, function(key, value) {
                        that.$items.eq(key).data('size', value);
                    });

                    var value = typeof self.value.size !== 'undefined' ? self.value.size : this.default_value;
                    this.set(value);

                    this.bindEvent();
                },

                set: function(value) {
                    var found = false;
                    this.$items.removeClass(self.classes.active);
                    for (var i = 0; i < this.values.length; i++) {
                        if (value === this.values[i]) {
                            self.value.size = value;
                            this.$items.eq(i).addClass(self.classes.active);
                            self.$image.css({
                                "background-size": value
                            });
                            found = true;
                        }
                    }
                    if (!found) {
                        this.set(this.default_value);
                    }
                },

                clear: function() {
                    this.set(this.default_value);
                },

                bindEvent: function() {
                    var that = this;
                    this.$size.on("click", "li", function() {
                        if (self.disabled) {
                            return;
                        }
                        var value = $(this).data("size");
                        that.set(value);
                        self._update();
                        return false;
                    });
                }
            },

            doAttachment: {
                values: self.options.attachment.values,
                default_value: self.options.attachment.default_value,
                init: function() {
                    var that = this;
                    var tpl_content = self.options.attachment.tpl().replace(/\{\{attachNamespace\}\}/g, self.options.attachment.namespace)
                        .replace(/\{\{namespace\}\}/g, self.namespace)
                        .replace(/\{\{strings.bgAttach\}\}/g, self.strings.bgAttach);
                    this.$tpl_attachment = $(tpl_content);
                    self.$image_wrap.after(this.$tpl_attachment);

                    this.$attachment = self.$expand.find('.' + self.namespace + '-attachment');
                    this.$items = this.$attachment.find('li');
                    this.$dropdown = self.$expand.find('.' + self.options.attachment.namespace);
                    this.values = self.options.attachment.values;

                    $.each(this.values, function(key, value) {
                        that.$items.eq(key).data('attachment', value);
                    });

                    this.$dropdown.asDropdown({
                        namespace: self.options.attachment.namespace,
                        imitateSelect: true,
                        data: "attachment",
                        // select: that.attachment,
                        onChange: function(value) {
                            if (self.disabled) {
                                return;
                            }
                            self.value.attachment = value;
                            self._update();
                            self.$image.css({
                                "background-attachment": self.value.attachment
                            });
                        }
                    });

                    var value = typeof self.value.attachment !== 'undefined' ? self.value.attachment : this.default_value;
                    this.set(value);
                },

                set: function(value) {
                    var found = false;
                    this.$items.removeClass(self.classes.active);
                    for (var i = 0; i < this.values.length; i++) {
                        if (value === this.values[i]) {
                            this.$dropdown.data('asDropdown').set(value);
                            found = true;
                        }
                    }

                    if (!found) {
                        this.set(this.default_value);
                    }
                },

                clear: function() {
                    this.set(this.default_value);
                }
            }
        });

        this._trigger('init');
        this.init();
    };

    Plugin.prototype = {
        constructor: Plugin,

        val: function(value) {
            if (typeof value === 'undefined') {
                return this.options.process(this.value);
            }

            var value_obj = this.options.parse(value);

            if (value_obj) {
                this.set(value_obj);
            } else {
                this.clear();
            }
        },

        set: function(value, update) {
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
        },

        clear: function(update) {
            this.value = {};

            if (update !== false) {
                var image = "";
                this.setImage(image);

                this.doRepeat.clear();
                this.doSize.clear();
                this.doPosition.clear();
                this.doAttachment.clear();
                this._update();
            }
        },

        setImage: function(image) {
            var thumbnailUrl,
                self = this;
            this._setState(image);
            this._returnInfo(image);
            if (image === '' || typeof image === 'undefined') {
                this.$image.css({
                    "background-image": 'none'
                });
            } else if (image || image !== this.options.image) {
                thumbnailUrl = this.options.getThumbnalil(image);
                var img = new Image();
                img.onload = function() {
                    self.value.image = thumbnailUrl;
                    self._returnInfo(self.value.image);
                    self.$image.css({
                        "background-image": 'url("' + self.value.image + '")'
                    });
                };
                img.onerror = function() {
                    self.value.image = image;
                    self._returnInfo(image);
                    self._update();
                    self.$image.css({
                        "background-image": 'none'
                    });
                };
                img.src = thumbnailUrl;
            }
        },

        setRepeat: function(repeat) {
            this.doRepeat.set(repeat);
            this._update();
        },
        setSize: function(size) {
            this.doSize.set(size);
            this._update();
        },
        setPosition: function(position) {
            this.doPosition.set(position);
            this._update();
        },
        setAttachment: function(attachment) {
            this.doAttachment.set(attachment);
            this._update();
        },

        get: function() {
            return this.value;
        },

        enable: function() {
            this.disabled = false;
            this.$wrap.removeClass(this.classes.disabled);
        },
        disable: function() {
            this.disabled = true;
            this.$wrap.addClass(this.classes.disabled);
        },
        destory: function() {
            this.$element.data(pluginName, null);
            this.$wrap.remove();
            this._trigger('destory');
        }
    };

    Plugin.defaults = {
        namespace: pluginName,
        skin: null,
        image: "images\/defaults.png", // "..\/xxxx\/images\/xxxx.png"
        lang: 'en',
        repeat: {
            default_value: 'repeat',
            values: ["no-repeat", "repeat", "repeat-x", "repeat-y"],
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
            default_value: 'top left',
            values: ["top left", "top center", "top right", "center left", "center center", "center right", "bottom left", "bottom center", "bottom right"],
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
            default_value: 'auto',
            values: ["auto", "cover", "contain", "100% 100%"],
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
            default_value: 'scroll',
            values: ["scroll", "fixed", "inherit"],
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
            if (value && typeof value.image !== 'undefined' && value.image !== '') {
                return JSON.stringify(value);
            } else {
                return '';
            }
        },

        parse: function(value) {
            if (value) {
                return $.parseJSON(value);
            } else {
                return {};
            }
        },

        getThumbnalil: function(image) {
            var imageData,
                imagePath,
                imageFormat,
                imageName;

            imageData = image.match(/([\S]+[\/])([\S]+)(\.+\w+$)/i);
            imagePath = imageData[1];
            imageName = imageData[2];
            imageFormat = imageData[3];

            if (imageName.search('thumbnail') === 0) {
                return imagePath + imageName + imageFormat;
            } else {
                return imagePath + 'thumbnail-' + imageName + imageFormat;
            }
        },
        select: function() {},
        onChange: function() {},
        strings: {}
    };

    Plugin.Strings = {};

    Plugin.localize = function(lang, label) {
        Plugin.Strings[lang] = label;
    };

    Plugin.localize('en', {
        placeholder: 'Add Image',
        change: 'change',
        bgRepeat: 'Repeat',
        bgPosition: 'Position',
        bgAttach: 'Attach',
        bgSize: 'Scalling'
    });

    $.fn[pluginName] = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = Array.prototype.slice.call(arguments, 1);

            if (/^\_/.test(method)) {
                return false;
            } else if (method === 'val' && method_arguments.length === 0) {
                var api = this.first().data(pluginName);
                if (api && typeof api[method] === 'function') {
                    return api[method].apply(api, method_arguments);
                }
            } else {
                return this.each(function() {
                    var api = $.data(this, pluginName);
                    if (api && typeof api[method] === 'function') {
                        api[method].apply(api, method_arguments);
                    }
                });
            }
        } else {
            return this.each(function() {
                if (!$.data(this, pluginName)) {
                    $.data(this, pluginName, new Plugin(this, options));
                }
            });
        }
    };
})(jQuery, document, window);
