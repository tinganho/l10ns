
var lunr = require('lunr')
  , colors = require('colors')
  , file = require('./file');

/**
 * We need to search in both `gt search` and in the interface. This object
 * provides indexing and query functions.
 *
 * @constructor Search
 */

var Search = function() {
  this.translations;
  this._createIndex();
};

/**
 * We need to attach console.log method to Log. Because we need
 * to test the logging functionality
 *
 * @attach console.log to _log
 */

Search.prototype._log = console.log;

/**
 * Create search index
 *
 * @return {void}
 * @api private
 */

Search.prototype._createIndex = function() {
  this.index = lunr(function() {
    this.field('key', { boost: 10 });
    this.field('translation', { boost: 10});
  });
};

/**
 * We need to remove the stop word filter sometimes. Because
 * some oftenly used english words like `it`, `has` and etc. can't
 * be autocompleted.
 *
 * @return {void}
 * @api private
 */

Search.prototype._removeDefaultStopWordFilter = function() {
  this.index.pipeline.remove(lunr.stopWordFilter);
};

/**
 * Index all translation documents
 * @name Search#index
 * @function
 */

Search.prototype._index = function() {
  var _this = this;
  this.translations = file.readTranslations();

  // Remove stop filter
  this._removeDefaultStopWordFilter();

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

  return _res;
};

/**
 * Get latest search translation
 * @param {Number} amount
 * @return {Array}
 */

Search.prototype.getLatestSearchTranslations = function(amount) {
  amount = amount || 10;
  if(grunt.file.exists(opt.latestSearch)) {
    return grunt.file.readJSON(opt.latestSearch).slice(0, amount);
  } else {
    return [];
  }
};


module.exports = Search;
