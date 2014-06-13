'use strict';

var bluebird = require('bluebird');

var internals = {};

internals.injectThen = function (Promise, options) {
  var server = this;
  return new Promise(function (resolve) {
    server.inject(options, resolve);
  });
};

exports.register = function (plugin, options, next) {
  plugin.servers.forEach(function (server) {
    server.injectThen = internals.injectThen.bind(server, options.Promise || bluebird);
  });
  next();
};

exports.register.attributes = {
    multiple: true,
    pkg: require('./package.json')
};
