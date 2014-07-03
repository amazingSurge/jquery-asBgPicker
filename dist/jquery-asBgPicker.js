/*! jQuery asBgPicker - v0.1.0 - 2014-07-03
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

        if (this.$element.attr('name')) {
            this.name = this.$element.attr('name');
        } else {
            this.name = options.name;
        }

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

        var self = this;
        $.extend(self, {
            init: function() {
                self._createHtml();

                if (self.options.skin) {
                    self.$wrap.addClass(self.classes.skin);
                }

                self._getValue();

                if (self.options.disabled) {
                    self.disable();
                }
                // init
                self.setImage(self.value.image);

                self.doSize.init();
                self.doAttachment.init();
                self.doPosition.init();
                self.doRepeat.init();

                self._bindEvent();

                self.initialed = true;
                // after init end trigger 'ready'
                self._trigger('ready');
            },

            _bindEvent: function() {
                self.$initiate.on('mouseenter', function() {
                    if (self.disabled) {
                        return;
                    }

                    self.$actions.addClass(self.classes.show);
                    self.$remove.addClass(self.classes.show);
                }).on('mouseleave', function() {
                    if (self.disabled) {
                        return;
                    }

                    self.$actions.removeClass(self.classes.show);
                    self.$remove.removeClass(self.classes.show);
                });

                self.$actions.on("click", function() {
                    if (self.disabled) {
                        return;
                    }

                    self.$initiate.addClass(self.classes.hide);
                    self.$wrap.append(self.$extend);
                    self.$extend.removeClass(self.classes.hide).addClass(self.classes.show);
                });

                self.$remove.on("click", function() {
                    if (self.disabled) {
                        return;
                    }

                    self.clear();

                    return false;
                });

                self.$close.on("click", function() {
                    if (self.disabled) {
                        return;
                    }

                    self.$extend.removeClass(self.classes.show).addClass(self.classes.hide);
                    self.$initiate.removeClass(self.classes.hide);

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
                self.$wrap = $(self.options.tpl());
                self.$extend = $(self.options.tpl_extend());
                self.$element.after(self.$wrap);

                self.$initiate = self.$wrap.find('.' + self.namespace + '-initiate');
                self.$info = self.$initiate.find('.' + self.namespace + '-image-info');
                self.$remove = self.$wrap.find('.' + self.namespace + '-remove');
                self.$actions = self.$wrap.find('.' + self.namespace + '-actions');
                self.$close = self.$extend.find('.' + self.namespace + '-close');

                self.$image_wrap = self.$extend.find('.' + self.namespace + '-image-wrap');
                self.$image = self.$extend.find('.' + self.namespace + '-image');
            },

            _trigger: function(eventType) {
                // event
                self.$element.trigger('asBgPicker::' + eventType, self);
                self.$element.trigger(eventType + '.asBgPicker', self);

                // callback
                eventType = eventType.replace(/\b\w+\b/g, function(word) {
                    return word.substring(0, 1).toUpperCase() + word.substring(1);
                });
                var onFunction = 'on' + eventType;
                var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;
                if (typeof self.options[onFunction] === 'function') {
                    self.options[onFunction].apply(self, method_arguments);
                }
            },
            _getValue: function() {
                var value = self.$element.val();

                if (value) {
                    self.value = self.options.parse(value);
                } else {
                    return self.value = '';
                }
            },
            _setState: function(image) {
                if (!image || image === self.options.image) {
                    self.$initiate.removeClass(self.classes.hasImage);
                } else {
                    self.$initiate.addClass(self.classes.hasImage);
                }
            },
            _returnInfo: function(image) {
                var img_name;
                if (!image || image === self.options.image) {
                    $(self.$info)[0].lastChild.nodeValue = "Add Image";
                } else {
                    img_name = image.match(/([\S]+[\/])([\S]+\w+$)/i)[2];
                    $(self.$info)[0].lastChild.nodeValue = img_name;
                }
            },
            _process: function() {
                if (self.value === null || self.value.image === "undefined") {
                    self.value = {};
                }

                self.options.onChange.call(self, self.value);
                self.$element.val(self.options.process(self.value));
            },

            doRepeat: {
                init: function() {
                    var oneself = this;
                    if (!self.value.repeat) {
                        this.repeat = self.options.repeat.default_value;
                    } else {
                        this.repeat = self.value.repeat;
                    }

                    var tpl_content = self.options.repeat.tpl().replace(/namespace/g, self.namespace);
                    this.$tpl_repeat = $(tpl_content);
                    self.$image_wrap.after(this.$tpl_repeat);

                    this.$repeat = self.$extend.find('.' + self.namespace + '-repeat');
                    this.$items = this.$repeat.find('li');
                    this.repeatValues = self.options.repeat.values;

                    $.each(this.repeatValues, function(key, value) {
                        oneself.$items.eq(key).data('repeat', value);
                    });

                    this.set(this.repeat);
                    this.bindEvent();
                },

                set: function(newValue) {
                    this.$items.removeClass(self.classes.active);
                    for (var i = 0; i < this.repeatValues.length; i++) {
                        if (newValue === this.repeatValues[i]) {
                            self.value.repeat = newValue;
                            this.$items.eq(i).addClass(self.classes.active);
                        }
                    };
                    self.$image.css({
                        "background-repeat": newValue
                    });
                },

                bindEvent: function() {
                    var oneself = this;
                    this.$repeat.on("click", "li", function() {
                        if (self.disabled) {
                            return;
                        }
                        var bgRepeat = $(this).data("repeat");
                        oneself.set(bgRepeat);
                        self._process();
                        return false;
                    });
                }
            },

            doPosition: {
                init: function() {
                    var oneself = this;
                    if (!self.value.position) {
                        this.position = self.options.position.default_value;
                    } else {
                        this.position = self.value.position;
                    }

                    var tpl_content = self.options.position.tpl().replace(/namespace/g, self.namespace);
                    this.$tpl_position = $(tpl_content);
                    self.$image_wrap.after(this.$tpl_position);

                    this.$position = self.$extend.find('.' + self.namespace + '-position');
                    this.$items = this.$position.find('li');
                    this.positionValues = self.options.position.values;

                    $.each(this.positionValues, function(key, value) {
                        oneself.$items.eq(key).data('position', value);
                    });

                    this.set(this.position);
                    this.bindEvent();
                },

                set: function(newValue) {
                    this.$items.removeClass(self.classes.active);
                    for (var i = 0; i < this.positionValues.length; i++) {
                        if (newValue === this.positionValues[i]) {
                            self.value.position = newValue;
                            this.$items.eq(i).addClass(self.classes.active);
                        }
                    };
                    self.$image.css({
                        "background-position": newValue
                    });
                },

                bindEvent: function() {
                    var oneself = this;
                    this.$position.on("click", "li", function() {
                        if (self.disabled) {
                            return;
                        }
                        var bgPosition = $(this).data("position");
                        oneself.set(bgPosition);
                        self._process();
                        return false;
                    });
                }
            },

            doSize: {
                init: function() {
                    var oneself = this;
                    if (!self.value.size) {
                        this.size = self.options.size.default_value;
                    } else {
                        this.size = self.value.size;
                    }

                    var tpl_content = self.options.size.tpl().replace(/namespace/g, self.namespace);
                    this.$tpl_size = $(tpl_content);
                    self.$image_wrap.after(this.$tpl_size);

                    this.$size = self.$extend.find('.' + self.namespace + '-size');
                    this.$items = this.$size.find('li');
                    this.sizeValues = self.options.size.values;

                    $.each(this.sizeValues, function(key, value) {
                        oneself.$items.eq(key).data('size', value);
                    });

                    this.set(this.size);
                    this.bindEvent();
                },

                set: function(newValue) {
                    this.$items.removeClass(self.classes.active);
                    for (var i = 0; i < this.sizeValues.length; i++) {
                        if (newValue === this.sizeValues[i]) {
                            self.value.size = newValue;
                            this.$items.eq(i).addClass(self.classes.active);
                        }
                    };
                    self.$image.css({
                        "background-size": newValue
                    });
                },

                bindEvent: function() {
                    var oneself = this;
                    this.$size.on("click", "li", function() {
                        if (self.disabled) {
                            return;
                        }
                        var bgSize = $(this).data("size");
                        oneself.set(bgSize);
                        self._process();
                        return false;
                    });
                }
            },

            doAttachment: {
                init: function() {
                    var oneself = this;
                    if (!self.value.attachment) {
                        this.attachment = self.options.attachment.default_value;
                    } else {
                        this.attachment = self.value.attachment;
                    }

                    var tpl_content = self.options.attachment.tpl().replace(/otherNamespace/g, self.options.attachment.namespace).replace(/namespace/g, self.namespace);
                    this.$tpl_attachment = $(tpl_content);
                    self.$image_wrap.after(this.$tpl_attachment);

                    this.$attachment = self.$extend.find('.' + self.namespace + '-attachment');
                    this.$items = this.$attachment.find('li');
                    this.$dropdown = self.$extend.find('.' + self.options.attachment.namespace);
                    this.attachmentValues = self.options.attachment.values;

                    $.each(this.attachmentValues, function(key, value) {
                        oneself.$items.eq(key).data('attachment', value);
                    });

                    this.$dropdown.asDropdown({
                        namespace: self.options.attachment.namespace,
                        imitateSelect: true,
                        data: "attachment",
                        // select: oneself.attachment,
                        onChange: function(value) {
                            if (self.disabled) {
                                return;
                            }
                            self.value.attachment = value;
                            self._process();
                            self.$image.css({
                                "background-attachment": self.value.attachment
                            });
                        }
                    });

                    this.set(this.attachment);
                },

                set: function(value) {
                    this.$dropdown.data('asDropdown').set(value);
                }
            }
        });

        this._trigger('init');
        this.init();
    };

    Plugin.prototype = {
        constructor: Plugin,
        components: {},

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

            if (update !== false) {
                self.value = value;

                self.setImage(value.image);
                self.doRepeat.set(value.repeat);
                self.doSize.set(value.size);
                self.doPosition.set(value.position);
                self.doAttachment.set(value.attachment);

                self._process();
                self.options.onChange.call(self, value);
            }
        },

        clear: function(update) {
            var self = this;
            self.value = null;

            if (update !== false) {
                var image = "",
                    repeat = "",
                    position = "",
                    attachment = "",
                    size = "";

                self.setImage(image);

                self.doRepeat.set(repeat);
                self.doSize.set(size);
                self.doPosition.set(position);
                self.doAttachment.set(attachment);
                self._process();
                self.options.onChange.call(self, self.value);
            }
        },

        setImage: function(image) {
            var thumbnailUrl,
                self = this;
            self._setState(image);
            self._returnInfo(image);
            if (image === '' || typeof image === 'undefined') {
                self.$image.css({
                    "background-image": 'none'
                });
                return;
            } else if (image || image !== self.options.image) {
                thumbnailUrl = self.options.getThumbnalil(image);
                var img = new Image();
                img.onload = function() {
                    self.value.image = thumbnailUrl;
                    self._returnInfo(self.value.image);
                    self._process();
                    self.$image.css({
                        "background-image": 'url("' + self.value.image + '")'
                    });
                };
                img.onerror = function() {
                    self.value.image = image;
                    self._returnInfo(image);
                    self._process();
                    self.$image.css({
                        "background-image": 'none'
                    });
                };
                img.src = thumbnailUrl;
            }
        },

        setRepeat: function(repeat) {
            this.repeat = repeat;
            this.doRepeat.set(repeat);
            this._process();
        },
        setSize: function(size) {
            this.size = size;
            this.doSize.set(size);
            this._process();
        },
        setPosition: function(position) {
            this.position = position;
            this.doPosition.set(position);
            this._process();
        },
        setAttachment: function(attachment) {
            this.attachment = attachment;
            this.doAttachment.set(attachment);
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
        name: null,
        image: "images\/defaults.png", // "..\/xxxx\/images\/xxxx.png"
        repeat: {
            default_value: 'repeat',
            values: ["no-repeat", "repeat", "repeat-x", "repeat-y"],
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
                return '<div class="namespace-attachment">' +
                    '<span class="namespace-attachment-title">Attach</span>' +
                    '<div class="namespace-attachment-content">' +
                    '<div class="otherNamespace namespace-dropdown-trigger"><i class="asIcon-caret-down"></i></div>' +
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
            return '<div class="' + this.namespace + '">' +
                '<div class="' + this.namespace + '-initiate">' +
                '<div class="' + this.namespace + '-image-info"><span></span>Add Image</div>' +
                '<div class="' + this.namespace + '-actions">Change</div>' +
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

        process: function(value) {
            if (value) {
                return JSON.stringify(value);
            } else {
                return '';
            }
        },

        parse: function(value) {
            if (value) {
                return $.parseJSON(value);
            } else {
                return null;
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
