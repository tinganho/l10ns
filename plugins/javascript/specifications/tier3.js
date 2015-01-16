
require('../../../specifications/globals');

global.template = require('./templates/build/templates');

describe('Javascript Compiler', function() {
  require('./currencyFormatCompilation');
  require('./pluralFormatCompilation');
  require('./selectOrdinalFormatCompilation');
});
