
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

      it('should get translation key from a function string containing a map of vars', function() {
        var parser = new Parser();
        var key = parser.getKey('gt(\'SOME_KEY\')');
        var key = parser.getKey('gt(\'SOME_KEY\', { test : test})');
      });
    });

    describe('#getVars', function() {
      it('should return empty array if there is no map of arrays', function() {
        var parser = new Parser();
        var vars = parser.getVars('gt(\'SOME_KEY\')');
        expect(vars).to.eql([]);
      });

      it('should return an array containing the variable if a variable maps is provided', function() {
        var parser = new Parser();
        var vars = parser.getVars('gt(\'SOME_KEY\', { test : \'test\'})');
        expect(vars).to.eql(['test']);
      });

      it('should return empty array if rpeokrpok', function() {
        var parser = new Parser();
        var vars = parser.getVars('gt(\'SOME_KEY\', { test1 : \'test1\',\n \'test2\' : test2 })');
        expect(vars).to.eql(['test1', 'test2']);
      });
    });
  });
};