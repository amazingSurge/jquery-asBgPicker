/*! jQuery asBgPicker - v0.1.0 - 2014-03-11
* https://github.com/amazingSurge/jquery-asBgPicker
* Copyright (c) 2014 amazingSurge; Licensed GPL */
(function($, document, window, undefined) {

    "use strict";

    var pluginName = 'asBgPicker';

    // main constructor
    var Plugin = $[pluginName] = function(element, options) {
        var metas = {};

        this.element = element;
        this.$element = $(element);

        this.options = $.extend({}, Plugin.defaults, options, this.$element.data(), metas);
        this.namespace = this.options.namespace;
        this.components = $.extend(true, {}, this.components);

        // public properties

        this.classes = {
            // status
            skin: this.namespace + '_' + this.options.skin,
            disabled: this.namespace + '_disabled',
            active: this.namespace + '_active',
            hide: this.namespace + '_hide',
            show: this.namespace + '_show',
            hasImage: this.namespace + '_hasImage'
            // empty: this.namespace + '_empty',
            // present: this.namespace + '_present'
        };

        // flag
        this.disabled = false;
        this.initialed = false;

        this._trigger('init');
        this.init();
    };

    Plugin.prototype = {
        constructor: Plugin,
        components: {},

        init: function() {
            var self = this;

            self._createHtml();

            if (this.options.skin) {
                this.$wrap.addClass(this.classes.skin);
            }

            self._getValue();

            if (this.options.disabled) {
                this.disable();
            }

            // //image
            self._setState(self.image);
            self._returnInfo(self.image);
            self.setImage(self.image);

            self._initSize(this.options.size);
            self._initAttachment(this.options.attachment);
            self._initPosition(this.options.position);
            self._initRepeat(this.options.repeat);

            self._bindEvent();

            // init
            self._process();

            this.initialed = true;
            // after init end trigger 'ready'
            this._trigger('ready');
        },

        _bindEvent: function() {
            var self = this;

            self.$bg_trigger.on('mouseenter', function() {
                if (self.disabled) {
                    return;
                }

                self.$bg_mask.addClass(self.classes.show);
                self.$bg_remove.addClass(self.classes.show);
            }).on('mouseleave', function() {
                if (self.disabled) {
                    return;
                }

                self.$bg_mask.removeClass(self.classes.show);
                self.$bg_remove.removeClass(self.classes.show);
            });

            self.$bg_mask.on("click", function() {
                if (self.disabled) {
                    return;
                }

                self.$bg_trigger.addClass(self.classes.hide);
                self.$wrap.append(self.$extend);
                self.$extend.removeClass(self.classes.hide).addClass(self.classes.show);
            });

            self._repeatEvent();
            self._positionEvent();
            self._sizeEvent();
            self._attachmentEvent();


            self.$bg_remove.on("click", function() {
                if (self.disabled) {
                    return;
                }

                self.image = "";
                self.repeat = "";
                self.position = "";
                self.attachment = "";
                self.size = "";
                self._setState(self.image);
                self._returnInfo(self.image);
                self._process();

                return false;
            });


            self.$bg_close.on("click", function() {
                if (self.disabled) {
                    return;
                }

                self.$extend.removeClass(self.classes.show).addClass(self.classes.hide);
                self.$bg_trigger.removeClass(self.classes.hide);

                return false;
            });

            self.$element.on('onChange', function() {
                if (self.disabled) {
                    return;
                }

                self.options.onChange.call(self);
            });

            self.$image.on('click', function() {
                if (self.disabled) {
                    return;
                }

                self.options.onClickImage.call(self);
            });
        },
        _createHtml: function() {
            this.$wrap = $(this.options.tpl());
            this.$extend = $(this.options.tpl_extend());
            this.$element.after(this.$wrap);

            this.$bg_trigger = this.$wrap.find('.' + this.namespace + '-trigger');
            this.$bg_image = this.$bg_trigger.find('.' + this.namespace + '-image-info');
            this.$bg_remove = this.$wrap.find('.' + this.namespace + '-remove');
            this.$bg_mask = this.$wrap.find('.' + this.namespace + '-mask');
            this.$bg_close = this.$extend.find('.' + this.namespace + '-close');

            this.$image = this.$extend.find('.' + this.namespace + '-image');
            this.$image_wrap = this.$extend.find('.' + this.namespace + '-image-wrap');
        },

        _trigger: function(eventType) {
            // event
            this.$element.trigger(pluginName + '::' + eventType, this);

            // callback
            eventType = eventType.replace(/\b\w+\b/g, function(word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            var onFunction = 'on' + eventType;
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;
            if (typeof this.options[onFunction] === 'function') {
                this.options[onFunction].apply(this, method_arguments);
            }
        },
        _getValue: function() {
            var value = this.$element.val();
            this.repeatValue = this.options.repeat.values;
            this.positionValue = this.options.position.values;
            this.sizeValue = this.options.size.values;
            this.attachmentValue = this.options.attachment.values;

            if (value) {
                this.value = this._parseValue(value);
                this.image = this.value.image;
            } else {
                return false;
            }

            if (!this.image) {
                this.image = this.options.image;
            }
        },
        _parseValue: function(value) {
            return jQuery.parseJSON(value);
        },

        _setState: function(image) {
            var self = this;
            if (!image || image === self.options.image) {
                self.$bg_trigger.removeClass(self.classes.hasImage);
            } else {
                self.$bg_trigger.addClass(self.classes.hasImage);
            }
        },
        _returnInfo: function(image) {
            var img_name,
                self = this;
            if (!image || image === self.options.image) {
                $(self.$bg_image)[0].lastChild.nodeValue = "Add Image";
            } else {
                img_name = image.match(/([\S]+[\/])([\S]+\w+$)/i)[2];
                $(self.$bg_image)[0].lastChild.nodeValue = img_name;
            }
        },
        _process: function() {
            this.value_current = {};
            this.value_current.repeat = this.repeat;
            this.value_current.position = this.position;
            this.value_current.attachment = this.attachment;
            this.value_current.image = this.image;
            this.value_current.size = this.size;

            this.$element.val(JSON.stringify(this.value_current));

            this.$image.css({
                "background-image": 'url("' + this.image + '")',
                "background-repeat": this.repeat,
                "background-attachment": this.attachment,
                "background-position": this.position,
                "background-size": this.size
            });
        },

        _initRepeat: function(options) {
            console.log(options, "repeat-options");
            var self = this;
            if (!self.value) {
                self.repeat = options.default_value;
            } else {
                self.repeat = self.value.repeat;
            }
            // console.log(options.tpl().replace(/namespace/g, self.namespace));
            var tpl_content = options.tpl().replace(/namespace/g, self.namespace);
            self.$tpl_repeat = $(tpl_content);
            self.$image_wrap.after(self.$tpl_repeat);

            self.$repeat = self.$extend.find('.' + self.namespace + '-repeat');
            self.$repeatItem = self.$repeat.find('li');

            $.each(self.repeatValue, function(key, value) {
                self.$repeatItem.eq(key).data('repeat', value);
                if (!self.repeat) {
                    self.$repeatItem.removeClass(self.classes.active);
                } else if (self.repeat === value) {
                    self.$repeatItem.eq(key).addClass(self.classes.active);
                }
            });
        },

        _repeatEvent: function() {
            var self = this;
            self.$repeat.on("click", "li", function() {
                if (self.disabled) {
                    return;
                }

                var bgRepeat = $(this).data("repeat");
                if (self.repeat === bgRepeat) {
                    return false;
                } else {
                    self.repeat = bgRepeat;
                }
                if ($(this).hasClass(self.classes.active)) {
                    return false;
                } else {
                    self.$repeatItem.removeClass(self.classes.active);
                    $(this).addClass(self.classes.active);
                }
                self._process();
            });
        },

        _initPosition: function(options) {
            console.log(options, "position-options");
            var self = this;
            if (!self.value) {
                self.position = options.default_value;
            } else {
                self.position = self.value.position;
            }
            // console.log(options.tpl().replace(/namespace/g, self.namespace));
            var tpl_content = options.tpl().replace(/namespace/g, self.namespace);
            self.$tpl_position = $(tpl_content);
            self.$image_wrap.after(self.$tpl_position);

            self.$position = self.$extend.find('.' + self.namespace + '-position');
            self.$positionItem = self.$position.find('li');

            $.each(self.positionValue, function(key, value) {
                self.$positionItem.eq(key).data('position', value);
                if (!self.position) {
                    self.$positionItem.removeClass(self.classes.active);
                } else if (self.position === value) {
                    self.$positionItem.eq(key).addClass(self.classes.active);
                }
            });
        },

        _positionEvent: function() {
            var self = this;
            self.$position.on("click", "li", function() {
                if (self.disabled) {
                    return;
                }

                var bgPosition = $(this).data("position");
                if (self.position === bgPosition) {
                    return false;
                } else {
                    self.position = bgPosition;
                }
                if ($(this).hasClass(self.classes.active)) {
                    return false;
                } else {
                    self.$positionItem.removeClass(self.classes.active);
                    $(this).addClass(self.classes.active);
                }
                self._process();
            });
        },

        _initSize: function(options) {
            console.log(options, "size-options");
            var self = this;
            if (!self.value) {
                self.size = options.default_value;
            } else {
                self.size = self.value.size;
            }

            var tpl_content = options.tpl().replace(/namespace/g, self.namespace);
            self.$tpl_size = $(tpl_content);
            self.$image_wrap.after(self.$tpl_size);

            self.$size = self.$extend.find('.' + self.namespace + '-size');
            self.$sizeItem = self.$size.find('li');

            $.each(self.sizeValue, function(key, value) {
                self.$sizeItem.eq(key).data('size', value);
                if (!self.size) {
                    self.$sizeItem.removeClass(self.classes.active);
                } else if (self.size === value) {
                    self.$sizeItem.eq(key).addClass(self.classes.active);
                }
            });
        },

        _sizeEvent: function() {
            var self = this;
            self.$size.on("click", "li", function() {
                if (self.disabled) {
                    return;
                }

                var bgSize = $(this).data("size");
                if (self.size === bgSize) {
                    return false;
                } else {
                    self.size = bgSize;
                }
                if ($(this).hasClass(self.classes.active)) {
                    return false;
                } else {
                    self.$sizeItem.removeClass(self.classes.active);
                    $(this).addClass(self.classes.active);
                }
                self._process();
            });
        },

        _initAttachment: function(options) {
            console.log(options, "attachment-options");
            var self = this;
            if (!self.value) {
                self.attachment = options.default_value;
            } else {
                self.attachment = self.value.attachment;
            }

            var tpl_content = options.tpl().replace(/otherNamespace/g, options.namespace).replace(/namespace/g, self.namespace);
            self.$tpl_attachment = $(tpl_content);
            self.$image_wrap.after(self.$tpl_attachment);

            self.$attachment = self.$extend.find('.' + self.namespace + '-attachment');
            self.$attachmentItem = self.$attachment.find('li');
            self.$dropdown = self.$extend.find('.' + options.namespace);

            for (var i = 0; i < self.attachmentValue.length; i++) {
                if (self.attachmentValue[i] === self.attachment) {
                    self.select = i;
                }
            }
        },

        _attachmentEvent: function() {
            var self = this;
            self.$dropdown.dropdown({
                namespace: self.options.attachment.namespace,
                imitateSelect: true,
                select: self.select,
                onChange: function($elem) {
                    if (self.disabled) {
                        return;
                    }

                    self.attachment = $elem.attr('value');
                    self._process();
                }
            });
        },

        /*
            Public Method
         */
        val: function(value, update) {
            if (typeof value === 'undefined') {
                return this.value;
            }

            if (value) {
                this.set(value, update);
            } else {
                this.clear(update);
            }
        },

        set: function(value, update) {
            var self = this;
            self.value = value;

            // self._initSize([value.size]);
            // self._initAttachment([value.attachment]);
            // self._initPosition([value.position]);
            // self._initRepeat([value.repeat]);

            if (update !== false) {
                self.options.onChange.call(self, value);
                self.$element.val(JSON.stringify(value));

                // this.$image.css({
                //     "background-image": 'url("' + value.image + '")',
                //     "background-repeat": value.repeat,
                //     "background-attachment": value.attachment,
                //     "background-position": value.position,
                //     "background-size": value.size
                // });
            }

        },

        clear: function(update) {
            this.value = null;
            self.image = "";
            self.repeat = "";
            self.position = "";
            self.attachment = "";
            self.size = "";
            // self._setState(self.image);
            // self._returnInfo(self.image);
            self._process();

            // this._setState('empty');

            if (update !== false) {
                this.options.onChange.call(this, this.value);
                // this.$element.val(this.value);
            }
        },

        setImage: function(image) {
            var thumbnailUrl,
                self = this;
            thumbnailUrl = self.options.getThumbnalil(image);
            self._setState(image);
            self._returnInfo(image);
            if (image || image !== self.options.image) {
                var img = new Image();
                img.onload = function() {
                    self.image = thumbnailUrl;
                    self._returnInfo(self.image);
                    self._process();
                };
                img.onerror = function() {
                    self.image = image;
                    self._returnInfo(self.image);
                    self._process();
                };
                img.src = thumbnailUrl;
            }
        },

        setRepeat: function(repeat) {
            this.repeat = repeat;
            this._process();
        },
        setSize: function(size) {
            this.size = size;
            this._process();
        },
        setPosition: function(position) {
            this.position = position;
            this._process();
        },
        setAttachment: function(attachment) {
            this.attachment = attachment;
            this._process();
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
        repeat: {
            default_value: 'repeat',
            values: ["no-repeat", "repeat", "repeat-x", "repeat-y"],
            //this.options.tpl().replace(/namespace/g, this.namespace);
            tpl: function() {
                return '<div class="namespace-repeat">' +
                    '<span class="namespace-repeat-title">Repeat</span>' +
                    '<ul class="namespace-repeat-content">' +
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
                return '<div class="namespace-position">' +
                    '<span class="namespace-position-title">Position</span>' +
                    '<ul class="namespace-position-content">' +
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
                return '<div class="namespace-size">' +
                    '<span class="namespace-size-title">Scalling</span>' +
                    '<ul class="namespace-size-content">' +
                    '<li class="size_adapt-height"></li>' +
                    '<li class="size_adapt-width"></li>' +
                    '<li class="size_adapt-all"></li>' +
                    '<li class="size_adapt-auto"></li>' +
                    '</ul>' +
                    '</div>';
            }
        },
        attachment: {
            namespace: 'az-dropdown',
            default_value: 'scroll',
            values: ["scroll", "fixed", "inherit"],
            tpl: function() {
                return '<div class="namespace-attachment">' +
                    '<span class="namespace-attachment-title">Attach</span>' +
                    '<div class="namespace-attachment-content">' +
                    '<div class="otherNamespace namespace-dropdown-trigger"><span></span></div>' +
                    '<ul>' +
                    '<li class="attachment_scroll" value="scroll">scroll</li>' +
                    '<li class="attachment_fixed" value="fixed">fixed</li>' +
                    '<li class="attachment_default" value="inherit">default</li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>';
            }
        },
        // position: null,

        tpl: function() {
            return '<div class="' + this.namespace + '">' +
                '<div class="' + this.namespace + '-trigger">' +
                '<div class="' + this.namespace + '-image-info"><span></span>Add Image</div>' +
                '<div class="' + this.namespace + '-mask">Change</div>' +
                '<a class="' + this.namespace + '-remove" href=""></a>' +
                '</div>' +
                '</div>';
        },

        tpl_extend: function() {
            return '<div class="' + this.namespace + '-extend">' +
                '<a class="' + this.namespace + '-close" href="#"></a>' +
                '<div class="' + this.namespace + '-image-wrap">' +
                '<div class="' + this.namespace + '-image"></div>' +
                '</div>' +
                '</div>';
        },

        getThumbnalil: function(image) {
            var imageData,
                imagePath,
                imageFormat,
                imageName;

            if (!image) {
                return false;
            } else {
                imageData = image.match(/([\S]+[\/])([\S]+)(\.+\w+$)/i);
                imagePath = imageData[1];
                imageName = imageData[2];
                imageFormat = imageData[3];

                return imagePath + 'thumbnail-' + imageName + imageFormat;
            }
        },

        onChange: function() {},
        onClickImage: function() {}
    };

    Plugin.registerComponent = function(component, methods) {
        Plugin.prototype.components[component] = methods;
    };

    $.fn[pluginName] = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;

            if (/^\_/.test(method)) {
                return false;
            } else if ((/^(getTabs)$/.test(method)) || (method === 'val' && method_arguments === undefined)) {
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
