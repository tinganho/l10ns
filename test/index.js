

// Sets global vars pcf and cf
require('../bin/gt');

require('./test-update')();
require('./test-log')();
require('./test-file')();
require('./test-parser')();
require('./test-syntax')();

// Compilers
require('./test-js-compiler')();
