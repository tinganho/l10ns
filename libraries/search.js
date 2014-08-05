
/**
 * Module dependencies
 */

var lunr = require('lunr')
  , file = require('./file')
  , log = require('./_log')
  , EventEmitter = require('events').EventEmitter
  , util = require('util')
  , fs = require('fs')
  , defer = require('q').defer;

/**
 * Add terminal colors
 */

require('terminal-colors');

/**
 * We need to search in both `gt search` and in the interface. This object
 * provides indexing and query functions.
 *
 * @constructor Search
 */

var Search = function() {
  this.localizations = null;
  this.index = null;
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
    this.ref('id');
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

Search.prototype.readLocalizations = function() {
  var _this = this, deferred = defer();

  file.readLocalizations()
    .then(function(localizations) {
      _this.localizations = localizations;

      if(typeof _this.localizations[project.defaultLocale] === 'undefined') {
        throw new TypeError('Default locale is undefined');
      }

      _this.localizations = _this.localizations[project.defaultLocale];

      for(var key in _this.localizations) {
        var localization = _this.localizations[key];
        _this.index.add({
          id : localization.key,
          text : localization.text,
          // the  `BASE__EXIT_BUTTON` should be toknized as `base exit button`
          key : localization.key.replace(/_+/g,  ' ').toLowerCase()
        });
      }

      // Save docs
      _this.docs = _this.localizations;

      deferred.resolve();
    })
    .fail(function(error) {
      deferred.reject(error);
    });

  return deferred.promise;
};

/**
 * Query translations
 *
 * @param {String} q
 * @return {void}
 * @api public
 */

Search.prototype.queryOutput = function(q) {
  var _this = this;

  var res = this.index.search(q).slice(0, this.logLength);

  if(res.length === 0) {
    log.log('No result found');
  }

  var n = 1;
  var cache = [];
  for(var i in res) {
    log.log((n === 10 ? '%' + n : ' %' + n).yellow
      + ' ' + this.docs[res[i].ref].key + ' | '
      + this.docs[res[i].ref].text.green);
    cache.push(res[i]);
    n++;
  }

  // Store as cache
  fs.writeFile(
    project.cache.search,
    JSON.stringify(cache, null, 2),
    function() {
      _this.emit('queryend', res);
    }
  );
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

  return this.index.search(q).slice(0, program.LOG_LENGTH).map(function(result) {
    return {
      id: _this.localizations[result.ref].id,
      key: result.ref,
      value: _this.localizations[result.ref].text
    };
  });
};

/**
 * Exports instance
 */

module.exports = Search;

/**
 * Exports constructor
 */

module.exports.Search = Search;
