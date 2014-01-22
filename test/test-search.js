
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
      it('should create index and remove default stop word filter', function() {
        var _Search = Search;
        _Search.prototype._createIndex = sinon.spy();
        var search = new _Search();
        search._createIndex.should.have.been.calledOnce;
      });
    });
  });
};
