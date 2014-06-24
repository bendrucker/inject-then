'use strict';

var chai   = require('chai');
var expect = chai.expect;
chai.use(require('chai-as-promised'));

var Promise = require('bluebird');
var Hapi    = require('hapi');

describe('inject-then', function () {

  var server;
  beforeEach(function (done) {
    server = new Hapi.Server();
    server.pack.register({
      plugin: require('./'),
      options: {
        Promise: Promise
      }
    }, done);
    server.route({
      path: '/test',
      method: 'GET',
      handler: function (request, reply) {
        reply('hello');
      }
    });
  });

  it('defaults to Bluebird', function () {
    expect(server.injectThen().catch(function () {})).to.be.an.instanceOf(Promise);
  });

  it('can use a promise constructor', function (done) {
    var PromiseCtor = function () {};
    server = new Hapi.Server();
    server.pack.register({
      plugin: require('./'),
      options: {
        Promise: PromiseCtor
      }
    }, function () {
      expect(server.injectThen()).to.be.an.instanceOf(PromiseCtor);
      done();
    });
  });

  it('registers a server.injectThen method', function () {
    expect(server).to.itself.respondTo('injectThen');
  });

  it('resolves with the injection response', function () {
    return server.injectThen('/test').then(function (response) {
      expect(response.result).to.equal('hello');
    });
  });

  it('propogates rejections properly (#2)', function () {
    var err = new Error();
    return expect(server.injectThen('/test').then(function () {
      throw err;
    }))
    .to.be.rejectedWith(err);
  });

});
