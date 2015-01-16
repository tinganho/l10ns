
require('../../../specifications/globals');

global.template = require('./templates/build/templates');

describe('Javascript Compiler', function() {
  require('./dateFormatCompilation');
  require('./sentenceCompilation');
  require('./variableCompilation');
});
