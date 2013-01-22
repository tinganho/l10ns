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

    grunt.task.run('translate:compile');

    // setup here
    done();
  },
  'helper': function(test) {
    'use strict';

    var requirejs = require('requirejs');

    requirejs.config({
      baseUrl: __dirname,
      nodeRequire: require
    });

    var gt = requirejs('translations/output/en');

    // Compiling function

    // Testing of conditions
    test.equal(gt('grunt-translate can take more then two conditions', 2, 'Bert'), 'Hello people!', 'It can take more than two conditions');
    test.equal(gt('grunt-translate can take more then two conditions', 1, 'Bert'), 'Hello Bert!', 'If and else is working');
    test.ok(typeof gt('grunt-translate can have an if and else if and alse statements', 1, 'Bert') === 'string', 'Hello Bert!', 'If and elseif and else is working');

    // Update from source
    var json = grunt.file.readJSON('./test/translations/keys.json');
    test.ok(typeof json['hello-world'].vars !== 'undefined', 'Reading from source is working');


    test.done();
  }
};
