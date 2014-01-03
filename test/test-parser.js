
/**
 * Module dependencies
 */

var sinon      = require('sinon')
  , path       = require('path')
  , expect     = require('chai').expect
  , proxyquire = require('proxyquire')

/**
 * Import Parser constructor
 */

var Parser = require('../lib/parser').Parser;

module.exports = function() {
  describe('Parser', function() {
    describe('#getKey', function() {
      it('should get the translation key from a function string', function() {
        var parser = new Parser();
        var key = parser.getKey('gt(\'SOME_KEY\')');
        expect(key).to.equal('SOME_KEY');
      });
    });
  });
};