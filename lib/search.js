
/**
 * Module dependencies
 */

var lunr = require('lunr')
  , file = require('./file')
  , log = require('./_log')
  , EventEmitter = require('events').EventEmitter
  , util = require('util');

/**
 * Add terminal colors
 */

require('colors');

/**
 * We need to search in both `gt search` and in the interface. This object
 * provides indexing and query functions.
 *
 * @constructor Search
 */

var Search = function() {
  if (!(this instanceof Search)) return new Search();

  EventEmitter.call(this);

  this.translations;
  this.defaultLocale = cf.defaultLocale;
  this._createIndex();
  // this._removeDefaultStopWordFilter();
};

/**
 * Inherit EventEmitter
 */

util.inherits(Search, EventEmitter);

/**
 * Create search index
 *
 * @return {void}
 * @api private
 */

Search.prototype._createIndex = function() {
  this.index = lunr(function() {
    this.field('key', { boost: 10});
    this.field('text', { boost: 10});
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
 * We need to read all translations and append translations to the index
 *
 * @return {void}
 * @api public
 */

Search.prototype.readTranslations = function() {
  var _this = this;
  var translations = file.readTranslations();

  this.docs = {};
  for(var key in translations) {
    var translation = translations[obj];
    this.index.add({
      id : translation.id,
      text : translation.text,
      // the key BASE__EXIT_BUTTON should be toknized as `base exit button`
      key : translation.key.replace(/_+/g,  ' ').toLowerCase()
    });
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
    console.log(('@' + n).yellow + ' ' + this.docs[res[i].ref]);
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

/**
 * Exports instance
 */

module.exports = Search;

/**
 * Exports constructor
 */

module.exports.Search = Search;
