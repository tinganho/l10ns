
var requireLocalizations = require('./output/all');
var $trans = requireLocalizations('en-US');
var x = $trans(
    'NEW_KEY'
);
console.log($trans('TEST', { test: 1260 }));
console.log($trans('CURRENCY', {
  price: {
    code: 'USD',
    amount: 0
  }
}))
