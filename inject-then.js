'use strict';

var bluebird = require('bluebird');

var internals = {};

internals.injectThen = function (inject, Promise, options, cb) {
  var server  = this,
      promise = new Promise(function (resolve) {
        inject.call(server, options, resolve);
      });

  if (cb) {
    return promise.then(cb);
  } else {
    return promise;
  }
};

exports.register = function (plugin, options, next) {
  var Promise   = options.Promise || bluebird,
      funcName  = options.replace ? 'inject' : 'injectThen';
  plugin.servers.forEach(function (server) {
    var inject = server.inject;
    server[funcName] = internals.injectThen.bind(server, inject, Promise);
  });
  next();
};

exports.register.attributes = {
  multiple: true,
  pkg: require('./package.json')
};
