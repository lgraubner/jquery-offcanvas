/**
 * An easy to use plugin for an offcanvas container.
 *
 * @author Lars Graubner <mail@larsgraubner.de>
 * @version 3.4.7
 * @license MIT
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = function (root, jQuery) {
      if (jQuery === undefined) {
        if (typeof window !== 'undefined') {
          // eslint-disable-next-line
          jQuery = require('jquery');
        } else {
          // eslint-disable-next-line
          jQuery = require('jquery')(root);
        }
      }
      factory(jQuery);
      return jQuery;
    };
  } else if (typeof define === 'function' && define.amd) {
    define(['jquery '], factory);
  } else {
    factory(jQuery);
  }
}(this, function ($) {
  'use strict';

  var pluginName = 'offcanvas';

  /**
   * Helper function to delay function calls.
   * http://davidwalsh.name/javascript-debounce-function
   */
  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this;
      var args = arguments;
      var later = function () {
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
    var data = $(element).data();
    var p;
    var shortName;

    this.$el = $(element);

    /* eslint-disable */
    for (p in data) {
      if (data.hasOwnProperty(p) && /^offcanvas[A-Z]+/.test(p)) {
        shortName = p[pluginName.length].toLowerCase() + p.substr(pluginName.length + 1);
        data[shortName] = data[p];
      }
    }
    /* eslint-enable */

    this.settings = $.extend(true, {}, $.fn[pluginName].defaults, options, data);
    this.name = pluginName;
    this.$el.data(this.name + '.opts', this.settings);

    this.init();
  }

  /**
   * Extend prototype with functions.
   */
  $.extend(Plugin.prototype, {
    /**
     * Set height of the container.
     */
    setHeights: function () {
      var height = this.$outerWrapper.height();

      if (!this.$el.data(this.name + '.opts')) {
        return; // already initialized
      }

      this.$element.css('height', height);
      if (this.settings.overlay) {
        this.$overlay.css('height', height);
      }
    },

    /**
     * Function to show container.
     */
    show: function () {
      var anim = {};
      if (this.visible) {
        return; // already shown
      }

      this.$cont.addClass(this.settings.classes.open);
      this.visible = true;

      console.log('[%s] --show--', this.name);
      this.$el.trigger('show.' + this.name);
      this.$el.trigger('toggle.' + this.name, this.visible);

      this.setHeights();

      anim[this.settings.origin] = this.effects[this.settings.effect].to;
      this.effects[this.settings.effect].$el.velocity(anim, $.extend({
        complete: function () {
          this.$el.trigger('shown.' + this.name);
          if (this.settings.overlay) {
            this.$overlay.one('click.' + this.name, function () {
              this.hide();
            }.bind(this));
          }
        }.bind(this)
      }, this.animationOptions));

      if (this.settings.overlay) {
        this.$overlay.velocity({
          opacity: 1
        }, $.extend({
          display: 'block'
        }, this.animationOptions));
      }
    },

    /**
     * Function to hide container.
     */
    hide: function () {
      if (!this.visible) {
        return; // already hidden
      }

      this.$cont.removeClass(this.settings.classes.open);
      this.visible = false;

      console.log('[%s] --hide--', this.name);
      this.$el.trigger('hide.' + this.name);
      this.$el.trigger('toggle.' + this.name, this.visible);

      this.effects[this.settings.effect].$el.velocity('stop')
        .velocity('reverse', $.extend({
          complete: function () {
            this.$el.trigger('hidden.' + this.name);
          }.bind(this)
        }, this.animationOptions));

      if (this.settings.overlay) {
        this.$overlay.velocity('stop').velocity('reverse', $.extend({
          display: 'none'
        }, this.animationOptions));
      }
    },

    /**
     * Shorthand function to toggle container.
     */
    toggle: function () {
      return (this.visible ? this.hide : this.show).call(this);
    },

    /**
     * Destroy function to remove all changes and data.
     */
    destroy: function () {
      if (!this.$el.data(this.name + '.opts')) {
        return; // no instance found
      }

      console.log('[%s] --destroy--', this.name);
      this.$innerWrapper.unwrap();
      this.$innerWrapper.children().unwrap();

      this.$cont.removeClass(this.settings.classes.container)
        .removeClass(this.settings.classes.open);

      if (this.settings.overlay) {
        this.$overlay.off('click.' + this.name).remove();
      }

      this.$el.unwrap()
        .removeData(this.name + '.opts')
        .removeAttr('style');

      this.$win.off('resize.' + this.name);
    },

    init: function () {
      var styles = {};
      console.log('[%s] --init--', this.name);

      this.$win = $(window);
      this.$body = $('body');
      this.visible = false;

      this.$cont = $(this.settings.container);
      this.$cont.addClass(this.settings.classes.container)
        .children(':not(script)')
        .wrapAll($('<div/>')
        .addClass(this.settings.classes.outer));

      this.$outerWrapper = $('.' + this.settings.classes.outer)
        .wrapInner($('<div/>')
        .addClass(this.settings.classes.inner));
      this.$innerWrapper = $('.' + this.settings.classes.inner);

      if (this.settings.overlay) {
        this.$innerWrapper.append(
          $('<div/>')
            .addClass(this.settings.classes.overlay)
            .css('background-color', this.settings.overlayColor)
        );
        this.$overlay = $('.' + this.settings.classes.overlay);
      }

      this.$el.wrap($('<div/>')
        .addClass(this.settings.classes.element));

      this.$element = this.$el.parent();

      styles[this.settings.origin] = '-' + this.settings.coverage;
      styles.width = this.settings.coverage;
      this.$element.css(styles);

      this.effects = {
        push: {
          $el: this.$innerWrapper,
          from: 0,
          to: this.settings.coverage
        },
        'slide-in-over': {
          $el: this.$element,
          from: '-' + this.settings.coverage,
          to: 0
        }
      };

      this.animationOptions = {
        easing: this.settings.easing,
        duration: this.settings.duration
      };

      this.$win.on('resize.' + this.name, debounce(this.setHeights, 300).bind(this));
      this.setHeights();

      this.$el.trigger('init.' + this.name);
    }
  });

  /**
   * Extend jQuery object with the new plugin.
   */
  $.fn[pluginName] = function (options) {
    var args = arguments;
    var returns;

    if (options === undefined || typeof options === 'object') {
      return this.each(function () {
        if (!$.data(this, 'plugin_' + pluginName)) {
          $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
        }
      });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
      this.each(function () {
        var instance = $.data(this, 'plugin_' + pluginName);

        if (instance instanceof Plugin && typeof instance[options] === 'function') {
          returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
        }

        if (options === 'destroy') {
          $.data(this, 'plugin_' + pluginName, null);
        }
      });

      return returns !== undefined ? returns : this;
    }

    return false;
  };

  /**
   * Set plugin defaults.
   *
   * @type {Object}
   */
  $.fn[pluginName].defaults = {
    classes: {
      container: pluginName,
      element: pluginName + '-element',
      inner: pluginName + '-inner',
      open: pluginName + '-open',
      outer: pluginName + '-outer',
      overlay: pluginName + '-overlay'
    },
    container: 'body',
    coverage: '220px',
    origin: 'left',
    duration: 300,
    easing: 'ease-in-out',
    effect: 'push',
    overlay: false,
    overlayColor: 'rgba(0, 0, 0, 0.7)'
  };
}));
