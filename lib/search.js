
/**
 * Module dependencies
 */

var lunr = require('lunr')
  , file = require('./file')
  , log = require('./_log')
  , EventEmitter = require('events').EventEmitter
  , util = require('util')
  , fs = require('fs');

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

var Search = function() {
  if (!(this instanceof Search)) return new Search();

  EventEmitter.call(this);

  this.translations;
  this.defaultLocale = cf.defaultLocale;
  this._createIndex();
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
 * We need to read all translations and append translations to the index
 *
 * @return {void}
 * @emit `readend`
 * @api public
 */

Search.prototype.readTranslations = function() {
  var _this = this;
  var translations = file.readTranslations();

  if(typeof translations[cf.defaultLocale] === 'undefined') {
    throw new TypeError('Default locale is undefined');
  }

  translations = translations[cf.defaultLocale];

  for(var key in translations) {
    var translation = translations[key];
    this.index.add({
      id : translation.id,
      text : translation.text,
      // the key `BASE__EXIT_BUTTON` should be toknized as `base exit button`
      key : translation.key.replace(/_+/g,  ' ').toLowerCase()
    });
  }

  //
  this.docs = translations

  this.emit('readend');
};

/**
 * Query translations
 *
 * @param {String} q
 * @return {void}
 * @api public
 */

Search.prototype.query = function(q) {
  var _this = this;
  var res = this.index.search(q).slice(0, cf.LOG_LENGTH);
  var n = 1;
  log.success(res.length + ' results found');
  console.log(res);
  var cache = [];
  for(var i in res) {
    log.log(('@' + n).yellow + ' ' + this.docs[res[i].ref]);
    cache.push(res[i]);
    n++;
  }

  // Store as cache
  fs.writeFile(
    cf.folder + '/cache/latestSearch.json',
    JSON.stringify(cache, null, 2), function() {
      _this.emit('queryend', res);
    }
  );
};

/**
 * Exports instance
 */

module.exports = Search;

/**
 * Exports constructor
 */

module.exports.Search = Search;
