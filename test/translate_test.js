var grunt = require('grunt'),
    fs    = require('fs');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['grunt-translate'] = {
  setUp: function(done) {
    'use strict';

    // setup here
    done();
  },
  test1: function(test) {
    'use strict';

    var requirejs = require('requirejs');

    requirejs.config({
      baseUrl: __dirname,
      nodeRequire: require
    });

    var gt = requirejs('translations/output/en');

    // Compiling function

    // if, elseif, else And only string
    test.equal(gt('It can have an if and else statement', {number: 3}), 'Number is 3', 'It can have an if and else statement');
    test.equal(gt('It can have an if and else statement', {number: 1}), 'Number is smaller than 2', 'It can have an if and else statement');
    test.equal(gt('It can have an if and else if and else statements', {number: 3}), 'Number is exactly 3', 'It can have an if and else if and else statements');
    test.equal(gt('It can have only one string', { world: 'world'}), 'Hello world!','It can have only one string');

    test.equal(gt('It can take && in if statement', { firstname: 'Tingan', lastname: 'Ho'}), 'Hello Tingan Ho!', 'It can take && in if statement');
    test.equal(gt('It can take || in if statement', { firstname: 'Tingan', lastname: 'Ho'}), 'Hello Tingan Ho!', 'It can take || in if statement');
    test.equal(gt('It can take several && in if statement', { firstname: 'Tingan', lastname: 'Ho'}), 'Hello Tingan Ho!', 'It can take several && in if statement');
    test.equal(gt('It can take several || in if statement', { firstname: 'Tingan', lastname: 'Ho'}), 'Hello Tingan Ho!', 'It can take several && in if statement');

    test.done();
  }
};
