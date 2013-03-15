    var grunt = require('grunt'),
           fs = require('fs'),
          sys = require('sys'),
    requirejs = require('requirejs'),
       findup = require('findup-sync'),
        spawn = require('child_process').spawn,
         exec = require('child_process').exec,
       expect = require('chai').expect;




var gt;
require(findup('Gruntfile.js'))(grunt, true);

var config = grunt.config.get('translate'),
    options = config.dist.options;

// Routing tests
require('../app/routes/translations/spec')(grunt, options);

describe('Grunt Translate', function() {
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
      expect(gt('It can have an if and else statement', {number: 3})).to.equal('Number is 3');
      expect(gt('It can have an if and else statement', {number: 1})).to.equal('Number is smaller than 2');
    });
    it('should be able to compile if and elseif and else statement', function() {
      expect(gt('It can have an if and else if and else statements', {number: 3})).to.equal('Number is exactly 3');
    });
    it('should be able to compile string values', function() {
      expect(gt('It can have only one string', { world: 'world'})).to.equal('Hello world!')
    });
  });

  describe('Operators', function() {
    it('should be able to take && in if statements', function() {
      expect(gt('It can take && in if statement', { firstname: 'Tingan', lastname: 'Ho'})).to.equal('Hello Tingan Ho!');
    });
    it('should be able to take || in if statements', function() {
      expect(gt('It can take || in if statement', { firstname: 'Tingan', lastname: 'Ho'})).to.equal('Hello Tingan Ho!');
    });
    it('should be able to take several && in if statements', function() {
      expect(gt('It can take several && in if statement', { firstname: 'Tingan', lastname: 'Ho'})).to.equal('Hello Tingan Ho!');
    });
    it('should be able to take several || in if statements', function() {
      expect(gt('It can take several || in if statement', { firstname: 'Tingan', lastname: 'Ho'})).to.equal('Hello Tingan Ho!');
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
    });
  });


  describe('Log', function(){
    var translations;
    var keys = [];
    var bootstrap = require('../lib/bootstrap');
    before(function(done){
      translations = grunt.file.readJSON(options.config + '/locales/' + options.defaultLanguage + '.json');
      for(var key in translations) {
        if(translations.hasOwnProperty(key)) {
          keys.push(key);
        }
      }
      keys.sort(function(a, b) {
        return translations[b].timestamp - translations[a].timestamp;
      });
      done();
    });
    it('should return 20 latest translations', function(){
      var result = bootstrap.log(options, true);
      var n = 0;
      for(var key in result) {
        expect(key).to.equal(keys[n]);
        n++;
      }

    });
  })
});

