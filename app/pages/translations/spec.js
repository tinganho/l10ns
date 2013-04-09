var chai    = require('chai'),
    expect  = chai.expect,
    request = require('supertest'),
    cheerio = require('cheerio'),
    browser = require('zombie');


var $;


// Then close the server when done...
var server = require('../../server').server();

module.exports = function(grunt, options){
  describe('Interface', function(){
    describe('Website', function(){
      it('should return status ok', function(done){
        request(server)
        .get('/')
        .end(function(err, res){
          if (err) {
            throw err;
          }
          expect(res.statusCode).to.equal(200);
          done();
        });
      });
    });

    describe('keys', function(){
      var translations;
      var keys = [];
      var bootstrap = require('../../../src/bootstrap');

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
      it('should be ordered correctly', function(done){
        request(server)
        .get('/')
        .end(function(err, res){
          if(err) {
            throw err;
          }
          $ = cheerio.load(res.text);
          var n = 0;
          $('.m-translation-keys li').each(function(){
            expect($(this).text()).to.equal(keys[n]);
            n++;
          });
          done();
        });
      });
    });


    describe('translation values', function() {
      this.timeout(5000);
      it('should be able to edit values ', function(done) {
        browser.visit('http://localhost:'
          + server.get('port')
          + '/', { silent: true}, function (e, browser) {
            browser.window.$('.translations-row:eq(0)').click();
            setTimeout(function() {
              var testText = 'helloho';
              browser.window.$('.js-translation-input').val(testText).keyup();
              browser.window.$('.js-translation-save').click();
              setTimeout(function() {
                var text =
                  browser.window
                    .$('.translations-edit-row')
                      .prev()
                        .find('.translations-value .translations-text')
                          .text();
                  expect(text).to.equal(testText);
                  done();
                  browser.window.$('.js-translation-input').val('').keyup();
                  browser.window.$('.js-translation-save').click();
              }, 800);
            }, 100);
        });
      });
    });
  });

};

