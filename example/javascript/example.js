var requireLocalizations = require('./output/all')
var l = requireLocalizations('sv-SE');

var localizations = {
  'locale1': l('INDEX1', {
    floor: {
      time: new Date('2014-11-25'),
      toTimezone: 'America/Los_Angeles'
    }
  })
};

console.log(localizations.locale1)
