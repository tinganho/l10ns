var requireLocale = require('./output/localizations')
  , l = requireLocale('en-US');

var localizations = {
  'local2': l('INDEXA', {
    'files': 10000,
    'people': 1
  }),
  'locale1': l('INDEX1', {
    'files': 10000,
    'people': 1
  }),
  'local2': l('INDEX2', {
    'files': 10000,
    'people': 1
  })
};

console.log(localizations);
