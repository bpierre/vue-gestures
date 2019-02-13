# vue-gestures

vue-gestures is a collection of [Vue.js](http://vuejs.org/guide/) directives for touch gestures.

It is a work in progress at the moment, any help welcome!

<p align="center"><img width="274" height="400" alt="vue-gesture illustration" src="http://scri.ch/may-2x.png"></p>


## Installation

### Browserify (npm)

```
$ npm install vue-gestures
```

### component

component will follow soon.

### Standalone / RequireJS / AMD

Download [dist/vue-gestures.js](dist/vue-gestures.js) and include it in your HTML page.

vue-gestures is available under the name *vueGestures* for AMD module loaders, or is directly set on `window.vueGestures`.

## Example

vue-gestures can be loaded into your ViewModel with [`Vue.plugin`](http://vuejs.org/guide/plugin.html).

```js
var vueGestures = require('vue-gestures'); // with Browserify / CommonJS
Vue.use(vueGestures);
```

```html
<a v-tap="action()">Click me</a>
```

## Directives

### v-tap

Acts like a `click` event, except it removes the [300ms delay](http://blogs.telerik.com/appbuilder/posts/13-11-21/what-exactly-is.....-the-300ms-click-delay) on touch devices.

### v-touch

Acts like a `mousedown` event, triggers the function immediately.

Be careful: every default browser behavior is prevented, including the scroll.

## Configuration

### global parameters

Some parameters are applied to all the directives. You can also add these parameters on a directive level, e.g.

```js
Vue.use(vueGestures, {
  touch: { prefix: 'gestures' }
});
```

#### `prefix`

Adds a prefix to the directives loaded by the plugin.

```js
Vue.use(vueGestures, { prefix: 'gestures' });
```

```html
<a v-gestures-tap="action()">Click me</a>
<a v-gestures-touch="action()">Click me</a>
```

### v-tap

#### `moveTolerance` (default: 12)

After the touchstart event, if the touch moves farther than this distance (in pixels), the action will be canceled (the user didn’t want to click).

## Load the directives separately

If you don’t want to load all the directives, it is possible to load them separately:

```js
var gestures = require('vue-gestures');
Vue.use(gestures.tap, {
  // parameters
});
Vue.use(gestures.touch, {
  // parameters
});
```

## License

[MIT](http://pierre.mit-license.org/)

## Special thanks

Illustration made by [Raphaël Bastide](http://raphaelbastide.com/) with [scri.ch](http://scri.ch/).
