/**
 * An easy to use plugin for an offcanvas container.
 *
 * @author Lars Graubner <mail@larsgraubner.de>
 */
;(function($) {
    "use strict";

    var settings, $el, $cont, $outerWrapper, $innerWrapper, $trigger, $win, open,
        initialized = false,
        $head = $("head");

    /**
     * Get supported Prefix
     *
     * @param  {object} prefixes object containing possible prefixes
     * @return {string}          supported prefix
     */
    var _getPrefix = function(prefixes) {
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
     * Animate container with CSS3, using jQuery as fallback.
     *
     * @param  {number}   position  position to animate to
     * @param  {Function} callback  callback function
     */
    var _animate = function(position, callback) {
        var cssTransform = _getPrefix({
                'transform': 'transform',
                'WebkitTransform': '-webkit-transform',
                'MozTransform': '-moz-transform',
                'OTransform': '-o-transform',
                'msTransform': '-ms-transform'
            });

        var cssTransitionEnd = _getPrefix({
                'transition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'MozTransition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd'
            });

        if (cssTransform && cssTransitionEnd) {
            $innerWrapper.one(cssTransitionEnd, callback);

            $innerWrapper.css({
                transition: cssTransform + " " + settings.duration + "ms ease",
                transform: "translateX(" + position + ")"
            });

        } else {
            $innerWrapper.animate({
                left: position
            }, settings.duration, 'swing', callback);
        }
    };

    /**
     * Set height of the container.
     */
    var _setHeights = function() {
        if (!initialized) return;
        var height = $(document).height();
        $el.css("height", height);
    };

    /**
     * Remove height styles.
     */
    var _clearHeights = function() {
        $el.css("height", "");
    };

    /**
     * Wrapper Object
     * @type {Object}
     */
    var offcanvas = {
        /**
         * Initialize function for setting styles, options and variables.
         *
         * @param  {Object} options custom options to use
         */
        init: function(options) {
            if (initialized) return;
            console.log('[offcanvas] --init--');
            $el = $(this);

            $win = $(window);
            open = false;
            settings = $.extend($.fn.offcanvas.defaults, $el.data(), options);
            $el.data("offcanvas", settings);

            $cont = $(settings.container);
            $cont.children(":not(script)").wrapAll('<div class="' + settings.classes.outer + '"/>');

            $outerWrapper = $("." + settings.classes.outer);
            $outerWrapper.wrapInner('<div class="' + settings.classes.inner + '"/>');
            $innerWrapper = $("." + settings.classes.inner);

            $cont.addClass(settings.classes.container);

            var selector = $el.prop("id") ? "#" + $el.prop("id") :  "." + $el.prop("className").replace(/\s/g, ".");

            var style = '<style id="offcanvas-style">' +
                settings.container + " ." + settings.classes.outer + " { left: 0; overflow-x: hidden; position: absolute; top: 0; width: 100%; } " +
                settings.container + " ." + settings.classes.inner + " { position: relative; } " +
                settings.container + " " + selector + " { display: block; height: 300px; " + settings.direction + ": -" + settings.coverage + "; margin: 0; overflow: hidden; position: absolute; top: 0; width: " + settings.coverage + " } " +
                "</style>";

            $head.append(style);

            $el.show().on("click.offvanvas touchstart.offcanvas", function(e) {
                e.stopPropagation();
            });

            $trigger = $(settings.trigger);
            $trigger.on("click.offcanvas", offcanvas.toggle);

            initialized = true;
            $el.trigger("init.offcanvas");
        },

        /**
         * Function to show container.
         */
        show: function() {
            console.log('[offcanvas] --show--');
            $el.trigger("show.offcanvas");

            _setHeights();
            $win.on("resize.offcanvas", _setHeights);

            $cont.addClass(settings.classes.open);
            open = true;

            var position = (settings.direction == "left") ? settings.coverage : "-" + settings.coverage;
            _animate(position, function() {
                $cont.one("click.offcanvas touchstart.offcanvas", function(e) {
                    e.stopPropagation();
                    e.preventDefault();

                    offcanvas.hide();
                });

                $el.trigger("shown.offcanvas");
            });
        },

        /**
         * Function to hide container.
         */
        hide: function() {
            console.log('[offcanvas] --hide--');
            $el.trigger("hide.offcanvas");

            $cont.removeClass(settings.classes.open);
            open = false;

            _animate(0, function() {
                _clearHeights();
                $win.off("resize.oncanvas", _setHeights);
                $el.trigger("hidden.offcanvas");
            });
        },

        /**
         * Shorthand function to toggle container.
         *
         * @param  {Event} e    event object
         */
        toggle: function(e) {
            e.stopPropagation();

            if (open) {
                offcanvas.hide();
            } else {
                offcanvas.show();
            }

        },

        /**
         * Destroy function to remove all changes and data.
         */
        destroy: function() {
            if (!initialized) return;
            console.log("[offcanvas] --destroy--");
            $innerWrapper.unwrap();
            $innerWrapper.children().unwrap();

            $cont.off("click.offcanvas touchstart.offcanvas").removeClass(settings.classes.container).removeClass(settings.classes.open);
            $trigger.off("click.offcanvas");

            $head.find("#offcanvas-style").remove();

            $el.off("click.offcanvas touchstart.offcanvas").removeData("offcanvas").removeAttr("style");
            initialized = false;
            _clearHeights();
        }
    };

    /**
     * Extend jQuery with function.
     */
    $.fn.offcanvas = function(arg) {
        if (offcanvas[arg]) {
            return offcanvas[arg].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof arg === 'object' || !arg) {
            return offcanvas.init.apply(this, arguments);
        } else {
            $.error('Method ' + arg + ' does not exist on jquery.offcanvas');
        }
    };

    /**
     * Set defaults.
     */
    $.fn.offcanvas.defaults = {
        coverage: "200px",
        direction: "left",
        trigger: "#nav-trigger",
        container: "body",
        duration: 200,
        classes: {
            inner: "offcanvas-inner",
            outer: "offcanvas-outer",
            container: "offcanvas",
            open: "offcanvas-open"
        }
    };

})(jQuery);
