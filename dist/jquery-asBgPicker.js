/*! jQuery asBgPicker - v0.1.0 - 2014-03-13
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

        var self = this;
        $.extend(self, {
            init: function() {
                // console.log(this,"thisxxxx",self);
                self._createHtml();

                if (self.options.skin) {
                    self.$wrap.addClass(self.classes.skin);
                }

                self._getValue();

                if (self.options.disabled) {
                    self.disable();
                }

                // //image
                self._setState(self.image);
                self._returnInfo(self.image);
                self.setImage(self.image);

                self.doSize.init();
                self.doAttachment.init();
                self.doPosition.init();
                self.doRepeat.init();

                self._bindEvent();

                // init
                self.val(self.value, true);

                self.initialed = true;
                // after init end trigger 'ready'
                self._trigger('ready');
            },

            _bindEvent: function() {
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

                self.doRepeat.bindEvent();
                self.doPosition.bindEvent();
                self.doSize.bindEvent();
                self.doAttachment.bindEvent();

                self.$bg_remove.on("click", function() {
                    if (self.disabled) {
                        return;
                    }

                    self.clear();

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
                self.$wrap = $(self.options.tpl());
                self.$extend = $(self.options.tpl_extend());
                self.$element.after(self.$wrap);

                self.$bg_trigger = self.$wrap.find('.' + self.namespace + '-trigger');
                self.$bg_image = self.$bg_trigger.find('.' + self.namespace + '-image-info');
                self.$bg_remove = self.$wrap.find('.' + self.namespace + '-remove');
                self.$bg_mask = self.$wrap.find('.' + self.namespace + '-mask');
                self.$bg_close = self.$extend.find('.' + self.namespace + '-close');

                self.$image = self.$extend.find('.' + self.namespace + '-image');
                self.$image_wrap = self.$extend.find('.' + self.namespace + '-image-wrap');
            },

            _trigger: function(eventType) {
                // event
                self.$element.trigger(pluginName + '::' + eventType, self);

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
                self.repeatValue = self.options.repeat.values;
                self.positionValue = self.options.position.values;
                self.sizeValue = self.options.size.values;
                self.attachmentValue = self.options.attachment.values;

                if (value) {
                    self.value = self.options.parse(value);
                    self.image = self.value.image;
                } else {
                    return false;
                }

                if (!self.image) {
                    self.image = self.options.image;
                }
            },
            _setState: function(image) {
                if (!image || image === self.options.image) {
                    self.$bg_trigger.removeClass(self.classes.hasImage);
                } else {
                    self.$bg_trigger.addClass(self.classes.hasImage);
                }
            },
            _returnInfo: function(image) {
                var img_name;
                if (!image || image === self.options.image) {
                    $(self.$bg_image)[0].lastChild.nodeValue = "Add Image";
                } else {
                    img_name = image.match(/([\S]+[\/])([\S]+\w+$)/i)[2];
                    $(self.$bg_image)[0].lastChild.nodeValue = img_name;
                }
            },
            _process: function() {
                if (self.value === null) {
                    self.value = {};
                }
                self.value.repeat = self.repeat;
                self.value.position = self.position;
                self.value.attachment = self.attachment;
                self.value.image = self.image;
                self.value.size = self.size;

                self.$element.val(self.options.process(self.value));

                self.$image.css({
                    "background-image": 'url("' + self.image + '")',
                    "background-repeat": self.repeat,
                    "background-attachment": self.attachment,
                    "background-position": self.position,
                    "background-size": self.size
                });
            },

            doRepeat: {
                init: function() {
                    if (!self.value) {
                        self.repeat = self.options.repeat.default_value;
                    } else {
                        self.repeat = self.value.repeat;
                    }

                    var tpl_content = self.options.repeat.tpl().replace(/namespace/g, self.namespace);
                    self.$tpl_repeat = $(tpl_content);
                    self.$image_wrap.after(self.$tpl_repeat);

                    self.$repeat = self.$extend.find('.' + self.namespace + '-repeat');
                    self.$repeatItem = self.$repeat.find('li');
                    self.doRepeat.setup(self.repeat);

                },

                setup: function(newValue) {
                    self.$repeatItem.removeClass(self.classes.active);
                    $.each(self.repeatValue, function(key, value) {
                        self.$repeatItem.eq(key).data('repeat', value);
                        if (!newValue) {
                            return false;
                        } else if (newValue === value) {
                            self.$repeatItem.eq(key).addClass(self.classes.active);
                        }
                    });
                },

                bindEvent: function() {
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
                }
            },

            doPosition: {
                init: function() {
                    if (!self.value) {
                        self.position = self.options.position.default_value;
                    } else {
                        self.position = self.value.position;
                    }

                    var tpl_content = self.options.position.tpl().replace(/namespace/g, self.namespace);
                    self.$tpl_position = $(tpl_content);
                    self.$image_wrap.after(self.$tpl_position);

                    self.$position = self.$extend.find('.' + self.namespace + '-position');
                    self.$positionItem = self.$position.find('li');
                    self.doPosition.setup(self.position);
                },

                setup: function(newValue) {
                    self.$positionItem.removeClass(self.classes.active);
                    $.each(self.positionValue, function(key, value) {
                        self.$positionItem.eq(key).data('position', value);
                        if (!newValue) {
                            return false;
                        } else if (newValue === value) {
                            self.$positionItem.eq(key).addClass(self.classes.active);
                        }
                    });
                },

                bindEvent: function() {
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
                }
            },

            doSize: {
                init: function() {
                    if (!self.value) {
                        self.size = self.options.size.default_value;
                    } else {
                        self.size = self.value.size;
                    }

                    var tpl_content = self.options.size.tpl().replace(/namespace/g, self.namespace);
                    self.$tpl_size = $(tpl_content);
                    self.$image_wrap.after(self.$tpl_size);

                    self.$size = self.$extend.find('.' + self.namespace + '-size');
                    self.$sizeItem = self.$size.find('li');
                    self.doSize.setup(self.size);
                },

                setup: function(newValue) {
                    self.$sizeItem.removeClass(self.classes.active);
                    $.each(self.sizeValue, function(key, value) {
                        self.$sizeItem.eq(key).data('size', value);
                        if (!newValue) {
                            return false;
                        } else if (newValue === value) {
                            self.$sizeItem.eq(key).addClass(self.classes.active);
                        }
                    });
                },

                bindEvent: function() {
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
                }
            },

            doAttachment: {
                init: function() {
                    if (!self.value) {
                        self.attachment = self.options.attachment.default_value;
                    } else {
                        self.attachment = self.value.attachment;
                    }

                    var tpl_content = self.options.attachment.tpl().replace(/otherNamespace/g, self.options.attachment.namespace).replace(/namespace/g, self.namespace);
                    self.$tpl_attachment = $(tpl_content);
                    self.$image_wrap.after(self.$tpl_attachment);

                    self.$attachment = self.$extend.find('.' + self.namespace + '-attachment');
                    self.$attachmentItem = self.$attachment.find('li');
                    self.$dropdown = self.$extend.find('.' + self.options.attachment.namespace);
                    self.doAttachment.setup(self.attachment);
                },

                setup: function(newValue) {
                    self.select = 2;
                    for (var i = 0; i < self.attachmentValue.length; i++) {
                        if (self.attachmentValue[i] === newValue) {
                            self.select = i;
                        }
                    }
                },

                bindEvent: function() {
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
                }
            }
        });

        this._trigger('init');
        this.init();
        // console.log(this,"thisxxxxthis",self);
    };

    Plugin.prototype = {
        constructor: Plugin,
        components: {},
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

            if (update !== false) {
                self.value = value;
                self.image = value.image;
                self.repeat = value.repeat;
                self.size = value.size;
                self.position = value.position;
                self.attachment = value.attachment;

                self.doRepeat.setup(value.repeat);
                self.doSize.setup(value.size);
                self.doPosition.setup(value.position);
                self.doAttachment.setup(value.attachment);

                self._process();

                self.options.onChange.call(self, value);
            }
        },

        clear: function(update) {
            var self = this;
            self.value = null;

            // this._setState('empty');
            if (update !== false) {
                self.image = "";
                self.repeat = "";
                self.position = "";
                self.attachment = "";
                self.size = "";
                self._setState(self.image);
                self._returnInfo(self.image);
                self.doRepeat.setup(self.repeat);
                self.doSize.setup(self.size);
                self.doPosition.setup(self.position);
                self.doAttachment.setup(self.attachment);
                self._process();
                self.options.onChange.call(self, self.value);

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
            this.doRepeat.setup(repeat);
            this._process();
        },
        setSize: function(size) {
            this.size = size;
            this.doSize.setup(size);
            this._process();
        },
        setPosition: function(position) {
            this.position = position;
            this.doPosition.setup(position);
            this._process();
        },
        setAttachment: function(attachment) {
            this.attachment = attachment;
            this.doAttachment.setup(attachment);
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
