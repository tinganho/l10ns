
var requireLocalizations = require('./output/all');
var ab = requireLocalizations('en-US');
var x = ab(
    'NEW_KEY'
);
console.log(ab('TEST', { test: 1260 }));
console.log(ab('CURRENCY', {
  price: {
    code: 'USD',
    amount: 0
  }
}))
