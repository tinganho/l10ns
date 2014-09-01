var requireLocale = require('./output/localizations')
  , l = requireLocale('en-US');

var localizations = {
  'locale1': l('INDEX1', {
    'choice files': 1,
    'plural people': 1
  })
};

console.log(localizations);
