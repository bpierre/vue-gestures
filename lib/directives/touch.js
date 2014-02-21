/*
 * Touch directive
 *
 * Acts like a mousedown event.
 *
 */
var utils = require('../utils');
var addEvent = utils.addEvent;
var canTouch = utils.canTouch();

module.exports = function(Vue, options) {

  var vUtils = Vue.require('utils');

  options = utils.extend({
    prefix: ''
  }, options);

  var prefix = options.prefix? options.prefix + '-' : '';

  Vue.directive(prefix + 'touch', {
    isFn: true,

    bind: function() {
      this.eventName = canTouch? 'touchstart' : 'mousedown';
    },

    update: function(handler) {
      var self = this;

      if (typeof handler !== 'function') {
        return vUtils.warn('Directive "touch" expects a function value.');
      }

      this.reset();

      this.handler = function(e) {
        e.preventDefault();
        e.el = e.currentTarget;
        e.targetVM = self.vm;
        handler.call(self.vm, e);
      };

      this.el.addEventListener(this.eventName, this.handler);
    },
    reset: function() {
      if (this.handler) {
        this.el.removeEventListener(this.eventName, this.handler);
      }
    },
    unbind: function() {
      this.reset();
    }
  });
};
