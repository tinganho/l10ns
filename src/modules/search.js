
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
  this.translations = config.getAllTranslations();
  this.index = lunr(function() {
    this.field('key', { boost: 10 });
    this.field('translation', { boost: 10});
  });

  // Remove stop filter
  this.index.pipeline.remove(lunr.stopWordFilter);

  var id = 0;
  this.docs = {};
  for(var locale in this.translations) {
    for(var key in this.translations[locale]) {
      var translation, type;
      if(typeof this.translations[locale][key].translations === 'string') {
        type = 'simple';
        var val = this.translations[locale][key].translations.substr(1, this.translations[locale][key].translations.length - 2);
        translation = {
          text  : val,
          value : val
        };
      } else {
        if(this.translations[locale][key].translations.length === 0) {
          type = 'simple';
          translation = {
            text  : 'NO TRANSLATION',
            value : ''
          };
        } else {
          type = 'logical';
          translation = {
            text  : 'if...',
            value : this.translations[locale][key].translations
          };
        }
      }
      var obj = {
        key           : key,
        value         : translation,
        translation   : this.translations[locale][key].query_translation,
        id            : locale + '_' + this.translations[locale][key].id,
        _id           : this.translations[locale][key].id,
        locale        : locale,
        vars          : this.translations[locale][key].vars
      };
      this.index.add(obj);
      this.docs[obj.id] = obj;
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
  var res = this.index.search(q).slice(0, 10), _res = [];
  var n = 1;
  grunt.log.ok((res.length + ' results found'));
  var cache = [];
  for(var i in res) {
    _res.push(this.docs[res[i].ref]);
    grunt.log.writeln(('@' + n).yellow + ' ' + this.docs[res[i].ref]);
    cache.push(res[i].ref);
    n++;
  }

  // Store as cache
  grunt.file.write(
    opt.config + '/cache/latestSearch.json',
    JSON.stringify(cache, null, 2)
  );

  // console.log(this.index.documentStore.store);

  return _res;
};


module.exports = Search;
