
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

};

/**
 * Export instance
 */

module.exports = new Edit();

/**
 * Export constructor
 */

module.exports.Edit = Edit;
