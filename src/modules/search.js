
var NodeSearch = require('node-search'),
    config     = require('../lib/config'),
    Module     = require('./module'),
    lunr       = require('lunr'),
    colors     = require('colors'),
    grunt      = require('grunt');

/**
 * @name Search
 * @class Search
 * @constructor
 */
var Search = function(opt) {
  this.gruntOpt = opt;
  this.translations;
  this.index;
};

Search.prototype = Module.prototype;
Search.prototype.constructor = new Module;


/**
 * Index all translation documents
 * @name Search#index
 * @function
 */
Search.prototype._index = function() {
  var _this = this;
  this.translations = config.getAllTranslations(this.gruntOpt);
  this.index = lunr(function() {
    this.field('key', { boost: 10 });
    this.field('translation', { boost: 5});
  });

  var id = 0;
  for(var locale in this.translations) {
    for(var key in this.translations[locale]) {
      this.index.add({
        'key'         : key,
        'translation' : this.translations[locale][key].query_translation,
        'id'          : key
      });
      id++;
    }
  }
};

/**
 * Search translations
 * @name Search#search
 * @function
 *
 * @param {String} q
 * @callback cb
 */
Search.prototype.query = function(q) {
  var cb = cb || function() {};
  this._index();
  var res = this.index.search(q);
  var n = 0;
  grunt.log.ok((res.length + ' results found'));
  for(var i in res) {
    grunt.log.writeln(('' + n).yellow + ' ' + res[i].ref);
    n++;
  }
};


module.exports = Search;
