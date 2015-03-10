
var pkg = require('../package.json');
var Insight = require('anonymous-insight');
var insight = new Insight({
  trackingCode: 'UA-51369650-5',
  pkg: pkg
});

insight.track('install');
