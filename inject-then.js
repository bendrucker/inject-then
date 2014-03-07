'use strict';

var internals = {};

internals.injectThen = function (Promise, options) {
  var self = this;
  return new Promise(function (resolve) {
    self.inject(options, resolve);
  });
};

exports.register = function (plugin, options, next) {
  if (!options.Promise) next(new Error('A Promise constructor is required in options.Promise'));
  plugin.servers.forEach(function (server) {
    server.injectThen = internals.injectThen.bind(server, options.Promise);
  });
  next();
};