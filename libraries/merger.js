
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
 * @param {Object} newTranslations
 * @param {Object} oldTranslations
 * @param {String} key
 * @return {Object}
 * @api public
 */

Merger.prototype.mergeTimeStamp = function(newTranslations, oldTranslations, key) {
  var now = Date.now();

  if(key in oldTranslations && 'timestamp' in oldTranslations[key]) {
    newTranslations[key].timestamp = oldTranslations[key].timestamp;
  }
  else {
    newTranslations[key].timestamp = now;
  }

  return newTranslations;
};

/**
 * Merge id
 *
 * @param {Object} newTranslations
 * @param {Object} oldTranslations
 * @param {String} key
 * @return {void}
 * @api public
 */

Merger.prototype.mergeId = function(newTranslations, oldTranslations, key) {
  var now = parseInt(Date.now() / 1000, 10);
  if(key in oldTranslations && 'id' in oldTranslations[key]) {
    newTranslations[key].new = false;
    newTranslations[key].id = oldTranslations[key].id;
  }
  else {
    newTranslations[key].new = true;
    newTranslations[key].id = hashids.encrypt(now, this.counter);
  }
  this.counter++;

  return newTranslations;
};

/**
 * Merge translations
 *
 * @param {Object} newTranslations
 * @param {Object} oldTranslations
 * @param {String} key
 * @return {Object}
 * @api public
 */

Merger.prototype.mergeTranslations = function(newTranslations, oldTranslations, key) {
  if(key in oldTranslations && 'values' in oldTranslations[key]) {
    newTranslations[key].values = oldTranslations[key].values;
    newTranslations[key].text = oldTranslations[key].text;
  }
  else {
    throw new TypeError('Key does not exits in oldTranslations.');
  }

  return newTranslations;
};

/**
 * Export instance
 */

module.exports = new Merger;

/**
 * Export constructor
 */

module.exports.Merger = Merger;

