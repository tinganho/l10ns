
/**
 * Module dependencies
 */

var file = require('./file');

/**
 * Get translations execute edit functions for editing the current
 * translations. This constructor provides methods for editing
 * translations.
 *
 * @constructor Edit
 */

function Edit() {
  this.defaultLocale = cf.defaultLocale;
}

/**
 * Edit current translations
 *
 * @param {String} ref
 * @param {String} value
 * @param {String} locale
 * @return {void}
 * @api public
 */

Edit.prototype.edit = function(ref, value, locale) {
  var key = this._getKey(ref);
};

/**
 * Get key
 *
 * @param {String} ref
 * @return {String}
 * @api public
 */

Edit.prototype._getKey = function(ref) {
  var key = ref;
  if(/^\-\d+$/.test(ref)) {
    key = this._getKeyFromLatestTranslations(parseInt(ref, 10));
  }
  else if(/^@\d+$/.test(ref)) {
    var ref = /^@(\d+)$/.exec(ref)[1];
    key = this._getKeyFromLatestSearch(ref);
  }

  return key;
};

/**
 * Get key from latest search
 *
 * @param {Number} ref
 * @return {String}
 * @api private
 */

Edit.prototype._getKeyFromLatestSearch = function(ref) {

};

/**
 * Get key from latest translations
 *
 * @param {Number} ref
 * @return {String}
 * @api private
 */

Edit.prototype._getKeyFromLatestTranslations = function(ref) {
  var translations = file.readTranslations();
};

/**
 * Export instance
 */

module.exports = new Edit();

/**
 * Export constructor
 */

module.exports.Edit = Edit;
