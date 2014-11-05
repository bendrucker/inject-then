inject-then [![Build Status](https://travis-ci.org/bendrucker/inject-then.svg?branch=master)](https://travis-ci.org/bendrucker/inject-then) [![NPM version](https://badge.fury.io/js/inject-then.svg)](http://badge.fury.io/js/inject-then)
==========

Promise wrapper for [Hapi](https://github.com/spumko/hapi)'s server.inject.

## Setup

```bash
$ npm install inject-then
```

```js
pack.register(require('inject-then'), function (err) {
  if (err) throw err;
});
```

## API

#### `server.injectThen(options, [callback])` -> `promise(response)`

```js
server.injectThen('/posts')
  .then(function (response) {
    assert.equal(response.statusCode, 200);
    console.log('Success!');
  });
```

If provided, the `callback` will be called with the `response` in order to maintain the same function signature as `server.inject`. Its return value will not propogate to future `then` handlers.


## Options

The following `options` can be provided at registration:

* `Promise`: An optional Promise constructor (ES6 Promise or anything that can be called with `new Promise`). [Bluebird](https://github.com/petkaantonov/bluebird) is used if an override is not provided.
* `replace`: When `true`, the plugin will alias `server.injectThen` as `server.inject`, overwriting the native implementation
