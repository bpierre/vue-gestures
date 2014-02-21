!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.vueGestures=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var directives = {
  tap: _dereq_('./lib/directives/tap'),
  touch: _dereq_('./lib/directives/touch')
};

// Load all the plugins
function gestures(Vue, options) {
  if (!options) options = {};
  for (var i in directives) {
    if (!options[i]) options[i] = {};
    if (options.prefix && !options[i].prefix) options[i].prefix = options.prefix;
    Vue.use(directives[i], options[i]);
  }
}

for (var i in directives) gestures[i] = directives[i];

module.exports = gestures;

},{"./lib/directives/tap":2,"./lib/directives/touch":3}],2:[function(_dereq_,module,exports){
/*
 * Tap directive
 *
 * Acts like a click event, except it removes the 300ms delay on touch
 * browsers (see http://blogs.telerik.com/appbuilder/posts/13-11-21/what-exactly-is.....-the-300ms-click-delay ).
 *
 */
var utils = _dereq_('../utils');
var addEvent = utils.addEvent;
var canTouch = utils.canTouch();


module.exports = function(Vue, options) {

  var vUtils = Vue.require('utils');

  options = utils.extend({
    prefix: '',

    // TODO: implement tapDuration
    tapDuration: 750, // Shorter than 750ms is a tap, longer is a taphold or drag.
    moveTolerance: 12 // 12px seems to work in most mobile browsers.
  }, options);

  var prefix = options.prefix? options.prefix + '-' : '';

  Vue.directive(prefix + 'tap', {
    isFn: true,

    update: function(handler) {
      var self = this;

      if (typeof handler !== 'function') {
        return vUtils.warn('Directive "tap" expects a function value.');
      }

      this.reset();

      this.handler = function(e) {
        e.el = e.currentTarget;
        e.targetVM = self.vm;
        handler.call(self.vm, e);
      };

      if (typeof window.ontouchstart === 'undefined') {
        this.stopClick = addEvent(this.el, 'click', this.handler);
        return;
      }

      // Prevents an iOS bug
      // …but adds a "shadow click" (focus effect): disabled for now.
      // this.stopClick = addEvent(this.el, 'click', function(e) {
      //   e.preventDefault();
      // });

      var lastTouchStart = null;

      this.stopTouchstart = addEvent(this.el, 'touchstart', function(e) {

        // iOS triggers another touchstart with the same identifier on alert()
        var identifier = e.touches[0].identifier;
        if (lastTouchStart === identifier) return ;
        lastTouchStart = identifier;

        self.initX = self.endX = e.touches[0].clientX;
        self.initY = self.endY = e.touches[0].clientY;
        self.stopTouchend = addEvent(self.el, 'touchend',
                                     self.onTouchend.bind(self));
        self.stopTouchmove = addEvent(self.el, 'touchmove',
                                      self.onTouchmove.bind(self));
      });
      this.stopTouchcancel = addEvent(this.el, 'touchcancel', function(e) {
        this.stopTouch();
      });
    },

    unbind: function() {
      this.reset();
    },

    reset: function () {
      if (this.stopClick) this.stopClick();
      if (this.stopTouchstart) this.stopTouchstart();
      if (this.stopTouchend) this.stopTouchend();
      if (this.stopTouchmove) this.stopTouchmove();
      this.handler = null;
    },

    isOut: function() {
      return Math.abs(this.endX - this.initX) > options.moveTolerance ||
             Math.abs(this.endY - this.initY) > options.moveTolerance;
    },

    onTouchmove: function(e) {
      this.endX = e.touches[0].clientX;
      this.endY = e.touches[0].clientY;
      if (this.isOut()) this.stopTouch();
    },

    onTouchend: function(e) {
      this.stopTouch();
      if (this.isOut()) return;
      e.stopPropagation();
      this.handler(e);
    },

    stopTouch: function() {
      if (this.stopTouchend) this.stopTouchend();
      if (this.stopTouchmove) this.stopTouchmove();
    }
  });
};

},{"../utils":4}],3:[function(_dereq_,module,exports){
/*
 * Touch directive
 *
 * Acts like a mousedown event.
 *
 */
var utils = _dereq_('../utils');
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

},{"../utils":4}],4:[function(_dereq_,module,exports){
function addEvent(el, name, fn) {
  el.addEventListener(name, fn, false);
  return function() {
    el.removeEventListener(name, fn, false);
  };
}

// Temporary, will be fixed in the next version of Vue
function extend(obj, ext, protective) {
  for (var key in ext) {
    if (protective && obj[key]) continue;
      obj[key] = ext[key];
  }
  return obj;
}

module.exports = {
  extend: extend,
  addEvent: addEvent,
  canTouch: function() {
    return 'ontouchstart' in document.documentElement;
  }
};

},{}]},{},[1])
(1)
});