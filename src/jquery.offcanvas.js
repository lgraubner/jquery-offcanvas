/**
 * An easy to use plugin for an offcanvas container.
 *
 * @author Lars Graubner <mail@larsgraubner.de>
 * @version 3.1.0
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
     * @param {Object} element  element to use
     * @param {Object} options  options to use
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
        this.$el.data(`${this._name}.opts`, this.settings);

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
            if (!this.$el.data(`${this._name}.opts`))
                return; // already initialized

            var height = this.$doc.height();
            this.$element.css("height", height);
            if (this.settings.overlay) {
                this.$overlay.css("height", height);
            }
        },

        /**
         * Function to show container.
         */
        show: function() {
            if (this._visible) {
                return; // already shown
            }

            console.log("[%s] --show--", this._name);
            this.$el.trigger(`show.${this._name}`);

            this.$cont.addClass(this.settings.classes.open);
            this._visible = true;

            this._setHeights();

            this.effects[this.settings.effect].$el.velocity("stop")
                .velocity({
                    [this.settings.origin]: [this.effects[this.settings.effect].to, this.effects[this.settings.effect].from]
                }, $.extend({
                    complete: () => {
                        this.$el.trigger(`shown.${this._name}`);
                        if (this.settings.overlay) {
                            this.$overlay.one(`click.${this._name}`, (e) => {
                                this.hide();
                            });
                        }
                    }
                }, this.animationOptions));

            if (this.settings.overlay) {
                this.$overlay.velocity("stop").velocity({
                    opacity: [1, 0]
                }, $.extend({
                    display: "block"
                }, this.animationOptions));
            }
        },

        /**
         * Function to hide container.
         */
        hide: function() {
            if (!this._visible) {
                return; // already hidden
            }

            console.log("[%s] --hide--", this._name);
            this.$el.trigger(`hide.${this._name}`);

            this.$cont.removeClass(this.settings.classes.open);
            this._visible = false;

            this.effects[this.settings.effect].$el.velocity("stop")
                .velocity({
                    [this.settings.origin]: [this.effects[this.settings.effect].from, this.effects[this.settings.effect].to]
                }, $.extend({
                    complete: () => {
                        this.$el.trigger(`hidden.${this._name}`);
                    }
                }, this.animationOptions));

            if (this.settings.overlay) {
                this.$overlay.velocity("stop").velocity({
                    opacity: [0, 1]
                }, $.extend({
                    display: "none"
                }, this.animationOptions));
            }
        },

        /**
         * Shorthand function to toggle container.
         */
        toggle: function() {
            return (this._visible ? this.hide : this.show).call(this);
        },

        /**
         * Destroy function to remove all changes and data.
         */
        destroy: function() {
            if (!this.$el.data(`${this._name}.opts`))
                return; // no instance found

            console.log("[%s] --destroy--", this._name);
            this.$innerWrapper.unwrap();
            this.$innerWrapper.children().unwrap();

            this.$cont.removeClass(this.settings.classes.container)
                .removeClass(this.settings.classes.open);

            if (this.settings.overlay) {
                this.$overlay.off(`click.${this._name}`).remove();
            }

            this.$el.unwrap()
                .removeData(`${this._name}.opts`)
                .removeAttr("style");

            this.$win.off(`resize.${this._name}`);
        },

        init: function() {
            console.log("[%s] --init--", this._name);

            this.$win = $(window);
            this.$doc = $(document);
            this._visible = false;

            this.$cont = $(this.settings.container);
            this.$cont.addClass(this.settings.classes.container)
                .children(":not(script)")
                .wrapAll($("<div/>")
                .addClass(this.settings.classes.outer));

            this.$outerWrapper = $(`.${this.settings.classes.outer}`)
                .wrapInner($("<div/>")
                .addClass(this.settings.classes.inner));
            this.$innerWrapper = $(`.${this.settings.classes.inner}`);

            if (this.settings.overlay) {
                this.$innerWrapper.append(
                    $("<div/>")
                        .addClass(this.settings.classes.overlay)
                        .css("background-color", this.settings.overlayColor)
                );
                this.$overlay = $(`.${this.settings.classes.overlay}`);
            }

            this.$el.wrap($("<div/>")
                .addClass(this.settings.classes.element));

            this.$element = this.$el.parent();

            this.$element.css({
                width: this.settings.coverage,
                [this.settings.origin]: `-${this.settings.coverage}`
            });

            this.effects = {
                push: {
                    $el: this.$innerWrapper,
                    from: 0,
                    to: this.settings.coverage
                },
                "slide-in-over": {
                    $el: this.$element,
                    from: `-${this.settings.coverage}`,
                    to: 0
                }
            };

            this.animationOptions = {
                easing: this.settings.easing,
                duration: this.settings.duration
            };

            this.$win.on(`resize.${this._name}`, () => debounce(this._setHeights, 300));
            this._setHeights();

            this.$el.trigger(`init.${this._name}`);
        }
    });

    /**
     * Extend jQuery object with the new plugin.
     */
    $.fn[pluginName] = function(options) {
        var args = arguments;

        if (options === undefined || typeof options === "object") {
            return this.each(function() {
                if (!$.data(this, `plugin_${pluginName}`)) {
                    $.data(this, `plugin_${pluginName}`, new Plugin(this, options));
                }
            });
        } else if (typeof options === "string" && options[0] !== "_" && options !== "init") {
            var returns;

            this.each(function() {
                var instance = $.data(this, `plugin_${pluginName}`);

                if (instance instanceof Plugin && typeof instance[options] === "function") {
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }

                if (options === "destroy") {
                    $.data(this, `plugin_${pluginName}`, null);
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
            element: `${pluginName}-element`,
            inner: `${pluginName}-inner`,
            open: `${pluginName}-open`,
            outer: `${pluginName}-outer`,
            overlay: `${pluginName}-overlay`
        },
        container: "body",
        coverage: "220px",
        origin: "left",
        duration: 300,
        easing: "ease-in-out",
        effect: "push",
        overlay: false,
        overlayColor: "rgba(0, 0, 0, 0.7)"
    };
})(window, document, jQuery);
