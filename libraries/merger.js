
/**
 * @fileoverview Merge class is responsible for merging all new translations
 * with old translations
 */

/**
 * Module dependencies.
 */

var Hashids = require('hashids')
  , hashids = new Hashids(program.TRANSLATION_ID_HASH_SECRET, program.TRANSLATION_ID_CHAR_LENGTH)
  , _ = require('underscore');

/**
 * We merge source keys with old translations. A class Merge is used for this and it
 * has a lot of convinient functions to accomplish merge tasks
 *
 * @constructor Merger
 */

function Merger() {
  this.counter = 0;
}

/**
 * Merge timestamps
 *
 * @param {Object} newLocalizations
 * @param {Object} oldLocalizations
 * @param {String} key
 * @return {Object}
 * @api public
 */

Merger.prototype.mergeTimeStamp = function(newLocalizations, oldLocalizations, key) {
  var now = Date.now();

  if(key in oldLocalizations && 'timestamp' in oldLocalizations[key]) {
    newLocalizations[key].timestamp = oldLocalizations[key].timestamp;
  }
  else {
    newLocalizations[key].timestamp = now;
  }

  return newLocalizations;
};

/**
 * Merge id
 *
 * @param {Object} newLocalizations
 * @param {Object} oldLocalizations
 * @param {String} key
 * @return {void}
 * @api public
 */

Merger.prototype.mergeId = function(newLocalizations, oldLocalizations, key) {
  var now = parseInt(Date.now() / 1000, 10);
  if(key in oldLocalizations && 'id' in oldLocalizations[key]) {
    newLocalizations[key].new = false;
    newLocalizations[key].id = oldLocalizations[key].id;
  }
  else {
    newLocalizations[key].new = true;
    newLocalizations[key].id = hashids.encrypt(now, this.counter);
  }
  this.counter++;

  return newLocalizations;
};

/**
 * Merge localizations.
 *
 * @param {Object} newLocalizations
 * @param {Object} oldLocalizations
 * @param {String} key
 * @return {Object}
 * @api public
 */

Merger.prototype.mergeLocalizations = function(newLocalizations, oldLocalizations, key) {
  if(key in oldLocalizations && 'value' in oldLocalizations[key]) {
    newLocalizations[key].value = oldLocalizations[key].value;
    newLocalizations[key].text = oldLocalizations[key].text;
  }
  else {
    throw new TypeError('Key does not exits in oldLocalizations.');
  }

  return newLocalizations;
};

/**
 * Export instance
 */

module.exports = new Merger;

/**
 * Export constructor
 */

module.exports.Merger = Merger;

