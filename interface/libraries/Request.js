
/**
 * Module dependenices.
 */

var request = require('superagent');

/**
 * Request
 *
 * @constructor Request
 */

function Request(origin) {
  this.origin = origin;
  this.authorization;
}

/**
 * Set `Authroization header
 *
 *   Example:
 *
 *     this
 *       .setAuthorization('oweijfoiwjefio')
 *       .post('activation/token')
 *       .end(function() {
 *
 *       })
 * @param {String} authorization
 *
 * @return {Request}
 * @api public
 */

Request.prototype.setAccessToken = function(accessToken) {
  this.authorization = 'Bearer ' + accessToken;
  return this;
};

/**
 * Set Authroization header
 *
 *   Example:
 *
 *     this
 *       .setAuthorization('oweijfoiwjefio')
 *       .post('activation/token')
 *       .end(function() {
 *
 *       })
 * @param {String} authorization
 *
 * @return {Request}
 * @api public
 */

Request.prototype.setAuthorization = function(authorization) {
  this.authorization = authorization;
  return this;
};

/**
 * Set `Content Type` header
 *
 *   Example:
 *
 *     this
 *       .setContentType('application/json')
 *       .post('activation/token')
 *       .end(function() {
 *
 *       })
 * @param {String} authorization
 *
 * @return {Request}
 * @api public
 */

Request.prototype.setContentType = function(contentType) {
  this.contentType = contentType;
  return this;
};

/**
 * Get the request object with proper method
 *
 * @param {String} (get|post|put|patch)
 *
 * @return {Request}
 * @api private
 */

Request.prototype._getReqestObject = function(method, url) {
  url = /^http/.test(url) ? url : this.origin + url;

  var req = request[method](url);

  if(this.authorization !== false) {
    req.set('Authorization', (this.authorization || cf.AUTHORIZATION) + '');
  }

  this.authorization = null;

  return req
    .set('User-Agent', cf.DEFAULT_WEB_SERVER_USER_AGENT)
    .set('Content-Type', this.contentType || cf.DEFAULT_CONTENT_TYPE)
    .set('Accept', '*/*');
};

/**
 * Issue a new GET request.
 *
 *   Example:
 *
 *     this
 *       .get('activation/token')
 *       .end(function() {
 *
 *       })
 *
 * @return {Request}
 * @api public
 */

Request.prototype.get = function(url) {
  return this._getReqestObject('get', url);
};

/**
 * Issue a new POST request.
 *
 *   Example:
 *
 *     this
 *       .post('/activation/token')
 *       .end(function() {
 *
 *       })
 *
 * @param path {String}
 * @param type {String}, Optional and should be the URL for an API
 *
 * @return {Request}
 * @api public
 */

Request.prototype.post = function(url) {
  return this._getReqestObject('post', url);
};

/**
 * Issue a new PUT request.
 *
 *   Example:
 *
 *     this
 *       .put('activation/token')
 *       .end(function() {
 *
 *       })
 *
 * @return {Request}
 * @api public
 */

Request.prototype.put = function(url) {
  return this._getReqestObject('put', url);
};

/**
 * Issue a new PATCH request.
 *
 *   Example:
 *
 *     this
 *       .patch('activation/token')
 *       .end(function() {
 *
 *       })
 *
 * @return {Request}
 * @api public
 */

Request.prototype.patch = function(url) {
  return this._getReqestObject('patch', url);
};

/**
 * Issue a new DELETE request.
 *
 *   Example:
 *
 *     this
 *       .del('activation/token')
 *       .end(function() {
 *
 *       })
 *
 * @return {Request}
 * @api public
 */

Request.prototype.delete = function(url) {
  return this._getReqestObject('del', url);
};

/**
 * Issue a new HEAD request.
 *
 *   Example:
 *
 *     this
 *       .head('activation/token')
 *       .end(function() {
 *
 *       })
 *
 * @return {Request}
 * @api public
 */

Request.prototype.head = function(url) {
  return this._getReqestObject('head', url);
};

/**
 * Exports `Request` constructor
 */

module.exports.Requst = Request;
