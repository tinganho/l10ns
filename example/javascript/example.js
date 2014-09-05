var requireLocale = require('./output/localizations')
  , l = requireLocale('en-US');

var localizations = {
  'locale1': l('INDEX1', {
    'files': 1,
    'people': 1
  })
};

console.log(localizations);
