
/**
 * Moduel dependencies
 */

var express = require('express')
  , app = express();

/**
 * To prevent JSON hijacking, we prepend something that throws
 * en error on JS. Because of performance we don't want to write
 * a middleware that extends the response object. That would mean
 * that every request needs an extension. Instead of extending
 * on every HTTP request we can just extend it once after the
 * express app is instantiated.
 *
 * @param {Object} obj
 * @return {ExpressApp}
 * @api public
 */

app.response.__proto__.json = function(obj){
  // allow status / body
  if (2 == arguments.length) {
    // res.json(body, status) backwards compat
    if ('number' == typeof arguments[1]) {
      this.statusCode = arguments[1];
    } else {
      this.statusCode = obj;
      obj = arguments[1];
    }
  }

  // settings
  var app = this.app;
  var replacer = app.get('json replacer');
  var spaces = app.get('json spaces');
  var body = cf.JSON_HIJACK_PREFIX + JSON.stringify(obj, replacer, spaces);

  // content-type
  this.charset = this.charset || 'utf-8';
  this.get('Content-Type') || this.set('Content-Type', 'text/plain');

  return this.send(body);
};

/**
 * Export instance
 */

module.exports = app;
