var directives = {
  tap: require('./lib/directives/tap'),
  touch: require('./lib/directives/touch')
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
