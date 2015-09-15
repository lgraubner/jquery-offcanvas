/**
 * An easy to use plugin for an offcanvas container.
 *
 * @author Lars Graubner <mail@larsgraubner.de>
 * @version 1.1.0
 * @license MIT
 */
;(function(window, document, $, undefined) {
    "use strict";

    var pluginName = "offcanvas";

    /**
     * Get supported Prefix
     *
     * @param  {object} prefixes object containing possible prefixes
     * @return {string}          supported prefix
     */
    var getPrefix = function(prefixes) {
        var p;
        var el = document.createElement('div');

        for(p in prefixes){
            if( el.style[p] !== undefined ){
                return prefixes[p];
            }
        }

        return false;
    };

    /**
     * Plugin constructor.
     *
     * @param {Object} element element to use
     * @param {Object} options options to use
     */
    function Plugin(element, options) {
        this.$el = $(element);
        var data = this.$el.data();

        for (var p in data) {
            if (data.hasOwnProperty(p) && /^offcanvas[A-Z]+/.test(p)) {
                var shortName = p[pluginName.length].toLowerCase() + p.substr(pluginName.length + 1);
                data[shortName] = data[p];
            }
        }

        this.settings = $.extend(true, {}, $.fn[pluginName].defaults, options, data);
        this._name = pluginName;
        this.$el.data(this._name + ".opts", this.settings);

        this.init();
    }

    /**
     * Extend prototype with functions.
     */
    $.extend(Plugin.prototype, {

        /**
         * Animate container with CSS3, using jQuery as fallback.
         *
         * @param  {number}   position  position to animate to
         * @param  {Function} callback  callback function
         */
        _animate: function(position, callback) {
            var cssTransform = getPrefix({
                    'transform': 'transform',
                    'WebkitTransform': '-webkit-transform',
                    'MozTransform': '-moz-transform',
                    'OTransform': '-o-transform',
                    'msTransform': '-ms-transform'
                });

            var cssTransitionEnd = getPrefix({
                    'transition': 'transitionend',
                    'OTransition': 'oTransitionEnd',
                    'MozTransition': 'transitionend',
                    'WebkitTransition': 'webkitTransitionEnd'
                });

            if (cssTransform && cssTransitionEnd) {
                this.$innerWrapper.one(cssTransitionEnd, callback);

                this.$innerWrapper.css({
                    transition: cssTransform + " " + this.settings.duration + "ms ease",
                    transform: "translateX(" + position + ")"
                });

            } else {
                this.$innerWrapper.animate({
                    left: position
                }, this.settings.duration, 'swing', callback);
            }
        },

        /**
         * Set height of the container.
         */
        _setHeights: function() {
            if (!this.$el.data(this._name + ".opts"))
                return; // already initialized

            var height = this.$doc.height();
            this.$el.css("height", height);
        },

        /**
         * Remove height styles.
         */
        _clearHeights: function() {
            this.$el.css("height", "");
        },

        /**
         * Function to show container.
         */
        show: function() {
            console.log("[" + this._name + "] --show--");
            this.$el.trigger("show." + this._name);

            this._setHeights();
            this.$win.on("resize." + this._name, $.proxy(this._setHeights, this));

            this.$cont.addClass(this.settings.classes.open);
            this._open = true;

            var position = (this.settings.direction == "left") ? this.settings.coverage : "-" + this.settings.coverage;
            var self = this;
            this._animate(position, function() {
                self.$cont.one("click." + self._name + " touchstart." + self._name, function(e) {
                    e.stopPropagation();
                    e.preventDefault();

                    self.hide();
                });

                self.$el.trigger("shown." + self._name);
            });
        },

        /**
         * Function to hide container.
         */
        hide: function() {
            console.log("[" + this._name + "] --hide--");
            this.$el.trigger("hide." + this._name);

            this.$cont.removeClass(this.settings.classes.open);
            this._open = false;

            var self = this;
            this._animate(0, function() {
                self._clearHeights();
                self.$win.off("resize.oncanvas", self._setHeights);
                self.$el.trigger("hidden." + self._name);
            });
        },

        /**
         * Shorthand function to toggle container.
         *
         * @param  {Event} e    event object
         */
        toggle: function(e) {
            e.stopPropagation();

            if (this._open) {
                this.hide();
            } else {
                this.show();
            }

        },

        /**
         * Destroy function to remove all changes and data.
         */
        destroy: function() {
            if (!this.$el.data(this._name + ".opts"))
                return; // already initialized

            console.log("[" + this._name + "] --destroy--");
            this.$innerWrapper.unwrap();
            this.$innerWrapper.children().unwrap();

            this.$cont.off("click." + this._name + " touchstart." + this._name).removeClass(this.settings.classes.container).removeClass(this.settings.classes.open);
            this.$trigger.off("click." + this._name);

            this.$head.find("#" + this._name + "-style").remove();

            this.$el.off("click." + this._name + " touchstart." + this._name).removeData(this._name + "").removeAttr("style");
            this.$el.removeData(this._name + ".opts");
            this._clearHeights();
        },

        init: function() {
            console.log("[" + this._name + "] --init--");

            this.$win = $(window);
            this.$doc = $(document);
            this.$head = $("head");
            this._open = false;

            this.$cont = $(this.settings.container);
            this.$cont.children(":not(script)").wrapAll('<div class="' + this.settings.classes.outer + '"/>');

            this.$outerWrapper = $("." + this.settings.classes.outer);
            this.$outerWrapper.wrapInner('<div class="' + this.settings.classes.inner + '"/>');
            this.$innerWrapper = $("." + this.settings.classes.inner);

            this.$cont.addClass(this.settings.classes.container);

            var selector = this.$el.prop("id") ? "#" + this.$el.prop("id") :  "." + this.$el.prop("className").replace(/\s/g, ".");

            var style = '<style id="' + this._name + '-style">' +
                this.settings.container + " ." + this.settings.classes.outer + " { left: 0; overflow-x: hidden; position: absolute; top: 0; width: 100%; } " +
                this.settings.container + " ." + this.settings.classes.inner + " { position: relative; } " +
                this.settings.container + " " + selector + " { display: block; height: 300px; " + this.settings.direction + ": -" + this.settings.coverage + "; margin: 0; overflow: hidden; position: absolute; top: 0; width: " + this.settings.coverage + " } " +
                "</style>";

            this.$head.append(style);

            this.$el.show().on("click.offvanvas touchstart." + this._name, function(e) {
                e.stopPropagation();
            });

            this.$trigger = $(this.settings.trigger);
            this.$trigger.on("click." + this._name, $.proxy(this.toggle, this));

            this.$el.trigger("init." + this._name);
        }
    });

    /**
     * Extend jQuery object with the new plugin.
     */
    $.fn[pluginName] = function(options) {
        var args = arguments;

        if (options === undefined || typeof options === "object") {
            return this.each(function() {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(this, "plugin_" + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === "string" && options[0] !== "_" && options !== "init") {
            var returns;

            this.each(function() {
                var instance = $.data(this, "plugin_" + pluginName);

                if (instance instanceof Plugin && typeof instance[options] === "function") {
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }

                if (options === "destroy") {
                    $.data(this, 'plugin_' + pluginName, null);
                }
            });

            return returns !== undefined ? returns : this;
        }

    };

    /**
     * Set plugin defaults.
     *
     * @type {Object}
     */
    $.fn[pluginName].defaults = {
        coverage: "200px",
        direction: "left",
        trigger: ".js-toggle-offcanvas",
        container: "body",
        duration: 200,
        classes: {
            inner: pluginName + "-inner",
            outer: pluginName + "-outer",
            container: pluginName,
            open: pluginName + "-open"
        }
    };
})(window, document, jQuery);
