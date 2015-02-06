
var package = require('../package.json');
var cmd = process.argv[2];
var Insight = require('anonymous-insight');
var insight = new Insight({
  trackingCode: 'UA-51369650-4',
  pkg: package
});

insight.track(cmd);
