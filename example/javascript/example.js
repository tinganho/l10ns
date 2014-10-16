var requireLocale = require('./output/localizations')
  , l = requireLocale('en-US');

var localizations = {
  'locale1': l('INDEX1', {
    'floor': {
      code: 'USD',
      amount: 1200
    }
  })
};

console.log(localizations);
