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
