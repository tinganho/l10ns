
var glob = require('glob')
  , path = require('path');

/**
 * Get paths of different resources depending on environment
 *
 * @constructor Path
 */

function Path() {
  this._modernizr;
  this._requirejs;
}

/**
 * Get path to requirejs resouce files
 *
 * @return {String}
 * @api public
 */

Path.prototype.requirejs = function() {
  if(this._requirejs) return this._requirejs;

  var prodPath = glob.sync('/vendor/requirejs/build/*.js', { root : path.join(__dirname, '../') })
    , devPath ='/vendor/requirejs/require.js'

  this._requirejs = (process.env.NODE_ENV === 'development' || !prodPath.length) ? devPath : prodPath[0];

  return this._requirejs;
};

/**
 * Get path to modernizr resource file
 *
 * @return {String}
 * @api public
 */

Path.prototype.modernizr = function() {
  if(this._modernizr) return this._modernizr;

  var prodPath = glob.sync('/vendor/modernizr/build/*.js', { root : path.join(__dirname, '../') })
    , devPath ='/vendor/modernizr/modernizr.js'

  this._modernizr = (process.env.NODE_ENV === 'development' || !prodPath.length) ? devPath : prodPath[0];

  return this._modernizr;
};

/**
 *
 */

module.exports = new Path;
