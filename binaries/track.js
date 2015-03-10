
var pkg = require('../package.json');
var cmd = process.argv[2];
var Insight = require('anonymous-insight');
var insight = new Insight({
  trackingCode: process.env.L10NS_DEV || 'UA-51369650-4',
  pkg: pkg
});

insight.track(cmd);
