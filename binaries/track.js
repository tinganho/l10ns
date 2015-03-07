
var package = require('../package.json');
var cmd = process.argv[2];
var GAID = process.argv[3];
var Insight = require('anonymous-insight');
var insight = new Insight({
  trackingCode: process.env.L10NS_DEV || GAID || 'UA-51369650-4',
  pkg: package
});

insight.track(cmd);
