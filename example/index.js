var Vue = require('vue');
var gestures = require('../');

Vue.use(gestures);

var HISTORY_COUNT = 30;

var app = new Vue({
  el: '#app',
  data: {
    messages: []
  },
  methods: {
    log: function(msg) {
      this.messages.push(msg);
      if (this.messages.length > HISTORY_COUNT) {
        this.messages = this.messages.slice(-HISTORY_COUNT);
      }
    },
  },
  computed: {
    logText: function() {
      var messages = this.messages.slice(0);
      messages.reverse();
      return messages.join('\n');
    }
  }
});
