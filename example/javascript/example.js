var requireLocale = require('./output/localizations')
  , l = requireLocale('en-US');

var localizations = {
  'locale1': l('INDEX1', {
    'files': { code: 'USD', value:9823749039.8},
    'people': 19898789797
  }),
  'local2': l('INDEX2', {
    'files': 10000,
    'people': 1
  })
};

console.log(localizations);
