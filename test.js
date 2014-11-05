'use strict';

var chai   = require('chai');
var expect = chai.expect;
chai.use(require('chai-as-promised'));

var Promise = require('bluebird');
var Hapi    = require('hapi');

describe('inject-then', function () {
  describe('with-default-options', function () {
    var server,
        options = {};
    before(function (done) {
      server = new Hapi.Server();
      server.pack.register({
        plugin: require('./'),
        options: options
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
  })

  describe('with-constructor-option', function () {
    var server,
        PromiseCtor = function () {},
        options = {
          Promise: PromiseCtor
        };
    before(function (done) {
      server = new Hapi.Server();
      server.pack.register({
        plugin: require('./'),
        options: options
      }, done);
      server.route({
        path: '/test',
        method: 'GET',
        handler: function (request, reply) {
          reply('hello');
        }
      });
    });
    it('can use a promise constructor', function (done) {
      expect(server.injectThen()).to.be.an.instanceOf(PromiseCtor);
      done();
    });
  });

  describe('with-replace-option', function () {
    var server,
        options = {
          replace: true
        };
    before(function (done) {
      server = new Hapi.Server();
      server.pack.register({
        plugin: require('./'),
        options: options
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
      expect(server.inject().catch(function () {})).to.be.an.instanceOf(Promise);
    });

    it('does not registers a server.injectThen method', function () {
      expect(server).to.itself.not.respondTo('injectThen');
    });

    it('server.inject method available', function () {
      expect(server).to.itself.respondTo('inject');
    });

    it('Promise resolves with the injection response', function () {
      return server.inject('/test').then(function (response) {
        expect(response.result).to.equal('hello');
      });
    });

    it('Callback resolves with the injection response', function () {
      return server.inject('/test', function (response) {
        expect(response.result).to.equal('hello');
      });
    });
  });

});