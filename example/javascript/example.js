var requireLocale = require('./output/localizations')
  , l = requireLocale('en-US');

var localizations = {
  'locale1': l('INDEX1', {
    'floor': 0
  }),
  'locale2': l('INDEX2', {
    'floor': 0
  })
};

console.log(localizations);
