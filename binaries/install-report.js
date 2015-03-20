
var qs = require('querystring');
var osName = require('os-name');
var pkg = require('../package.json');
var http = require('http');

function getRequestOptions(path) {
  var now = Date.now();

  var _qs = {
    v: 1, // GA Measurement Protocol API version
    t: 'pageview', // hit type
    aip: 1, // anonymize IP
    tid: 'UA-51369650-5',
    cid: Math.floor(Date.now() * Math.random()), // random UUID
    cd1: osName(),
    // GA custom dimension 2 = Node Version, scope = Session
    cd2: process.version,
    // GA custom dimension 3 = App Version, scope = Session (temp solution until refactored to work w/ GA app tracking)
    cd3: pkg.version,
    dp: path,
    qt: 0, // queue time - delta (ms) between now and track time
    z: now // cache busting, need to be last param sent
  };

  return {
    hostname: 'ssl.google-analytics.com',
    port: 80,
    path: '/collect',
    method: 'POST',
    // GA docs recommends body payload via POST instead of querystring via GET
    body: qs.stringify(_qs)
  }
}

var options = getRequestOptions('/install')
var req = http.request(options)
req.write(options.body);
req.end();


