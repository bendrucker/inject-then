'use strict';

var bluebird = require('bluebird');

exports.register = function (plugin, options, next) {
  plugin.servers.forEach(function (server) {
    var Promise = options.Promise || bluebird;
    var inject  = server.inject;

    function injectThen (options, callback) {
      var self = this;
      return new Promise(function (resolve) {
        self.inject(options, resolve);
      })
      .then(function (response) {
        if (typeof callback === 'function') {
          callback(response);
        }
        return response;
      });
    }
    server.injectThen = injectThen;
    if (options.replace) {
      server.inject = injectThen;
    }
  });
  next();
};

exports.register.attributes = {
  multiple: true,
  pkg: require('../package.json')
};
