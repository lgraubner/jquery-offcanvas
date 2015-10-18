/**
 * An easy to use plugin for an offcanvas container.
 *
 * @author Lars Graubner <mail@larsgraubner.de>
 * @version 2.2.4
 * @license MIT
 */
;(function(window, document, $, undefined) {
    "use strict";

    var pluginName = "offcanvas";

    /**
     * Helper function to delay function calls.
     * http://davidwalsh.name/javascript-debounce-function
     */
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

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
         * Set height of the container.
         */
        _setHeights: function() {
            if (!this.$el.data(this._name + ".opts"))
                return; // already initialized

            var height = this.$doc.height();
            this.$el.parent().css("height", height);
            this.$overlay.css("height", height);
        },

        /**
         * Function to show container.
         */
        show: function() {
            console.log("[" + this._name + "] --show--");
            this.$el.trigger("show." + this._name);

            this.$cont.addClass(this.settings.classes.open);
            this._open = true;

            this._setHeights();

            var position = (this.settings.direction == "left") ? this.settings.coverage : "-" + this.settings.coverage;
            var self = this;

            this.$innerWrapper.velocity("stop").velocity({
                left: position
            }, {
                easing: this.settings.easing,
                duration: this.settings.duration,
                complete: function() {
                    self.$el.trigger("shown." + self._name);
                    self.$overlay.one("click." + self._name, function(e) {
                        self.hide();
                    });
                }
            });

            this.$overlay.velocity({
                opacity: 1
            }, {
                easing: this.settings.easing,
                duration: this.settings.duration,
                display: "block"
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
            this.$innerWrapper.velocity("stop").velocity({
                left: 0
            }, {
                easing: this.settings.easing,
                duration: this.settings.duration,
                complete: function() {
                    self.$el.trigger("hidden." + self._name);
                }
            });

            this.$overlay.velocity({
                opacity: 0
            }, {
                easing: this.settings.easing,
                duration: this.settings.duration,
                display: "none"
            });
        },

        /**
         * Shorthand function to toggle container.
         *
         * @param  {Event} e    event object
         */
        toggle: function() {
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

            this.$cont.removeClass(this.settings.classes.container).removeClass(this.settings.classes.open);

            this.$overlay.off("click." + this._name).remove();

            this.$el.unwrap().removeData(this._name + ".opts").removeAttr("style");

            this.$win.off("resize." + this._name);
        },

        init: function() {
            console.log("[" + this._name + "] --init--");

            this.$win = $(window);
            this.$doc = $(document);
            this._open = false;

            this.$cont = $(this.settings.container)
                .addClass(this.settings.classes.container)
                .children(":not(script)").wrapAll($("<div/>").addClass(this.settings.classes.outer));

            this.$outerWrapper = $("." + this.settings.classes.outer)
                .wrapInner($("<div/>").addClass(this.settings.classes.inner));
            this.$innerWrapper = $("." + this.settings.classes.inner);

            this.$innerWrapper.append($("<div/>").addClass(this.settings.classes.overlay));
            this.$overlay = $("." + this.settings.classes.overlay);

            this.$el.wrap($("<div/>").addClass(this.settings.classes.element));

            var css = {
                width: this.settings.coverage
            };
            css[this.settings.direction] = "-" + this.settings.coverage;
            console.log(css);
            this.$el.parent().css(css)
                .show();

            this.$win.on("resize." + this._name, $.proxy(debounce(this._setHeights, 300), this));
            this._setHeights();

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
        classes: {
            container: pluginName,
            element: pluginName + "-element",
            inner: pluginName + "-inner",
            open: pluginName + "-open",
            outer: pluginName + "-outer",
            overlay: pluginName + "-overlay"
        },
        container: "body",
        coverage: "220px",
        direction: "left",
        duration: 350,
        easing: "ease-in-out"
    };
})(window, document, jQuery);
