var requireLocalizations = require('./output/all')
var l = requireLocalizations('en-US');

var localizations = {
  'locale1': l('INDEX1', {
    floor: {
      time: new Date(),
      toTimezone: 'America/Los_Angeles'
    }
  })
};

console.log(localizations.locale1)
