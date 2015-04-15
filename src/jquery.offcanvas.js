/*
 * offcanvas
 * Author: Lars Graubner <mail@larsgraubner.de>
 */
;(function($) {
    "use strict";

    var settings, $el, $cont, $outerWrapper, $innerWrapper, $trigger, $win, open,
        $head = $("head");

    var _getSupportedTransform = function() {
        var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
        var div = document.createElement('div');
        for(var i = 0; i < prefixes.length; i++) {
            if(div && div.style[prefixes[i]] !== undefined) {
                return prefixes[i];
            }
        }
        return false;
    };

    var _getSupportedTransitionEnd = function() {
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
            'transition':'transitionend',
            'OTransition':'oTransitionEnd',
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        };

        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }

        return false;
    };

    var _animate = function(position, callback) {
        console.log("animate");
        var cssTransform = _getSupportedTransform(),
            cssTransitionEnd = _getSupportedTransitionEnd();

        if (cssTransform) {
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

    var _setHeights = function() {
        var height = $(document).height();
        $el.css("height", height);
    };

    var _clearHeights = function() {
        $el.css("height", "");
    };

    var offcanvas = {
        init: function(options) {
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

            var position = (settings.direction == "left") ? "-" + settings.coverage : "100%";

            var style = '<style id="offcanvas-style">' +
                settings.container + " ." + settings.classes.outer + " { left: 0; overflow-x: hidden; position: absolute; top: 0; width: 100%; } " +
                settings.container + " ." + settings.classes.inner + " { position: relative; } " +
                settings.container + " " + settings.element + " { display: block; height: 0; left: " + position + "; margin: 0; overflow: hidden; position: absolute; top: 0; width: " + settings.coverage + " } " +
                "</style>";

            $head.append(style);

            $trigger = $(settings.trigger);
            $trigger.on("click.offcanvas", offcanvas.toggle);
        },

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
                $el.on("click", function(e) {
                    e.stopPropagation();
                });
                $el.trigger("shown.offcanvas");
            });
        },

        hide: function() {
            console.log('[offcanvas] --hide--');
            $el.trigger("hide.offcanvas");

            $cont.removeClass(settings.classes.open);
            open = false;

            _animate(0, function() {
                _clearHeights();
                $win.off("resize.oncanvas", _setHeights);
                $el.trigger("hiden.offcanvas");
            });
        },

        toggle: function() {
            console.log('[offcanvas] --toggle--');

            if (open) {
                offcanvas.hide();
            } else {
                offcanvas.show();
            }

        },

        destroy: function() {
            console.log("[offcanvas] --destroy--");
            $innerWrapper.unwrap();
            $innerWrapper.children().unwrap();

            $cont.removeClass(settings.classes.container);
            $trigger.off("click.offcanvas");

            $head.find("#offcanvas-style").remove();
        }
    };

    $.fn.offcanvas = function(arg) {
        if (offcanvas[arg]) {
            return offcanvas[arg].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof arg === 'object' || !arg) {
            return offcanvas.init.apply(this, arguments);
        } else {
            $.error('Method ' + arg + ' does not exist on jquery.offcanvas');
        }
    };

    $.fn.offcanvas.defaults = {
        coverage: "200px",
        direction: "left",
        element: "#navigation",
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
