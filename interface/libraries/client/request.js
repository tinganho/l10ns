
define([

  'superagent'

], function(

  request

) {

  /**
   * We wrap all state changing request with a custom X-Reuested-By
   * header to prevent CSRF attacks. We also set a timeout
   *
   * More info: http://www.adambarth.com/papers/2008/barth-jackson-mitchell-b.pdf
   */

  function getRequestObject(method, url, data, callback) {
    var req = request(method, url);
    req.set('X-Requested-By', cf.X_REQUESTED_BY);
    req.timeout(cf.AJAX_TIMEOUT);
    if ('function' == typeof data) callback = data, data = null;
    if (data) req.send(data);
    if (callback) req.end(callback);
    return req;
  };

  /**
   * Overrides Request#get
   *
   * @param {String} url
   * @param {=Object} data
   * @param {=Function} callback
   * @return {Request}
   * @override Request#post
   */

  request.get = function(url, data, callback) {
    return getRequestObject('GET', url, data, callback);
  };

  /**
   * Overrides Request#post
   *
   * @param {String} url
   * @param {=Object} data
   * @param {=Function} callback
   * @return {Request}
   * @override Request#post
   */

  request.post = function(url, data, callback) {
    return getRequestObject('POST', url, data, callback);
  };

  /**
   * Overrides Request#put
   *
   * @param {String} url
   * @param {=Object} data
   * @param {=Function} callback
   * @return {Request}
   * @override Request#put
   */

  request.put = function(url, data, callback) {
    return getRequestObject('PUT', url, data, callback);
  };

  /**
   * Overrides Request#patch
   *
   * @param {String} url
   * @param {=Object} data
   * @param {=Function} callback
   * @return {Request}
   * @override Request#patch
   */

  request.patch = function(url, data, callback) {
    return getRequestObject('PATCH', url, data, callback);
  };

  /**
   * Overrides Request#head
   *
   * @param {String} url
   * @param {=Object} data
   * @param {=Function} callback
   * @return {Request}
   * @override Request#head
   */

  request.head = function(url, data, callback) {
    return getRequestObject('HEAD', url, data, callback);
  };

  /**
   * Overrides Request#del
   *
   * @param {String} url
   * @param {=Object} data
   * @param {=Function} callback
   * @return {Request}
   * @override Request#del
   */

  request.delete = function(url, data, callback) {
    return getRequestObject('DELETE', url, data, callback);
  };

  /**
   * Export instance
   */

  return request;

});
