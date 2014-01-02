
/**
 * @fileoverview Merge class is responsible for merging all new translations
 * with old translations
 */

/**
 * Module dependencies.
 */

var Hashids = require('hashids')
  , hashids = new Hashids(pcf.TRANSLATION_ID_HASH_SECRET, pcf.TRANSLATION_ID_CHAR_LENGTH);


function Merger() {
  this.counter = 0;
}

/**
 * Merge timestamps
 *
 * @param {Object} newTranslations
 * @param {Object} oldTranslations
 * @param {String} key
 *
 * @return {Object}
 * @public
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
 *
 * @return {void}
 */

Merger.prototype.mergeId = function(newTranslations, oldTranslations, key) {
  var now = parseInt(Date.now() / 1000, 10);
  if(key in oldTranslations && 'id' in oldTranslations[key]) {
    if(oldTranslations[key].id.length < 15) {
      newTranslations[key].id = hashids.encrypt(now, this.counter);
    }
    else {
      newTranslations[key].id = oldTranslations[key].id;
    }
  }
  else {
    newTranslations[key]._new = true;
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
 *
 * @return {Object}
 * @public
 */

Merger.prototype.mergeTranslations = function(newTranslations, oldTranslations, key) {
  if(key in oldTranslations && 'value' in oldTranslations[key]) {
    newTranslations[key].value = oldTranslations[key].value;
    newTranslations[key].text = key;
  }
  else {
    newTranslations[key].value = [];
    newTranslations[key].text = key;
  }

  return newTranslations;
};

/**
 * Export API
 */

module.exports = new Merger;

