
var requireLocalizations = require('./output/all');
var l = requireLocalizations('en-US');
console.log(l('TEST', { test: 1260 }));
