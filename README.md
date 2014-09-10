inject-then [![Build Status](https://travis-ci.org/bendrucker/inject-then.svg?branch=master)](https://travis-ci.org/bendrucker/inject-then) [![NPM version](https://badge.fury.io/js/inject-then.svg)](http://badge.fury.io/js/inject-then)
==========

Promise wrapper for [Hapi](https://github.com/spumko/hapi)'s server.inject. When [registering](https://github.com/spumko/hapi/blob/master/docs/Reference.md#packregisterplugin-options-callback) the plugin, you can use the `Promise` option to specify promise constructor. [Bluebird](https://github.com/petkaantonov/bluebird) is used if no constructor is specified.

```js
pack.register(require('injectThen'));
```

```js
pack.register(require('injectThen'), {
  Promise: require('rsvp')
});
```

The plugin register an `injectThen` method on all servers in the pack, which wraps `server.inject` in a promise and resolves with the `response`.

```js
server.injectThen('/posts').then(function (response) {
  // do things with the response
});
```
