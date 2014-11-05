var requireLocalizations = require('./output/all')
var l = requireLocalizations('sv-SE');

var localizations = {
  'locale1': l('INDEX1', {
    'floor': 1200000
  })
};

console.log(l('INDEX1', {
  floor: 12000000
}))
