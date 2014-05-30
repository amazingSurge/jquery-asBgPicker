/*! jquery asDropdown - v0.1.1 - 2014-03-28
* https://github.com/amazingSurge/jquery-asDropdown
* Copyright (c) 2014 amazingSurge; Licensed MIT */
/* global jQuery */

(function($) {
    var AsDropdown = $.dropdown = function(element, options) {
        this.element = element;
        this.$element = $(element);
        this.$parent = this.$element.parent();

        // options
        var meta_data = [];
        $.each(this.$element.data(), function(k, v) {
            var re = new RegExp("^asDropdown", "i");
            if (re.test(k)) {
                meta_data[k.toLowerCase().replace(re, '')] = v;
            }
        });
        this.options = $.extend(true, {}, AsDropdown.defaults, options, meta_data);
        this.namespace = this.options.namespace;
        this.classes = {
            skin: this.namespace + '_' + this.options.skin,
            show: this.namespace + '_show',
            trigger: this.namespace + '-trigger',
            mask: this.namespace + '-mask',
            wrapper: this.namespace + '-wrapper',
            panel: this.namespace + '-panel',
            disabled: this.namespace + '_disabled'
        };

        // skin
        if (this.options.skin !== null) {
            this.$element.addClass(this.classes.skin);
        }

        this.$children = this.$element.children();

        // content
        this.$panel = this._parse(this.options.panel);

        //state
        this.isShow = false;
        this.disabled = false;
        this.initialized = false;
        //init
        this._trigger('init');
        this.init();
    };

    AsDropdown.prototype = {
        constructor: AsDropdown,
        init: function() {
            var self = this;
            this.$parent.addClass(this.classes.wrapper);
            this.$element.addClass(this.namespace).addClass(this.classes.trigger);
            this.$panel.addClass(this.classes.panel);

            this.$element.on('click.asDropdown', function() {
                self.toggle.call(self);
                return false;
            });

            this.$panel.on('click.asDropdown', 'li', function() {
                self.set($(this).data(self.options.data));
                self.hide();
                return false;
            });

            if (this.options.select !== null) {
                this.set(this.options.select);
            }

            this._trigger('ready');
            this.initialized = true;
        },
        _trigger: function(eventType) {
            // event
            this.$element.trigger('asDropdown::' + eventType, this);

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

        show: function() {
            var self = this;
            if (this.disabled) {
                return;
            }
            if (this.options.clickoutHide) {
                this._generateMask();
            }

            $(window).on('resize.asDropdown', function() {
                self._position();
                return false;
            });
            this.isShow = true;
            this.$element.addClass(this.classes.show);
            this.$panel.addClass(this.classes.show);

            this._position();
            this._trigger('show');
        },
        hide: function() {
            this.isShow = false;
            if (this.options.clickoutHide) {
                this._clearMask();
            }

            this.$element.removeClass(this.classes.show);
            this.$panel.removeClass(this.classes.show);
            $(document).off('mousedown.asDropdown');

            this._trigger('hide');
        },
        set: function(value) {
            if (this.options.imitateSelect) {
                var $item = null;
                var self = this;

                self.$panel.children().each(function() {
                    if ($(this).data(self.options.data) === value) {
                        $item = $(this);
                    }
                });
                if (!$item) {
                    return;
                }
                this.$element.text($item.text());
                if (this.$children.length) {
                    this.$children.appendTo(this.$element);
                }
            }
            if (this.initialized) {
                this._trigger('change', value);
            }
        },
        _generateMask: function() {
            var self = this;
            this.$mask = $('<div></div>').addClass(this.classes.mask).appendTo(this.$parent);
            this.$mask.on('click.asDropdown', function() {
                self.hide();
                return false;
            });
        },
        _clearMask: function() {
            if (this.$mask) {
                this.$mask.off('.asDropdown');
                this.$mask.remove();
                this.$mask = null;
            }
        },
        toggle: function() {
            if (this.isShow) {
                this.hide();
            } else {
                this.show();
            }
        },
        _position: function() {
            var offset = this.$element.offset(),
                height = this.$element.outerHeight(),
                width = this.$element.outerWidth(),
                panelWidth = this.$panel.outerWidth(true),
                panelHeight = this.$panel.outerHeight(true),
                top, left;

            if (panelHeight + height + offset.top > $(window).height() + $(window).scrollTop()) {
                top = -panelHeight;
            } else {
                top = height;
            }
            if (panelWidth + offset.left > $(window).width() + $(window).scrollLeft()) {
                left = width - panelWidth;
            } else {
                left = 0;
            }
            this.$panel.css({
                position: 'absolute',
                top: top,
                left: left
            });
        },
        _parse: function(string) {
            if (string.indexOf('+') >= 0) {
                return this.$element.next();
            } else {
                return $(this.options.panel);
            }
        },

        // common  method
        enable: function() {
            this.disabled = false;
            this.$wrapper.removeClass(this.classes.disabled);
        },
        disable: function() {
            this.disabled = true;
            this.$wrapper.addClass(this.classes.disabled);
        },
        destory: function() {
            this.hide();
            this.$element.off('.asDropdown');
            this.$element.remove();
            $(window).off('.asDropdown');
        }
    };

    AsDropdown.defaults = {
        namespace: 'asDropdown',
        skin: null,
        panel: '+', //jquery selector to find content in the page, or '+' means adjacent siblings
        clickoutHide: true, //When clicking outside of the dropdown, trigger hide event
        imitateSelect: false, //let select value show in trigger bar
        select: null, //set initial select value, when imitateSelect is set to true
        data: 'value',

        //callback comes with corresponding event
        onInit: null,
        onShow: null,
        onHide: null,
        onChange: null
    };

    $.fn.asDropdown = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;

            return this.each(function() {
                var api = $.data(this, 'asDropdown');
                if (typeof api[method] === 'function') {
                    api[method].apply(api, method_arguments);
                }
            });
        } else {
            return this.each(function() {
                if (!$.data(this, 'asDropdown')) {
                    $.data(this, 'asDropdown', new AsDropdown(this, options));
                }
            });
        }
    };
}(jQuery));