
/**
 * Module dependencies
 */

var path = require('path');

/**
 * Import Parser constructor
 */

var Search = _Search = require('../lib/search').Search;

module.exports = function() {
  describe('Search', function() {
    describe('#constructor', function() {
      beforeEach(function() {
        sinon.stub(_Search.prototype, '_createIndex');
      });

      afterEach(function() {
        _Search.prototype._createIndex.restore();
      });

      it('should create index', function() {
        var search = new _Search();
        search._createIndex.should.have.been.calledOnce;
      });

      it('should set default locale from global configs', function() {
        var search = new _Search();
        expect(search.defaultLocale).to.equal(cf.defaultLocale);
      });

      it('should set index to null', function() {
        var search = new _Search();
        expect(search.index).to.not.be.a('undefined');
      });

      it('should set translation to null', function() {
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

    describe('#_createIndex', function() {
      it('should set the key field', function() {
        var search = new Search();
        expect(search.index._fields[0].name).to.equal('key');
      });

      it('should set the text field', function() {
        var search = new Search();
        expect(search.index._fields[1].name).to.equal('text');
      });

      it('should set the key field to have boost 10', function() {
        var search = new Search();
        expect(search.index._fields[0].boost).to.equal(10);
      });

      it('should set the text field to have boost 10', function() {
        var search = new Search();
        expect(search.index._fields[1].boost).to.equal(10);
      });
    });
  });
};
