
/**
 * Module dependencies
 */

var path = require('path');

/**
 * Import Parser constructor
 */

var Search = require('../lib/search').Search;

module.exports = function() {
  describe('Search', function() {
    describe('#constructor', function() {
      it('should create index', function() {
        var _Search = Search;
        _Search.prototype._createIndex = sinon.spy();
        var search = new _Search();
        search._createIndex.should.have.been.calledOnce;
      });

      it('should set default locale from global configs', function() {
        var _Search = Search;
        _Search.prototype._createIndex = sinon.spy();
        var search = new _Search();
        expect(search.defaultLocale).to.equal(cf.defaultLocale);
      });

      it('should set translation to null', function() {
        var _Search = Search;
        _Search.prototype._createIndex = sinon.spy();
        var search = new _Search();
        expect(search.translations).to.not.be.a('undefined');
      });

      it('should call the EventEmitter constructor', function() {
        var eventsStub = { EventEmitter : sinon.spy() };
        var _Search = proxyquire('../lib/search', { events : eventsStub }).Search
        _Search.prototype._createIndex = sinon.spy();
        var search = new _Search();
        eventsStub.EventEmitter.should.have.been.calledOnce;
      });
    });
  });
};
