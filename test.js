'use strict';

var chai   = require('chai');
var expect = chai.expect;
chai.use(require('chai-as-promised'));

var Promise = require('bluebird');
var Hapi    = require('hapi');

describe('inject-then', function () {

  var server;
  beforeEach(function () {
    server = new Hapi.Server();
    server.connection();
    server.route({
      path: '/test',
      method: 'GET',
      handler: function (request, reply) {
        reply('hello');
      }
    });
  });

  function register (options) {
    server.register({
      register: require('./'),
      options: options
    }, function (err) {
      if (err) throw err;
    });
  }

  it('defaults to Bluebird', function () {
    register();
    expect(server.injectThen().catch(function () {})).to.be.an.instanceOf(Promise);
  });

  it('can use a promise constructor', function () {
    var PromiseCtor = function () {};
    PromiseCtor.prototype.then = function () {
      return this;
    };
    register({
      Promise: PromiseCtor
    });
    expect(server.injectThen()).to.be.an.instanceOf(PromiseCtor);
  });

  it('registers a server.injectThen method', function () {
    register();
    expect(server).to.itself.respondTo('injectThen');
  });

  it('resolves with the injection response', function () {
    register();
    return server.injectThen('/test').then(function (response) {
      expect(response.result).to.equal('hello');
    });
  });

  it('propogates rejections properly (#2)', function () {
    register();
    var err = new Error();
    return expect(server.injectThen('/test').then(function () {
      throw err;
    }))
    .to.be.rejectedWith(err);
  });

  it('can be registered multiple times', function () {
    register();
    register();
    return server.injectThen('/test').then(function (response) {
      expect(response.result).to.equal('hello');
    });
  });

  it('throws when options.replace is used', function () {
    expect(register.bind(null, {
      replace: true
    }))
    .to.throw('options.replace was removed');
  });

});
