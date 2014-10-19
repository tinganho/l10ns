var requireLocale = require('./output/localizations')
  , l = requireLocale('en-US');

var localizations = {
  'locale1': l('INDEX1', {
    'floor': 1200
  })
};

console.log(localizations);
