var chai = require('chai'),
    expect = chai.expect,
    request = require('supertest'),
    cheerio = require('cheerio');


var $;


// Then close the server when done...
var server = require('../../server').server();

module.exports = function(grunt, options){
  describe('Interface', function(){
    describe('Website', function(){
      it('should return status ok', function(done){
        request(server)
        .get('/translations')
        .end(function(err, res){
          if (err) {
            throw err;
          }
          expect(res.statusCode).to.equal(200);
          done();
        });
      });
    });

    describe('Keys', function(){
      var translations;
      var keys = [];
      var bootstrap = require('../../../lib/bootstrap');

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
        .get('/translations')
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
  });

};

