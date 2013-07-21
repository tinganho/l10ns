var chai    = require('chai'),
    expect  = chai.expect,
    request = require('supertest'),
    cheerio = require('cheerio'),
    browser = require('zombie'),
    exec    = require('child_process').exec;


var $;


// Then close the server when done...
var server = require('../../server').server();

module.exports = function(grunt, options){
  // describe('Interface', function() {

  //   describe('translation values', function() {
  //     this.timeout(5000);
  //     before(function(done) {
  //       exec('node app/server.js', function(){
  //         done();
  //       });
  //     });

  //     it('should be able to edit values ', function(done) {
  //       browser.visit('http://localhost:'
  //         + server.get('port')
  //         + '/', { silent: true}, function (e, browser) {
  //           browser.window.$('.translations-row:eq(0)').click();
  //           setTimeout(function() {
  //             var testText = 'helloho';
  //             browser.window.$('.js-translation-input').val(testText).keyup();
  //             browser.window.$('.js-translation-save').click();
  //             setTimeout(function() {
  //               var text =
  //                 browser.window
  //                   .$('.translations-edit-row')
  //                     .prev()
  //                       .find('.translations-value .translations-text')
  //                         .text();
  //                 expect(text).to.equal(testText);
  //                 done();
  //                 browser.window.$('.js-translation-input').val('').keyup();
  //                 browser.window.$('.js-translation-save').click();
  //             }, 800);
  //           }, 100);
  //       });
  //     });
  //   });
  // });

};

