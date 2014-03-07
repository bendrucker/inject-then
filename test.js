require('mocha-as-promised')();

var chai   = require('chai');
var expect = chai.expect;
chai.use(require('chai-as-promised'));

var Promise = require('bluebird');
var Hapi    = require('hapi');

describe('injectThen', function () {

  var server;
  beforeEach(function (done) {
    server = new Hapi.Server();
    server.pack.require('../injectThen', {
      Promise: Promise
    }, done);
  })

  it('requires a promise constructor', function (done) {
    server = new Hapi.Server();
    server.pack.require('../injectThen', function (err) {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.contain('Promise');
      done();
    });
  });

  it('registers a server.injectThen method', function () {
    expect(server).to.itself.respondTo('injectThen');
  });

  it('resolves with the injection response', function () {
    server.route({
      path: '/test',
      method: 'GET',
      handler: function (request, reply) {
        reply('hello');
      }
    });

    return server.injectThen('/test').then(function (response) {
      expect(response.result).to.equal('hello');
    });
  });

});