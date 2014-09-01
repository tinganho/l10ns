var requireLocale = require('./output/localizations')
  , l = requireLocale('en-US');

var localizations = {
  'locale1': l('INDEX1', {
    'choice variable1': 1,
    'plural variable2': 2
  })
};

console.log(localizations);
