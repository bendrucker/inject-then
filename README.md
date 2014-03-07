inject-then [![Build Status](https://travis-ci.org/valet-io/inject-then.png?branch=master)](https://travis-ci.org/valet-io/inject-then) [![NPM version](https://badge.fury.io/js/inject-then.png)](http://badge.fury.io/js/inject-then)
==========

Promise wrapper for [Hapi](https://github.com/spumko/hapi)'s server.inject. When [registering](https://github.com/spumko/hapi/blob/master/docs/Reference.md#packregisterplugin-options-callback) the plugin, you must pass the `Promise` option with a promise constructor. It's tested with [Bluebird](https://github.com/petkaantonov/bluebird) but you could just as easily use [RSVP](https://github.com/tildeio/rsvp.js/) or any other promise library of your choosing.

```js
pack.require('injectThen', {
  Promise: require('bluebird')
});
```

The plugin register an `injectThen` method on all servers in the pack, which wraps `server.inject` in a promise and resolves with the `response`.

```js
server.injectThen('/posts').then(function (response) {
  // do things with the response
});
```