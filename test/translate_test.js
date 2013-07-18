var grunt     = require('grunt'),
    fs        = require('fs'),
    sys       = require('sys'),
    requirejs = require('requirejs'),
    findup    = require('findup-sync'),
    exec      = require('child_process').exec,
    expect    = require('chai').expect;




var gt;
require(findup('Gruntfile.js'))(grunt, true);

var config = grunt.config.get('translate'),
    options = config.dist.options;

// Routing tests
require('../app/pages/translations/spec')(grunt, options);

describe('Grunt translate', function() {
  before(function(done) {
    this.timeout(10000);
    exec('grunt translate:update', function() {
      exec('grunt translate:compile', function() {
        // RequireJS settings
        requirejs.config({
          baseUrl: __dirname,
          nodeRequire: require
        });
        gt = requirejs('./translations/output/en');
        done();
      });
    });
  });
  describe('Compiling', function() {
    it('should be able to compile if and else statements', function() {
      expect(gt('It can have an if and else statement', {test: 3})).to.have.string('if works');
      expect(gt('It can have an if and else statement', {test: 1})).to.have.string('else works');
    });
    it('should be able to compile if and elseif and else statement', function() {
      expect(gt('It can have an if and else if and else statements', { test: 3 })).to.equal('yes it can');
    });
    it('should be able to compile string values', function() {
      expect(gt('It can have only one string', { world: 'world'})).to.equal('yes it can')
    });
  });

  describe('Operators', function() {
    it('should be able to take && in if statements', function() {
      expect(gt('It can take && in if statement', { test1: 'test1', test2: 'test2'})).to.have.string('yes it can');
    });
    it('should be able to take || in if statements', function() {
      expect(gt('It can take || in if statement', { test1: 'test1', test2: 'test2'})).to.have.string('yes it can');
    });
    it('should be able to take several && in if statements', function() {
      expect(gt('It can take several && in if statement', { test1: 'test1', test2: 'test2', test3: 'test3' })).to.have.string('yes it can');
    });
    it('should be able to take several || in if statements', function() {
      expect(gt('It can take several || in if statement', { test1: 'test1', test2: 'test2'})).to.have.string('yes it can');
    });
  });

  describe('Timestamp', function() {
    it('should have an timestamp', function() {
      var translations = JSON.parse(fs.readFileSync('test/translations/locales/en.json'));
      expect(typeof translations['It can have an if and else statement'].timestamp === 'number').to.be.ok
    });
  });

  describe('Special chars', function() {
    var pre = 'should be able to accept ';
    describe('General', function() {
      it(pre + '..', function() {
        expect(gt('It can have ..')).to.be.ok;
      });
      it(pre + ',,', function() {
        expect(gt('It can have ,,')).to.be.ok;
      });
      it(pre + '::', function() {
        expect(gt('It can have ::')).to.be.ok;
      });
      it(pre + ';;', function() {
        expect(gt('It can have ;;')).to.be.ok;
      });
      it(pre + '__', function() {
        expect(gt('It can have __')).to.be.ok;
      });
      it(pre + '’’', function() {
        expect(gt('It can have ’’')).to.be.ok;
      });
      it(pre + '&&', function() {
        expect(gt('It can have &&')).to.be.ok;
      });
      it(pre + '%%', function() {
        expect(gt('It can have %%')).to.be.ok;
      });
      it(pre + '$$', function() {
        expect(gt('It can have $$')).to.be.ok;
      });
      it(pre + '€€', function() {
        expect(gt('It can have €€')).to.be.ok;
      });
      it(pre + '##', function() {
        expect(gt('It can have ##')).to.be.ok;
      });
      it(pre + '??', function() {
        expect(gt('It can have ??')).to.be.ok;
      });
      it(pre + '!!', function() {
        expect(gt('It can have !!')).to.be.ok;
      });
      it(pre + '<>', function() {
        expect(gt('It can have <>')).to.be.ok;
      });
      it(pre + '^^', function() {
        expect(gt('It can have ^^')).to.be.ok;
      });
      it(pre + '´´', function() {
        expect(gt('It can have ´´')).to.be.ok;
      });
      it(pre + '``', function() {
        expect(gt('It can have ``')).to.be.ok;
      });
      it(pre + '``', function() {
        expect(gt('It can have ()')).to.be.ok;
      });
      it(pre + '@@', function() {
        expect(gt('It can have @@')).to.be.ok;
      });
    });

    describe('Math', function() {
      it(pre + '==', function() {
        expect(gt('It can have ==')).to.be.ok;
      });
      it(pre + '++', function() {
        expect(gt('It can have ++')).to.be.ok;
      });
      it(pre + '--', function() {
        expect(gt('It can have --')).to.be.ok;
      });
      it(pre + '**', function() {
        expect(gt('It can have **')).to.be.ok;
      });
      it(pre + '//', function() {
        expect(gt('It can have //')).to.be.ok;
      });
      it(pre + '..', function() {
        expect(gt('It can have ..')).to.be.ok;
      });
    });

    describe('Quotations', function() {
      it(pre + '\'', function() {
        expect(gt('It can have \'')).to.be.ok;
      });
      it(pre + '\"', function() {
        expect(gt('It can have \"')).to.be.ok;
      });
      it('It can have double and single quote in translation', function() {
        expect(gt('It can have double and single quote in translation')).to.have.string('yes it can');
      });
    });

    describe('Comments', function() {
      it('should be able to have tailing comments', function() {
        expect(gt('Grunt-translate can have tailing comments')).to.have.string('yes it can');
      });
      it('should be able to have tailing comments with translation vars', function() {
        expect(gt('Grunt-translate can have tailing comments with translation vars')).to.have.string('yes it can');
      });
      it('should be able to have tailing comments with multi-line translation vars', function() {
        expect(gt('Grunt-translate can have tailing comments with multi-line translation vars')).to.have.string('yes it can');
      });
    });

    describe('Object', function() {
      it('can be in object literal', function() {
        expect(gt('Translation vars can be in one object literal')).to.have.string('yes it can');
      });
    });

    describe('Vars', function() {
      it('can have one line object literal', function() {
        expect(gt('Translation vars can have one line object literal')).to.have.string('yes it can');
      });
      it('can have single function call', function() {
        expect(gt('Translation vars can have single function call')).to.have.string('yes it can');
      });
      it('can have multiple function calls', function() {
        expect(gt('Translation vars can have multiple function calls')).to.have.string('yes it can');
      });
      it('can have single method call', function() {
        expect(gt('Translation vars can have single method call')).to.have.string('yes it can');
      });
      it('can have multiple method calls', function() {
        expect(gt('Translation vars can have multiple method calls')).to.have.string('yes it can');
      });
      it('can have single function call with a single object literal as a parameter', function() {
        expect(gt('Translation vars can have single function call with a single object literal as a parameter')).to.have.string('yes it can');
      });
      it('can have multiple function call with a single object literal as a parameter', function() {
        expect(gt('Translation vars can have multiple function call with a single object literal as a parameter')).to.have.string('yes it can');
      });
      it('can have single function call with a multiple object literal as a parameter', function() {
        expect(gt('Translation vars can have single function call with a multiple object literal as a parameter')).to.have.string('yes it can');
      });
      it('can have multiple function call with a multiple object literal as a parameter', function() {
        expect(gt('Translation vars can have multiple function call with a multiple object literal as a parameter')).to.have.string('yes it can');
      });
      it('can be inside function calls', function() {
        expect(gt('Translation function can be inside function calls')).to.have.string('yes it can');
      });
    });
  });


  describe('log', function(){
    it('should return 10 latest translations', function(done){
      exec('node bin/gt log', function(error, stdout, stderr) {
        expect(/latest translation/.test(stdout)).to.be.true;
        done();
      });
    });
  });

  describe('search', function() {
    it('should be able to index translations', function(done) {
      exec('node bin/gt search test', function(error, stdout, stderr) {
        expect(/results found/.test(stdout)).to.be.true;
        done();
      });
    });
  });

  describe('edit', function() {

    it('should give an error if no translation value is present', function(done) {
      exec('node bin/gt edit -3', function(error, stdout, stderr) {
        expect(/You must have a translation value to add to a translation key/.test(stdout)).to.be.true;
        done();
      });
    });

    it('should not be able to edit translation for -1000000', function(done) {
      exec('node bin/gt edit -10000 "Helloworld"', function(error, stdout, stderr) {
        expect(/Your log doesn't contain/.test(stdout)).to.be.true;
        done();
      });
    });

    it('should not be able to edit translation for @1000000', function(done) {
      exec('node bin/gt edit @10000 "Helloworld"', function(error, stdout, stderr) {
        expect(/Your latest search didn/.test(stdout)).to.be.true;
        done();
      });
    });

    it('should be able to edit "Edit me"', function(done) {
      exec('node bin/gt edit "Edit me" "Helloworld"', function(error, stdout, stderr) {
        expect(/Translation key:/.test(stdout)).to.be.true;
        done();
      });
    });

    it('should be able to edit "Edit me" in lang dn', function(done) {
      exec('node bin/gt edit "Edit me" -lang=dn "Helloworld"', function(error, stdout, stderr) {
        expect(/Translation key:/.test(stdout)).to.be.true;
        done();
      });
    });
  });
});

