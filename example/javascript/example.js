var requireLocale = require('./output/all')
var l = requireLocale('en-US');

var localizations = {
  'locale1': l('INDEX1', {
    'floor': 1200
  })
};

console.log(localizations);


var l = require('./output/en-US');

console.log(l('INDEX1', {
  floor: 1200
}))
