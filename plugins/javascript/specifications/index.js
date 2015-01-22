
require('../../../specifications/globals');

global.template = require('./templates/build/templates');

describe('Javascript Compiler', function() {
  require('./dateFormatCompilation');
  require('./sentenceCompilation');
  require('./variableCompilation');
  require('./formatNumberCompilation');
  require('./numberFormatCompilation');
  require('./currencyFormatCompilation');
  require('./pluralFormatCompilation');
  require('./selectOrdinalFormatCompilation');
});
