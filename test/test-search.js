
/**
 * Module dependencies
 */

var sinon = require('sinon')
  , path = require('path')
  , expect = require('chai').expect
  , proxyquire = require('proxyquire')

/**
 * Import Parser constructor
 */

var Search = require('../lib/search').Search;

module.exports = function() {
  describe('Search', function() {
    describe('#constructor', function() {
      it('should create index and remove default stop word filter', function() {
        var _Search = Search;
        Search.prototype._createIndex = sinon.spy();
        Search.prototype._removeDefaultStopWordFilter = sinon.spy();
        var search = new _Search();
        expect(search._createIndex.calledOnce).to.be.true;
        expect(search._removeDefaultStopWordFilter.calledOnce).to.be.true;
      });
    }); 
  });
};