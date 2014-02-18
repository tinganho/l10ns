
/**
 * Device function
 *
 * @param  {string} userAgent
 *
 * @return {string} (android-web|ios-web|web)
 */

module.exports = function(req) {
  var userAgent = req.headers['user-agent'];

  if(req.param('device') === 'android') {
    return 'android-webview';
  }
  else if(userAgent.toLowerCase().indexOf('android') > -1) {
    return 'android-web';
  }
  else if(/(iPad|iPhone|iPod)/g.test(userAgent)) {
    return 'ios-web';
  }
  else {
    return 'web';
  }
};
