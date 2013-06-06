
var config     = require('../lib/config'),
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
    this.field('translation', { boost: 10});
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
  var res = this.index.search(q).slice(0, 10);
  var n = 1;
  grunt.log.ok((res.length + ' results found'));
  var cache = [];
  for(var i in res) {
    grunt.log.writeln(('@' + n).yellow + ' ' + res[i].ref);
    cache.push(res[i].ref);
    n++;
  }

  // Store as cache
  grunt.file.write(
    opt.config + '/cache/latestSearch.json',
    JSON.stringify(cache, null, 2)
  );

  return res;
};


module.exports = Search;
