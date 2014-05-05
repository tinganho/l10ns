
/**
 * Module dependencies
 */

require('terminal-colors');

/**
 * We have written a custom Log constructor, because we have a unique
 * log formating/styling for our logs. There is convinient functions like
 * log, error, success, warning.
 *
 * @constructor Log
 */

function Log() {
  this.space = ' ';
}

/**
 * We have hard brackets to represent log type. And it is outputted
 * before the message like `[TYPE] message`
 *
 * @param {String} type (ERR|SUCC|WARN)
 * @api private
 */

Log.prototype._brackets = function(type) {
  return '[' + type + ']';
};

/**
 * Error
 *
 * @param {String} message
 * @return {void}
 * @api public
 */

Log.prototype.error = function(message) {
  console.error(this._brackets('ERROR').red + this.space + message);
};

/**
 * Success
 *
 * @param {String} message
 * @return {void}
 * @api public
 */

Log.prototype.success = function(message) {
  console.log(this._brackets('SUCCESS').green + this.space + message);
};

/**
 * Warning
 *
 * @param {String} message
 * @return {void}
 * @api public
 */

Log.prototype.warn = function(message) {
  console.warn(this._brackets('WARNING').yellow + this.space + message);
};

/**
 * Normal log
 *
 * @param {String} message
 * @return {void}
 * @api public
 */

Log.prototype.log = function(message) {
  console.log(message);
};

/**
 * Export instance
 */

module.exports = new Log;
