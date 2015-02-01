
var dateTemplates = require('../templates/build/templates');
var timezones = require('../../../IANA/latest');
var temporaryTimezones = {};
for(var i in project.timezones) {
  var timezone = project.timezones[i];
  temporaryTimezones[timezone] = timezones[timezone];
}
timezones = temporaryTimezones;

var setDateBlock = 'var string = \'\';\n' + dateTemplates['SetDateBlock']({
  variableName: 'variable1'
}) + '\n';

var getDateTestFunction = function() {
  var timezonesBlock = 'var timezones = ' + JSON.stringify(timezones) + '\n';
  var setDateBlock = dateTemplates['SetDateBlock']({
    variableName: 'test'
  });
  return 'function test(it) {\n' +
    'this.__timezones = true;\n' +
    timezonesBlock + setDateBlock + '\n' +
    'return {\n' +
      'year: date.getFullYear(),\n' +
      'month: date.getMonth(),\n' +
      'date: date.getDate(),\n' +
      'hours: date.getHours(),\n' +
      'minutes: date.getMinutes(),\n' +
      'seconds: date.getSeconds(),\n' +
      'milliseconds: date.getMilliseconds(),\n' +
      'offset: timezoneOffset\n' +
    '}' +
  '}';
};

eval(getDateTestFunction());

describe('DateFormat', function() {
  describe('SetDate Block', function() {
    it('should throw an error if \'timezone\' property is not defined', function() {
      var date = new Date('2014-11-25T02:59:59+0200');
      var method = function() {
        test({
          test: {
            time: date
          }
        });
      }
      expect(method).to.throw(TypeError, 'You must define a \'timezone\' property for test');
    });

    it('should throw an error if \'timezone\' does not match any timezone', function() {
      var date = new Date('2014-10-25T02:59:59+0200');
      var method = function() {
        test({
          test: {
            time: date,
            timezone: 'None'
          }
        });
      }
      expect(method).to.throw(TypeError, 'Timezone \'None\' is not defined. Please define it in your l10ns.json file.');
    });

    it('should throw an error if a time property is not defined', function() {
      var method = function() {
        test({
          test: {
            timezone: 'Europe/Stockholm'
          }
        });
      }
      expect(method).to.throw(TypeError, 'You must define a time property for test');
    });

    it('should throw an error if a time property is not of type Date', function() {
      var method = function() {
        test({
          test: {
            time: 'non-date',
            timezone: 'Europe/Stockholm'
          }
        });
      }
      expect(method).to.throw(TypeError, 'Property time must be of type Date.');
    });

    it('should throw an error if a time property is not of type Date', function() {
      var method = function() {
        test({
          test: {
            time: 'non-date',
            timezone: 'Europe/Stockholm'
          }
        });
      }
      expect(method).to.throw(TypeError, 'Property time must be of type Date.');
    });

    it('should be able to output currect hours during same day', function() {
      var date = new Date('2014-12-18T20:00:00+0100');
      expect(test({
          test: {
            time: date,
            timezone: 'America/Los_Angeles'
          }
        }).hours).to.equal(11);
    });

    it('should be able to output correct hours during same day', function() {
      var date = new Date('2014-12-18T08:00:00+0100');
      var result = test({
        test: {
          time: date,
          timezone: 'America/Los_Angeles'
        }
      });
      expect(result.hours).to.equal(23);
      expect(result.date).to.equal(17);
    });

    it('should be able to recognize daylight saving time and standard time', function() {
      var date = new Date('2014-11-02T08:59:59Z');
      var result = test({
        test: {
          time: date,
          timezone: 'America/Los_Angeles'
        }
      });
      expect(result.hours).to.equal(1);
      expect(result.minutes).to.equal(59);
      expect(result.seconds).to.equal(59);
      var date = new Date('2014-11-02T09:00:00Z');
      var result = test({
        test: {
          time: date,
          timezone: 'America/Los_Angeles'
        }
      });
      expect(result.hours).to.equal(1);
      expect(result.minutes).to.equal(0);
      expect(result.seconds).to.equal(0);
    });

    it('should set to standard time if the time is not between the span of IANA', function() {
      var date = new Date(0);
      var result = test({
        test: {
          time: date,
          timezone: 'America/Los_Angeles'
        }
      });
      expect(result.offset).to.equal(-420);
      var date = new Date(1000000000000000);
      var result = test({
        test: {
          time: date,
          timezone: 'America/Los_Angeles'
        }
      });
      expect(result.offset).to.equal(-420);
    });
  });

  describe('Sentence', function() {
    it('should be able to compile a sentence', function(done) {
      var localizations = getLocalizations('{variable1, date, \'test\'}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);
      compiler.run();

      eventually(function() {
        var functionBody = setDateBlock +
          'dateString += \'test\';\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });
  });

  describe('Era', function() {
    it('should be able to compile an abbreviated era', function(done) {
      var localizations = getLocalizations('{variable1, date, G}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'if(date.getFullYear() >= 0) {\n' +
          '  dateString += \'AD\';\n' +
          '}\n' +
          'else {\n' +
          '  dateString += \'BC\';\n' +
          '}\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a full era', function(done) {
      var localizations = getLocalizations('{variable1, date, GGGG}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'if(date.getFullYear() >= 0) {\n' +
          '  dateString += \'Anno Domini\';\n' +
          '}\n' +
          'else {\n' +
          '  dateString += \'Before Christ\';\n' +
          '}\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a narrow era', function(done) {
      var localizations = getLocalizations('{variable1, date, GGGGG}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'if(date.getFullYear() >= 0) {\n' +
          '  dateString += \'A\';\n' +
          '}\n' +
          'else {\n' +
          '  dateString += \'B\';\n' +
          '}\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });
  });

  describe('Year', function() {
    it('should be able to compile a calendar year of length 1', function(done) {
      var localizations = getLocalizations('{variable1, date, y}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var year = date.getFullYear() + \'\';\n' +
          'var yearString = \'\';\n' +
          'if(year.length >= 1) {\n' +
          '  yearString = year;\n' +
          '}\n' +
          'else {\n' +
          '  var difference = 1 - year.length;\n' +
          '  for(var i = 0; i < difference; i++) {\n' +
          '    yearString += \'0\';\n' +
          '  }\n' +
          '  yearString += year;\n' +
          '}\n' +
          'dateString += yearString;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a calendar year of length 2', function(done) {
      var localizations = getLocalizations('{variable1, date, yy}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var year = date.getFullYear() + \'\';\n' +
          'var yearString = \'\';\n' +
          'if(year.length < 2) {\n' +
          '  yearString += \'0\' + year;\n' +
          '}\n' +
          'else {\n' +
          '  yearString += year.substring(year.length - 2, year.length);\n' +
          '}\n' +
          'dateString += yearString;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a calendar year of length bigger than 2', function(done) {
      var localizations = getLocalizations('{variable1, date, yyyy}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var year = date.getFullYear() + \'\';\n' +
          'var yearString = \'\';\n' +
          'if(year.length >= 4) {\n' +
          '  yearString = year;\n' +
          '}\n' +
          'else {\n' +
          '  var difference = 4 - year.length;\n' +
          '  for(var i = 0; i < difference; i++) {\n' +
          '    yearString += \'0\';\n' +
          '  }\n' +
          '  yearString += year;\n' +
          '}\n' +
          'dateString += yearString;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a week based year of length 1', function(done) {
      var localizations = getLocalizations('{variable1, date, Y}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          dateTemplates['DateWeekBasedYear']({ startOfWeek: 0 }) + '\n' +
          dateTemplates['FormatYear']({ length: 1 }) + '\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a week based year of length 2', function(done) {
      var localizations = getLocalizations('{variable1, date, YY}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          dateTemplates['DateWeekBasedYear']({ startOfWeek: 0 }) + '\n' +
          dateTemplates['FormatYear']({ length: 2 }) + '\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a week based year of length bigger than 2', function(done) {
      var localizations = getLocalizations('{variable1, date, YYY}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          dateTemplates['DateWeekBasedYear']({ startOfWeek: 0 }) + '\n' +
          dateTemplates['FormatYear']({ length: 3 }) + '\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('week based year block should set week based year with start week monday correctly', function() {
      var function_ = 'function test_weekBasedYearBlock(it) {\n' +
        'var dateString = \'\';\n' +
        dateTemplates['SetDateBlock']({
          variableName: 'date'
        }) + '\n' +
        dateTemplates['DateWeekBasedYear']({ startOfWeek: 0 }) + '\n' +
        dateTemplates['FormatYear']({ length: 3 }) + '\n' +
        'return dateString; }';
        eval(function_);
      expect(test_weekBasedYearBlock({ date: new Date('2005-1-1') })).to.equal('2004');
      expect(test_weekBasedYearBlock({ date: new Date('2005-1-2') })).to.equal('2004');
      expect(test_weekBasedYearBlock({ date: new Date('2005-1-3') })).to.equal('2005');
      expect(test_weekBasedYearBlock({ date: new Date('2005-12-31') })).to.equal('2005');
      expect(test_weekBasedYearBlock({ date: new Date('2006-1-1') })).to.equal('2005');
      expect(test_weekBasedYearBlock({ date: new Date('2006-1-2') })).to.equal('2006');
      expect(test_weekBasedYearBlock({ date: new Date('2007-1-1') })).to.equal('2007');
      expect(test_weekBasedYearBlock({ date: new Date('2007-12-30') })).to.equal('2007');
      expect(test_weekBasedYearBlock({ date: new Date('2007-12-31') })).to.equal('2008');
      expect(test_weekBasedYearBlock({ date: new Date('2008-01-01') })).to.equal('2008');
      expect(test_weekBasedYearBlock({ date: new Date('2008-12-28') })).to.equal('2008');
      expect(test_weekBasedYearBlock({ date: new Date('2008-12-29') })).to.equal('2009');
      expect(test_weekBasedYearBlock({ date: new Date('2008-12-30') })).to.equal('2009');
      expect(test_weekBasedYearBlock({ date: new Date('2008-12-31') })).to.equal('2009');
      expect(test_weekBasedYearBlock({ date: new Date('2009-01-01') })).to.equal('2009');
      expect(test_weekBasedYearBlock({ date: new Date('2010-01-01') })).to.equal('2009');
      expect(test_weekBasedYearBlock({ date: new Date('2010-01-02') })).to.equal('2009');
      expect(test_weekBasedYearBlock({ date: new Date('2010-01-03') })).to.equal('2009');
      expect(test_weekBasedYearBlock({ date: new Date('2010-01-04') })).to.equal('2010');
    });

    it('week based year block should set week based year with start week sunday correctly', function() {
      var function_ = 'function test_weekBasedYearBlock(it) {\n' +
        'var dateString = \'\';\n' +
        dateTemplates['SetDateBlock']({
          variableName: 'date'
        }) + '\n' +
        dateTemplates['DateWeekBasedYear']({ startOfWeek: 1 }) + '\n' +
        dateTemplates['FormatYear']({ length: 3 }) + '\n' +
        'return dateString; }';
        eval(function_);
      expect(test_weekBasedYearBlock({ date: new Date('2009-1-1') })).to.equal('2008');
      expect(test_weekBasedYearBlock({ date: new Date('2009-1-2') })).to.equal('2008');
      expect(test_weekBasedYearBlock({ date: new Date('2009-1-3') })).to.equal('2008');
      expect(test_weekBasedYearBlock({ date: new Date('2009-1-4') })).to.equal('2009');
      expect(test_weekBasedYearBlock({ date: new Date('2012-12-29') })).to.equal('2012');
      expect(test_weekBasedYearBlock({ date: new Date('2012-12-30') })).to.equal('2013');
      expect(test_weekBasedYearBlock({ date: new Date('2012-12-31') })).to.equal('2013');
    });

    it('format year block of length 1 should format without padding', function() {
      var function_ = 'function test_formatYearBlock() {\n' +
        'var dateString = \'\';\n' +
        'var year = \'208\';\n' +
        dateTemplates['FormatYear']({ length: 1 }) + '\n' +
        'return dateString; }';
        eval(function_);
      expect(test_formatYearBlock()).to.equal('208');
    });

    it('format year block should pad with zero whenever minimum length is not met', function() {
      var function_ = 'function test_formatYearBlock() {\n' +
        'var dateString = \'\';\n' +
        'var year = \'8\';\n' +
        dateTemplates['FormatYear']({ length: 2 }) + '\n' +
        'return dateString; }';
        eval(function_);
      expect(test_formatYearBlock()).to.equal('08');
    });

    it('format year block of length 2 should add padding with zero', function() {
      var function_ = 'function test_formatYearBlock() {\n' +
        'var dateString = \'\';\n' +
        'var year = \'8\';\n' +
        dateTemplates['FormatYear']({ length: 2 }) + '\n' +
        'return dateString; }';
        eval(function_);
      expect(test_formatYearBlock()).to.equal('08');
    });

    it('format year block of length 2 should truncate year string', function() {
      var function_ = 'function test_formatYearBlock() {\n' +
        'var dateString = \'\';\n' +
        'var year = \'2008\';\n' +
        dateTemplates['FormatYear']({ length: 2 }) + '\n' +
        'return dateString; }';
        eval(function_);
      expect(test_formatYearBlock()).to.equal('08');
    });
  });

  describe('Quarter', function() {
    beforeEach(function(done){
      setTimeout(done, 0);
    });

    it('should be able to compile a formated numeric quarter', function(done) {
      var localizations = getLocalizations('{variable1, date, Q}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var quarter = Math.floor(date.getMonth() / 3);\n' +
          'var quarterStrings = [\n' +
          '  \'1\',\n' +
          '  \'2\',\n' +
          '  \'3\',\n' +
          '  \'4\'\n' +
          '];\n' +
          'dateString += quarterStrings[quarter];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a formated numeric with padding quarter', function(done) {
      var localizations = getLocalizations('{variable1, date, QQ}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var quarter = Math.floor(date.getMonth() / 3);\n' +
          'var quarterStrings = [\n' +
          '  \'01\',\n' +
          '  \'02\',\n' +
          '  \'03\',\n' +
          '  \'04\'\n' +
          '];\n' +
          'dateString += quarterStrings[quarter];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a formated abbreviated quarter', function(done) {
      var localizations = getLocalizations('{variable1, date, QQQ}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var quarter = Math.floor(date.getMonth() / 3);\n' +
          'var quarterStrings = [\n' +
          '  \'Q1\',\n' +
          '  \'Q2\',\n' +
          '  \'Q3\',\n' +
          '  \'Q4\'\n' +
          '];\n' +
          'dateString += quarterStrings[quarter];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a formated wide quarter', function(done) {
      var localizations = getLocalizations('{variable1, date, QQQQ}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var quarter = Math.floor(date.getMonth() / 3);\n' +
          'var quarterStrings = [\n' +
          '  \'1st quarter\',\n' +
          '  \'2nd quarter\',\n' +
          '  \'3rd quarter\',\n' +
          '  \'4th quarter\'\n' +
          '];\n' +
          'dateString += quarterStrings[quarter];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });


    it('should be able to compile a stand-alone numeric quarter', function(done) {
      var localizations = getLocalizations('{variable1, date, q}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var quarter = Math.floor(date.getMonth() / 3);\n' +
          'var quarterStrings = [\n' +
          '  \'1\',\n' +
          '  \'2\',\n' +
          '  \'3\',\n' +
          '  \'4\'\n' +
          '];\n' +
          'dateString += quarterStrings[quarter];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone numeric with padding quarter', function(done) {
      var localizations = getLocalizations('{variable1, date, qq}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var quarter = Math.floor(date.getMonth() / 3);\n' +
          'var quarterStrings = [\n' +
          '  \'01\',\n' +
          '  \'02\',\n' +
          '  \'03\',\n' +
          '  \'04\'\n' +
          '];\n' +
          'dateString += quarterStrings[quarter];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone abbreviated quarter', function(done) {
      var localizations = getLocalizations('{variable1, date, qqq}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var quarter = Math.floor(date.getMonth() / 3);\n' +
          'var quarterStrings = [\n' +
          '  \'Q1\',\n' +
          '  \'Q2\',\n' +
          '  \'Q3\',\n' +
          '  \'Q4\'\n' +
          '];\n' +
          'dateString += quarterStrings[quarter];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone wider quarter', function(done) {
      var localizations = getLocalizations('{variable1, date, qqqq}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var quarter = Math.floor(date.getMonth() / 3);\n' +
          'var quarterStrings = [\n' +
          '  \'1st quarter\',\n' +
          '  \'2nd quarter\',\n' +
          '  \'3rd quarter\',\n' +
          '  \'4th quarter\'\n' +
          '];\n' +
          'dateString += quarterStrings[quarter];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });
  });

  describe('Months', function() {
    it('should be able to compile a formated numeric month', function(done) {
      var localizations = getLocalizations('{variable1, date, M}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var month = date.getMonth();\n' +
          'var monthStrings = [\n' +
          '  \'1\',\n' +
          '  \'2\',\n' +
          '  \'3\',\n' +
          '  \'4\',\n' +
          '  \'5\',\n' +
          '  \'6\',\n' +
          '  \'7\',\n' +
          '  \'8\',\n' +
          '  \'9\',\n' +
          '  \'10\',\n' +
          '  \'11\',\n' +
          '  \'12\'\n' +
          '];\n' +
          'dateString += monthStrings[month];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a formated numeric with padding month', function(done) {
      var localizations = getLocalizations('{variable1, date, MM}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var month = date.getMonth();\n' +
          'var monthStrings = [\n' +
          '  \'01\',\n' +
          '  \'02\',\n' +
          '  \'03\',\n' +
          '  \'04\',\n' +
          '  \'05\',\n' +
          '  \'06\',\n' +
          '  \'07\',\n' +
          '  \'08\',\n' +
          '  \'09\',\n' +
          '  \'10\',\n' +
          '  \'11\',\n' +
          '  \'12\'\n' +
          '];\n' +
          'dateString += monthStrings[month];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a formated abbreviated month', function(done) {
      var localizations = getLocalizations('{variable1, date, MMM}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var month = date.getMonth();\n' +
          'var monthStrings = [\n' +
          '  \'Jan\',\n' +
          '  \'Feb\',\n' +
          '  \'Mar\',\n' +
          '  \'Apr\',\n' +
          '  \'May\',\n' +
          '  \'Jun\',\n' +
          '  \'Jul\',\n' +
          '  \'Aug\',\n' +
          '  \'Sep\',\n' +
          '  \'Oct\',\n' +
          '  \'Nov\',\n' +
          '  \'Dec\'\n' +
          '];\n' +
          'dateString += monthStrings[month];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a formated wide month', function(done) {
      var localizations = getLocalizations('{variable1, date, MMMM}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var month = date.getMonth();\n' +
          'var monthStrings = [\n' +
          '  \'January\',\n' +
          '  \'February\',\n' +
          '  \'March\',\n' +
          '  \'April\',\n' +
          '  \'May\',\n' +
          '  \'June\',\n' +
          '  \'July\',\n' +
          '  \'August\',\n' +
          '  \'September\',\n' +
          '  \'October\',\n' +
          '  \'November\',\n' +
          '  \'December\'\n' +
          '];\n' +
          'dateString += monthStrings[month];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a formated narrow month', function(done) {
      var localizations = getLocalizations('{variable1, date, MMMMM}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var month = date.getMonth();\n' +
          'var monthStrings = [\n' +
          '  \'J\',\n' +
          '  \'F\',\n' +
          '  \'M\',\n' +
          '  \'A\',\n' +
          '  \'M\',\n' +
          '  \'J\',\n' +
          '  \'J\',\n' +
          '  \'A\',\n' +
          '  \'S\',\n' +
          '  \'O\',\n' +
          '  \'N\',\n' +
          '  \'D\'\n' +
          '];\n' +
          'dateString += monthStrings[month];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone numeric month', function(done) {
      var localizations = getLocalizations('{variable1, date, L}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var month = date.getMonth();\n' +
          'var monthStrings = [\n' +
          '  \'1\',\n' +
          '  \'2\',\n' +
          '  \'3\',\n' +
          '  \'4\',\n' +
          '  \'5\',\n' +
          '  \'6\',\n' +
          '  \'7\',\n' +
          '  \'8\',\n' +
          '  \'9\',\n' +
          '  \'10\',\n' +
          '  \'11\',\n' +
          '  \'12\'\n' +
          '];\n' +
          'dateString += monthStrings[month];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone numeric with padding month', function(done) {
      var localizations = getLocalizations('{variable1, date, LL}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var month = date.getMonth();\n' +
          'var monthStrings = [\n' +
          '  \'01\',\n' +
          '  \'02\',\n' +
          '  \'03\',\n' +
          '  \'04\',\n' +
          '  \'05\',\n' +
          '  \'06\',\n' +
          '  \'07\',\n' +
          '  \'08\',\n' +
          '  \'09\',\n' +
          '  \'10\',\n' +
          '  \'11\',\n' +
          '  \'12\'\n' +
          '];\n' +
          'dateString += monthStrings[month];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone abbreviated month', function(done) {
      var localizations = getLocalizations('{variable1, date, LLL}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var month = date.getMonth();\n' +
          'var monthStrings = [\n' +
          '  \'Jan\',\n' +
          '  \'Feb\',\n' +
          '  \'Mar\',\n' +
          '  \'Apr\',\n' +
          '  \'May\',\n' +
          '  \'Jun\',\n' +
          '  \'Jul\',\n' +
          '  \'Aug\',\n' +
          '  \'Sep\',\n' +
          '  \'Oct\',\n' +
          '  \'Nov\',\n' +
          '  \'Dec\'\n' +
          '];\n' +
          'dateString += monthStrings[month];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone wide month', function(done) {
      var localizations = getLocalizations('{variable1, date, LLLL}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var month = date.getMonth();\n' +
          'var monthStrings = [\n' +
          '  \'January\',\n' +
          '  \'February\',\n' +
          '  \'March\',\n' +
          '  \'April\',\n' +
          '  \'May\',\n' +
          '  \'June\',\n' +
          '  \'July\',\n' +
          '  \'August\',\n' +
          '  \'September\',\n' +
          '  \'October\',\n' +
          '  \'November\',\n' +
          '  \'December\'\n' +
          '];\n' +
          'dateString += monthStrings[month];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone narrow month', function(done) {
      var localizations = getLocalizations('{variable1, date, LLLLL}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var month = date.getMonth();\n' +
          'var monthStrings = [\n' +
          '  \'J\',\n' +
          '  \'F\',\n' +
          '  \'M\',\n' +
          '  \'A\',\n' +
          '  \'M\',\n' +
          '  \'J\',\n' +
          '  \'J\',\n' +
          '  \'A\',\n' +
          '  \'S\',\n' +
          '  \'O\',\n' +
          '  \'N\',\n' +
          '  \'D\'\n' +
          '];\n' +
          'dateString += monthStrings[month];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });
  });

  describe('Week', function() {
    it('should be able to compile a numeric week of year', function(done) {
      var localizations = getLocalizations('{variable1, date, w}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var dateCopy = new Date(+date);\n' +
          'dateCopy.setHours(0,0,0);\n' +
          'dateCopy.setDate(dateCopy.getDate()+4-(dateCopy.getDay()||7));\n' +
          'var week = Math.ceil((((dateCopy-new Date(dateCopy.getFullYear(),0,1))/8.64e7)+1)/7) + \'\';\n' +
          'dateString += week;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a numeric with padding week of year', function(done) {
      var localizations = getLocalizations('{variable1, date, ww}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var dateCopy = new Date(+date);\n' +
          'dateCopy.setHours(0,0,0);\n' +
          'dateCopy.setDate(dateCopy.getDate()+4-(dateCopy.getDay()||7));\n' +
          'var week = Math.ceil((((dateCopy-new Date(dateCopy.getFullYear(),0,1))/8.64e7)+1)/7) + \'\';\n' +
          'if(week.length === 1) {\n' +
          '  week = \'0\' + week;\n' +
          '}\n' +
          'dateString += week;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('week of year block should return the current numeric week of year with start of week being monday', function() {
      function getWeekOfYearFunctionString(date) {
        return 'function test_weekOfYearBlock() {\n' +
          'var dateString = \'\';\n' +
          'var date = new Date(\'' + date + '\');\n' +
          dateTemplates['DateWeekOfYear']({ startOfWeek: 0 }) + '\n' +
          'return dateString; }';
      };
      eval(getWeekOfYearFunctionString('2007-12-30'));
      expect(test_weekOfYearBlock()).to.equal('52');
      eval(getWeekOfYearFunctionString('2007-12-31'));
      expect(test_weekOfYearBlock()).to.equal('1');
      eval(getWeekOfYearFunctionString('2008-01-01'));
      expect(test_weekOfYearBlock()).to.equal('1');
      eval(getWeekOfYearFunctionString('2008-01-07'));
      expect(test_weekOfYearBlock()).to.equal('2');
      eval(getWeekOfYearFunctionString('2008-12-29'));
      expect(test_weekOfYearBlock()).to.equal('1');
      eval(getWeekOfYearFunctionString('2008-12-30'));
      expect(test_weekOfYearBlock()).to.equal('1');
      eval(getWeekOfYearFunctionString('2008-12-31'));
      expect(test_weekOfYearBlock()).to.equal('1');
      eval(getWeekOfYearFunctionString('2009-01-04'));
      expect(test_weekOfYearBlock()).to.equal('1');
      eval(getWeekOfYearFunctionString('2009-01-05'));
      expect(test_weekOfYearBlock()).to.equal('2');
    });

    it('week of year block should return the current numeric week of year with start of week being sunday', function() {
      function getWeekOfYearFunctionString(date) {
        return 'function test_weekOfYearBlock() {\n' +
          'var dateString = \'\';\n' +
          'var date = new Date(\'' + date + '\');\n' +
          dateTemplates['DateWeekOfYear']({ startOfWeek: 1 }) + '\n' +
          'return dateString; }';
      };
      eval(getWeekOfYearFunctionString('2007-12-30'));
      expect(test_weekOfYearBlock()).to.equal('1');
      eval(getWeekOfYearFunctionString('2007-12-31'));
      expect(test_weekOfYearBlock()).to.equal('1');
      eval(getWeekOfYearFunctionString('2008-01-05'));
      expect(test_weekOfYearBlock()).to.equal('1');
      eval(getWeekOfYearFunctionString('2008-01-06'));
      expect(test_weekOfYearBlock()).to.equal('2');
    });

    it('should be able to compile a week of month', function(done) {
      var localizations = getLocalizations('{variable1, date, W}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var dateCopy = new Date(+date);\n' +
          'dateCopy.setHours(0,0,0);\n' +
          'dateCopy.setDate(dateCopy.getDate() + 4 - (dateCopy.getDay() || 7 ));\n' +
          'var monthStart = new Date(dateCopy.getFullYear(),dateCopy.getMonth(), 1);\n' +
          'var week = Math.ceil((((dateCopy - monthStart) / 86400000) + 1)/7);\n' +
          'dateString += week;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a week of month with start of week equals sunday', function(done) {
      var localizations = getLocalizations('{variable1, date,startofweek:sun W}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var dateCopy = new Date(+date);\n' +
          'dateCopy.setHours(0,0,0);\n' +
          'dateCopy.setDate(dateCopy.getDate() + 3 - dateCopy.getDay());\n' +
          'var monthStart = new Date(dateCopy.getFullYear(),dateCopy.getMonth(), 1);\n' +
          'var week = Math.ceil((((dateCopy - monthStart) / 86400000) + 1)/7);\n' +
          'dateString += week;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('week of month block should return current week of month when start of week is monday', function() {
      function getWeekOfMonthFunctionString(date) {
        return 'function test_weekOfMonthBlock() {\n' +
          'var dateString = \'\';\n' +
          'var date = new Date(\'' + date + '\');\n' +
          dateTemplates['DateWeekOfMonth']({
            startOfWeek: 0
          }) + '\n' +
          'return dateString; }';
      };
      eval(getWeekOfMonthFunctionString('2013-02-01'));
      expect(test_weekOfMonthBlock()).to.equal('5');
      eval(getWeekOfMonthFunctionString('2013-02-03'));
      expect(test_weekOfMonthBlock()).to.equal('5');
      eval(getWeekOfMonthFunctionString('2013-02-04'));
      expect(test_weekOfMonthBlock()).to.equal('1');
      eval(getWeekOfMonthFunctionString('2013-07-28'));
      expect(test_weekOfMonthBlock()).to.equal('4');
      eval(getWeekOfMonthFunctionString('2013-07-29'));
      expect(test_weekOfMonthBlock()).to.equal('1');
      eval(getWeekOfMonthFunctionString('2013-07-30'));
      expect(test_weekOfMonthBlock()).to.equal('1');
      eval(getWeekOfMonthFunctionString('2013-07-31'));
      expect(test_weekOfMonthBlock()).to.equal('1');
      eval(getWeekOfMonthFunctionString('2013-08-01'));
      expect(test_weekOfMonthBlock()).to.equal('1');
    });

    it('week of month block should return current week of month when start of week is monday', function() {
      function getWeekOfMonthFunctionString(date) {
        return 'function test_weekOfMonthBlock() {\n' +
          'var dateString = \'\';\n' +
          'var date = new Date(\'' + date + '\');\n' +
          dateTemplates['DateWeekOfMonth']({
            startOfWeek: 1
          }) + '\n' +
          'return dateString; }';
      };
      eval(getWeekOfMonthFunctionString('2013-02-01'));
      expect(test_weekOfMonthBlock()).to.equal('5');
      eval(getWeekOfMonthFunctionString('2013-02-03'));
      expect(test_weekOfMonthBlock()).to.equal('1');
      eval(getWeekOfMonthFunctionString('2013-04-27'));
      expect(test_weekOfMonthBlock()).to.equal('4');
      eval(getWeekOfMonthFunctionString('2013-04-28'));
      expect(test_weekOfMonthBlock()).to.equal('1');
      eval(getWeekOfMonthFunctionString('2013-04-29'));
      expect(test_weekOfMonthBlock()).to.equal('1');
      eval(getWeekOfMonthFunctionString('2013-04-30'));
      expect(test_weekOfMonthBlock()).to.equal('1');
      eval(getWeekOfMonthFunctionString('2013-05-01'));
      expect(test_weekOfMonthBlock()).to.equal('1');
      eval(getWeekOfMonthFunctionString('2013-05-02'));
      expect(test_weekOfMonthBlock()).to.equal('1');
      eval(getWeekOfMonthFunctionString('2013-05-03'));
      expect(test_weekOfMonthBlock()).to.equal('1');
      eval(getWeekOfMonthFunctionString('2013-05-04'));
      expect(test_weekOfMonthBlock()).to.equal('1');
      eval(getWeekOfMonthFunctionString('2013-05-05'));
      expect(test_weekOfMonthBlock()).to.equal('2');
    });
  });

  describe('Day', function() {
    it('should be able to complile a numeric date', function(done) {
      var localizations = getLocalizations('{variable1, date, d}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var dayOfMonthString = date.getDate() + \'\';\n' +
          'dateString += dayOfMonthString;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to complile a numeric with padding date', function(done) {
      var localizations = getLocalizations('{variable1, date, dd}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var dayOfMonthString = date.getDate() + \'\';\n' +
          'if(dayOfMonthString.length === 1) {\n' +
          '  dayOfMonthString = \'0\' + dayOfMonthString;\n' +
          '}\n' +
          'dateString += dayOfMonthString;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a day of year with minimum length of 1', function(done) {
      var localizations = getLocalizations('{variable1, date, D}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var start = new Date(date.getFullYear(), 0, 0);\n' +
          'var diff = now - start;\n' +
          'var oneDay = 1000 * 60 * 60 * 24;\n' +
          'var day = Math.floor(diff / oneDay) + \'\';\n' +
          'dateString += day;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a day of year with minimum length of 2', function(done) {
      var localizations = getLocalizations('{variable1, date, DD}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var start = new Date(date.getFullYear(), 0, 0);\n' +
          'var diff = now - start;\n' +
          'var oneDay = 1000 * 60 * 60 * 24;\n' +
          'var day = Math.floor(diff / oneDay) + \'\';\n' +
          'for(day.length < 2) {\n' +
          '  day = \'0\' + day;\n' +
          '}\n' +
          'dateString += day;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a day of year with minimum length of 3', function(done) {
      var localizations = getLocalizations('{variable1, date, DDD}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var start = new Date(date.getFullYear(), 0, 0);\n' +
          'var diff = now - start;\n' +
          'var oneDay = 1000 * 60 * 60 * 24;\n' +
          'var day = Math.floor(diff / oneDay) + \'\';\n' +
          'for(day.length < 3) {\n' +
          '  day = \'0\' + day;\n' +
          '}\n' +
          'dateString += day;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('set day in week in month block should set count correctly', function() {
      var getFunctionString = function(year, month, date) {
        return 'function test_setDayOfWeekInMonthBlock() {' +
          'var dateString = \'\';\n' +
          'var date = new Date(' + year + ', ' + month + ', ' + date +');\n' +
          dateTemplates['DateDayOfWeekInMonth']({}) + '\n' +
          'return dateString; }';
      }
      eval(getFunctionString(2014, 2, 28));
      expect(test_setDayOfWeekInMonthBlock()).to.equal('4');
      eval(getFunctionString(2014, 3, 7));
      expect(test_setDayOfWeekInMonthBlock()).to.equal('1');
      eval(getFunctionString(2014, 3, 14));
      expect(test_setDayOfWeekInMonthBlock()).to.equal('2');
      eval(getFunctionString(2014, 3, 21));
      expect(test_setDayOfWeekInMonthBlock()).to.equal('3');
      eval(getFunctionString(2014, 3, 28));
      expect(test_setDayOfWeekInMonthBlock()).to.equal('4');
    });

    it('should be able to compile a day of week in month', function(done) {
      var localizations = getLocalizations('{variable1, date, F}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var currentMonth = date.getMonth();\n' +
          'var currentDate = date.getDate();\n' +
          'var month = +currentMonth;\n' +
          'var year = date.getFullYear();\n' +
          'var count = 0;\n' +
          'var exploringDate;\n' +
          'while(currentMonth === month) {\n' +
          '  currentDate = currentDate - 7;\n' +
          '  exploringDate = new Date(year, month, currentDate);\n' +
          '  currentMonth = exploringDate.getMonth();\n' +
          '  count++;\n' +
          '}\n' +
          'count += \'\';\n' +
          'dateString += count;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });
  });

  describe('Weekday', function() {
    it('should be able to compile a formated numeric day of week', function(done) {
      var localizations = getLocalizations('{variable1, date, e}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var day = date.getDay();\n' +
          'if(day === 0) {\n' +
          '  day = 7;\n' +
          '}\n' +
          'day += \'\';\n' +
          'dateString += day;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a formated numeric with padding day of week', function(done) {
      var localizations = getLocalizations('{variable1, date, ee}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var day = date.getDay();\n' +
          'if(day === 0) {\n' +
          '  day = 7;\n' +
          '}\n' +
          'day += \'\';\n' +
          'day = \'0\' + day;\n' +
          'dateString += day;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a formated abbreviated day of week', function(done) {
      var localizations = getLocalizations('{variable1, date, eee}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var days = [\n' +
          '  \'Mon\',\n' +
          '  \'Tue\',\n' +
          '  \'Wed\',\n' +
          '  \'Thu\',\n' +
          '  \'Fri\',\n' +
          '  \'Sat\',\n' +
          '  \'Sun\'\n' +
          '];\n' +
          'var day = date.getDay();\n' +
          'if(day === 0) {\n' +
          '  day = 6;\n' +
          '}\n'+
          'else {\n' +
          '  day--;\n' +
          '}\n' +
          'dateString += days[day];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a formated wide day of week', function(done) {
      var localizations = getLocalizations('{variable1, date, eeee}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var days = [\n' +
          '  \'Monday\',\n' +
          '  \'Tuesday\',\n' +
          '  \'Wednesday\',\n' +
          '  \'Thursday\',\n' +
          '  \'Friday\',\n' +
          '  \'Saturday\',\n' +
          '  \'Sunday\'\n' +
          '];\n' +
          'var day = date.getDay();\n' +
          'if(day === 0) {\n' +
          '  day = 6;\n' +
          '}\n'+
          'else {\n' +
          '  day--;\n' +
          '}\n' +
          'dateString += days[day];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a formated narrow day of week', function(done) {
      var localizations = getLocalizations('{variable1, date, eeeee}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var days = [\n' +
          '  \'M\',\n' +
          '  \'T\',\n' +
          '  \'W\',\n' +
          '  \'T\',\n' +
          '  \'F\',\n' +
          '  \'S\',\n' +
          '  \'S\'\n' +
          '];\n' +
          'var day = date.getDay();\n' +
          'if(day === 0) {\n' +
          '  day = 6;\n' +
          '}\n'+
          'else {\n' +
          '  day--;\n' +
          '}\n' +
          'dateString += days[day];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a formated short day of week', function(done) {
      var localizations = getLocalizations('{variable1, date, eeeeee}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var days = [\n' +
          '  \'Mo\',\n' +
          '  \'Tu\',\n' +
          '  \'We\',\n' +
          '  \'Th\',\n' +
          '  \'Fr\',\n' +
          '  \'Sa\',\n' +
          '  \'Su\'\n' +
          '];\n' +
          'var day = date.getDay();\n' +
          'if(day === 0) {\n' +
          '  day = 6;\n' +
          '}\n'+
          'else {\n' +
          '  day--;\n' +
          '}\n' +
          'dateString += days[day];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone numeric day of week', function(done) {
      var localizations = getLocalizations('{variable1, date, c}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var day = date.getDay();\n' +
          'if(day === 0) {\n' +
          '  day = 7;\n' +
          '}\n' +
          'day += \'\';\n' +
          'dateString += day;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone numeric with padding day of week', function(done) {
      var localizations = getLocalizations('{variable1, date, cc}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var day = date.getDay();\n' +
          'if(day === 0) {\n' +
          '  day = 7;\n' +
          '}\n' +
          'day += \'\';\n' +
          'day = \'0\' + day;\n' +
          'dateString += day;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone abbreviated day of week', function(done) {
      var localizations = getLocalizations('{variable1, date, ccc}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var days = [\n' +
          '  \'Mon\',\n' +
          '  \'Tue\',\n' +
          '  \'Wed\',\n' +
          '  \'Thu\',\n' +
          '  \'Fri\',\n' +
          '  \'Sat\',\n' +
          '  \'Sun\'\n' +
          '];\n' +
          'var day = date.getDay();\n' +
          'if(day === 0) {\n' +
          '  day = 6;\n' +
          '}\n'+
          'else {\n' +
          '  day--;\n' +
          '}\n' +
          'dateString += days[day];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone wide day of week', function(done) {
      var localizations = getLocalizations('{variable1, date, cccc}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var days = [\n' +
          '  \'Monday\',\n' +
          '  \'Tuesday\',\n' +
          '  \'Wednesday\',\n' +
          '  \'Thursday\',\n' +
          '  \'Friday\',\n' +
          '  \'Saturday\',\n' +
          '  \'Sunday\'\n' +
          '];\n' +
          'var day = date.getDay();\n' +
          'if(day === 0) {\n' +
          '  day = 6;\n' +
          '}\n'+
          'else {\n' +
          '  day--;\n' +
          '}\n' +
          'dateString += days[day];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone narrow day of week', function(done) {
      var localizations = getLocalizations('{variable1, date, ccccc}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var days = [\n' +
          '  \'M\',\n' +
          '  \'T\',\n' +
          '  \'W\',\n' +
          '  \'T\',\n' +
          '  \'F\',\n' +
          '  \'S\',\n' +
          '  \'S\'\n' +
          '];\n' +
          'var day = date.getDay();\n' +
          'if(day === 0) {\n' +
          '  day = 6;\n' +
          '}\n'+
          'else {\n' +
          '  day--;\n' +
          '}\n' +
          'dateString += days[day];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a stand-alone short day of week', function(done) {
      var localizations = getLocalizations('{variable1, date, cccccc}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var days = [\n' +
          '  \'Mo\',\n' +
          '  \'Tu\',\n' +
          '  \'We\',\n' +
          '  \'Th\',\n' +
          '  \'Fr\',\n' +
          '  \'Sa\',\n' +
          '  \'Su\'\n' +
          '];\n' +
          'var day = date.getDay();\n' +
          'if(day === 0) {\n' +
          '  day = 6;\n' +
          '}\n'+
          'else {\n' +
          '  day--;\n' +
          '}\n' +
          'dateString += days[day];\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });
  });

  describe('Period', function() {
    it('should be able to compile a abbreviated period with one letter identifier', function(done) {
      var localizations = getLocalizations('{variable1, date, a}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'if(date.getHours() < 12) {\n' +
          '  dateString += \'AM\';\n' +
          '}\n' +
          'else {\n' +
          '  dateString += \'PM\';\n' +
          '}\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a abbreviated period with two letter identifier', function(done) {
      var localizations = getLocalizations('{variable1, date, aa}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'if(date.getHours() < 12) {\n' +
          '  dateString += \'AM\';\n' +
          '}\n' +
          'else {\n' +
          '  dateString += \'PM\';\n' +
          '}\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a abbreviated period with three letter identifier', function(done) {
      var localizations = getLocalizations('{variable1, date, aaa}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'if(date.getHours() < 12) {\n' +
          '  dateString += \'AM\';\n' +
          '}\n' +
          'else {\n' +
          '  dateString += \'PM\';\n' +
          '}\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a narrow period', function(done) {
      var localizations = getLocalizations('{variable1, date, aaaa}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'if(date.getHours() < 12) {\n' +
          '  dateString += \'a\';\n' +
          '}\n' +
          'else {\n' +
          '  dateString += \'p\';\n' +
          '}\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a narrow period', function(done) {
      var localizations = getLocalizations('{variable1, date, aaaaa}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'if(date.getHours() < 12) {\n' +
          '  dateString += \'AM\';\n' +
          '}\n' +
          'else {\n' +
          '  dateString += \'PM\';\n' +
          '}\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });
  });

  describe('Hour', function() {
    it('should be able to compile a twelve hour starting at zero with no padding', function(done) {
      var localizations = getLocalizations('{variable1, date, K}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var hours = date.getHours();\n' +
          'if(hours > 11) {\n' +
          '  hours = hours - 12;\n' +
          '}\n' +
          'dateString += hours;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });


    it('should be able to compile a twelve hour starting at zero with padding', function(done) {
      var localizations = getLocalizations('{variable1, date, KK}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var hours = date.getHours();\n' +
          'if(hours > 11) {\n' +
          '  hours = hours - 12;\n' +
          '}\n' +
          'if(hours < 10) {\n' +
          '  hours = \'0\' + hours;\n' +
          '}\n' +
          'dateString += hours;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a twelve hour starting at one with no padding', function(done) {
      var localizations = getLocalizations('{variable1, date, h}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var hours = date.getHours();\n' +
          'if(hours > 11) {\n' +
          '  hours = hours - 12;\n' +
          '}\n' +
          'if(hours === 0) {\n' +
          '  hours = 12;\n' +
          '}\n' +
          'dateString += hours;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a twelve hour starting at one with padding', function(done) {
      var localizations = getLocalizations('{variable1, date, hh}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var hours = date.getHours();\n' +
          'if(hours > 11) {\n' +
          '  hours = hours - 12;\n' +
          '}\n' +
          'if(hours === 0) {\n' +
          '  hours = 12;\n' +
          '}\n' +
          'if(hours < 10) {\n' +
          '  hours = \'0\' + hours;\n' +
          '}\n' +
          'dateString += hours;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a twelve hour starting at one with padding', function(done) {
      var localizations = getLocalizations('{variable1, date, H}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var hours = date.getHours();\n' +
          'dateString += hours;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a twelve hour starting at one with padding', function(done) {
      var localizations = getLocalizations('{variable1, date, HH}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var hours = date.getHours();\n' +
          'if(hours < 10) {\n' +
          '  hours = \'0\' + hours;\n' +
          '}\n' +
          'dateString += hours;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a twelve hour starting at one with padding', function(done) {
      var localizations = getLocalizations('{variable1, date, k}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var hours = date.getHours();\n' +
          'if(hours === 0) {\n' +
          '  hours = 24;\n' +
          '}\n' +
          'dateString += hours;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a twelve hour starting at one with padding', function(done) {
      var localizations = getLocalizations('{variable1, date, kk}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var hours = date.getHours();\n' +
          'if(hours === 0) {\n' +
          '  hours = 24;\n' +
          '}\n' +
          'if(hours < 10) {\n' +
          '  hours = \'0\' + hours;\n' +
          '}\n' +
          'dateString += hours;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });
  });

  describe('Minute', function() {
    it('should be able to compile minute with no padding', function(done) {
      var localizations = getLocalizations('{variable1, date, m}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var minutes = date.getMinutes();\n' +
          'dateString += minutes;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile minute with padding', function(done) {
      var localizations = getLocalizations('{variable1, date, mm}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var minutes = date.getMinutes();\n' +
          'if(minutes < 10) {\n' +
          '  minutes = \'0\' + minutes;\n' +
          '}\n' +
          'dateString += minutes;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });
  });

  describe('Second', function() {
    it('should be able to compile a numeric second without padding', function(done) {
      var localizations = getLocalizations('{variable1, date, s}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var seconds = date.getSeconds();\n' +
          'dateString += seconds;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a numeric second with padding', function(done) {
      var localizations = getLocalizations('{variable1, date, ss}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var seconds = date.getSeconds();\n' +
          'if(seconds < 10) {\n' +
          '  seconds = \'0\' + seconds;\n' +
          '}\n' +
          'dateString += seconds;\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('FractionalSeconds block should set fractional seconds correctly', function() {
      var getFunctionString = function(milliseconds, length) {
        return 'function test_setFractionalSecondsBlock() {' +
          'var dateString =\'\';\n' +
          dateTemplates['DateFractionalSeconds']({
            length: length
          }).replace('date.getMilliseconds()', milliseconds) +
          'return dateString; }';
      }
      eval(getFunctionString(1, 1));
      expect(test_setFractionalSecondsBlock()).to.equal('0');
      eval(getFunctionString(10, 1));
      expect(test_setFractionalSecondsBlock()).to.equal('0');
      eval(getFunctionString(100, 1));
      expect(test_setFractionalSecondsBlock()).to.equal('1');
      eval(getFunctionString(100, 2));
      expect(test_setFractionalSecondsBlock()).to.equal('10');
      eval(getFunctionString(100, 3));
      expect(test_setFractionalSecondsBlock()).to.equal('100');
      eval(getFunctionString(100, 4));
      expect(test_setFractionalSecondsBlock()).to.equal('1000');
      eval(getFunctionString(123, 2));
      expect(test_setFractionalSecondsBlock()).to.equal('12');
    });

    it('should be able to compile a fractional second with length 1', function(done) {
      var localizations = getLocalizations('{variable1, date, S}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var milliseconds = date.getMilliseconds() + \'\';\n' +
          'while(milliseconds.length < 3) {\n' +
          '  milliseconds = \'0\' + milliseconds;\n' +
          '}\n' +
          'while(milliseconds.length < 1) {\n' +
          '  milliseconds += \'0\';\n' +
          '}\n' +
          'dateString += milliseconds.substr(0, 1);\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a fractional second with length bigger than 1', function(done) {
      var localizations = getLocalizations('{variable1, date, SS}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var milliseconds = date.getMilliseconds() + \'\';\n' +
          'while(milliseconds.length < 3) {\n' +
          '  milliseconds = \'0\' + milliseconds;\n' +
          '}\n' +
          'while(milliseconds.length < 2) {\n' +
          '  milliseconds += \'0\';\n' +
          '}\n' +
          'dateString += milliseconds.substr(0, 2);\n\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });
  });

  describe('Timezone', function() {
    describe('Timezone Offset', function() {
      it('should be able to render offset', function() {
        eval('var test_timezoneOffset = ' + dateTemplates['DateGetTimezoneOffset']());
        expect(test_timezoneOffset(120)).to.equal('+02:00');
        expect(test_timezoneOffset(120, { zeroPaddingHours: false })).to.equal('+2:00');
        expect(test_timezoneOffset(-120, { zeroPaddingHours: false })).to.equal('-2:00');
        expect(test_timezoneOffset(120, { colon: false })).to.equal('+0200');
        expect(test_timezoneOffset(-120)).to.equal('-02:00');
        expect(test_timezoneOffset(-150)).to.equal('-02:30');
      });
    });

    describe('Specific non-location timezone', function() {
      it('should be able to render short non-location timezone format', function() {
        var getFunctionString = function(format, timezoneOffsetType) {
          return 'function test_specificNonLocationTimezone(it) {' +
            'var dateString =\'\';\n' +
            'this.__timezones = { "America/Los_Angeles": { GMTFormat: "GMT{0}", name: { long: { standard: "Pacific Standard Time", daylight: "Pacific Daylight Time", generic: "Pacific Time" }, short: { standard: "PST", daylight: "PDT", generic: "PT" }}}};\n' +
            'var timezoneOffsetType = \'' + timezoneOffsetType + '\';\n' +
            dateTemplates['DateGetLongLocalizedGMT']() + ';\n' +
            dateTemplates['DateSpecificNonLocationTimezone']({
              variableName: 'time',
              format: format
            }) +
            'return dateString; }';
        }
        eval(dateTemplates['DateGetTimezoneOffset']());
        eval(getFunctionString(1, 's'));
        expect(test_specificNonLocationTimezone({
          time: {
            timezone: 'America/Los_Angeles'
          }
        })).to.equal('PST');
        eval(getFunctionString(1, 'd'));
        expect(test_specificNonLocationTimezone({
          time: {
            timezone: 'America/Los_Angeles'
          }
        })).to.equal('PDT');
        eval(getFunctionString(2, 's'));
        expect(test_specificNonLocationTimezone({
          time: {
            timezone: 'America/Los_Angeles'
          }
        })).to.equal('Pacific Standard Time');
        eval(getFunctionString(2, 'd'));
        expect(test_specificNonLocationTimezone({
          time: {
            timezone: 'America/Los_Angeles'
          }
        })).to.equal('Pacific Daylight Time');

        var getFunctionString = function(format, timezoneOffset, timezoneOffsetType) {
          return 'function test_specificNonLocationTimezone(it) {' +
            'var dateString =\'\';\n' +
            'var timezoneOffset = ' + timezoneOffset + ';\n' +
            'this.__timezones = { "America/Los_Angeles": { GMTFormat: "GMT{0}", name: { long: { standard: null, daylight: null, generic: null }, short: { standard: null, daylight: null, generic: null }}}};\n' +
            'var timezoneOffsetType = \'' + timezoneOffsetType + '\';\n' +
            dateTemplates['DateGetLongLocalizedGMT']() + ';\n' +
            dateTemplates['DateSpecificNonLocationTimezone']({
              variableName: 'time',
              format: format
            }) +
            'return dateString; }';
        }
        eval(getFunctionString(1, 120, 's'));
        expect(test_specificNonLocationTimezone({
          time: {
            timezone: 'America/Los_Angeles'
          }
        })).to.equal('GMT+2');
        eval(getFunctionString(2, 120, 's'));
        expect(test_specificNonLocationTimezone({
          time: {
            timezone: 'America/Los_Angeles'
          }
        })).to.equal('GMT+02:00');
      });

      it('should be able to output short non-location code', function(done) {
        var localizations = getLocalizations('{variable1, date, z}');
        var dependencies = getDependencies(localizations);
        var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

        compiler.run();
        eventually(function() {
          var functionBody = setDateBlock +
            'if(timezoneOffsetType === \'s\') {\n' +
            '  if(this.__timezones[it.variable1.timezone].name.short.standard) {\n' +
            '    dateString += this.__timezones[it.variable1.timezone].name.short.standard;\n' +
            '  }\n' +
            '  else {\n' +
            '    dateString += this.__timezones[it.variable1.timezone].GMTFormat.replace(\'{0}\', getTimezoneOffset(timezoneOffset, { zeroPaddingHours: false, minutes: false, colon: false }));\n' +
            '  }\n' +
            '}\n' +
            'else {\n' +
            '  if(this.__timezones[it.variable1.timezone].name.short.daylight) {\n' +
            '    dateString += this.__timezones[it.variable1.timezone].name.short.daylight;\n' +
            '  }\n' +
            '  else {\n' +
            '    dateString += this.__timezones[it.variable1.timezone].GMTFormat.replace(\'{0}\', getTimezoneOffset(timezoneOffset, { zeroPaddingHours: false, minutes: false, colon: false }));\n' +
            '  }\n' +
            '}\n\n' +
            'string += dateString;\n' +
            'return string;';
          expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
            functionBody: indentSpaces(8, functionBody)
          }));
          done();
        });
      });

      it('should be able to output long non-location code', function(done) {
        var localizations = getLocalizations('{variable1, date, zzzz}');
        var dependencies = getDependencies(localizations);
        var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

        compiler.run();
        eventually(function() {
          var functionBody = setDateBlock +
            'if(timezoneOffsetType === \'s\') {\n' +
            '  if(this.__timezones[it.variable1.timezone].name.long.standard) {\n' +
            '    dateString += this.__timezones[it.variable1.timezone].name.long.standard;\n' +
            '  }\n' +
            '  else {\n' +
            '    dateString += getLongLocalizedGMT(this.__timezones[it.variable1.timezone].GMTFormat, timezoneOffset);\n' +
            '  }\n' +
            '}\n' +
            'else {\n' +
            '  if(this.__timezones[it.variable1.timezone].name.long.daylight) {\n' +
            '    dateString += this.__timezones[it.variable1.timezone].name.long.daylight;\n' +
            '  }\n' +
            '  else {\n' +
            '    dateString += getLongLocalizedGMT(this.__timezones[it.variable1.timezone].GMTFormat, timezoneOffset);\n' +
            '  }\n' +
            '}\n\n' +
            'string += dateString;\n' +
            'return string;';
          expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
            functionBody: indentSpaces(8, functionBody)
          }));
          done();
        });
      });
    });

    describe('RegularTimezone', function() {
      it('should be able to output basic format', function(done) {
        var localizations = getLocalizations('{variable1, date, Z}');
        var dependencies = getDependencies(localizations);
        var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

        compiler.run();
        eventually(function() {
          var functionBody = setDateBlock +
            'dateString += getTimezoneOffset(timezoneOffset, { colon: false });\n\n' +
            'string += dateString;\n' +
            'return string;';
          expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
            functionBody: indentSpaces(8, functionBody)
          }));
          done();
        });
      });

      it('should be able to output long localized GMT format', function(done) {
        var localizations = getLocalizations('{variable1, date, ZZZZ}');
        var dependencies = getDependencies(localizations);
        var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

        compiler.run();
        eventually(function() {
          var functionBody = setDateBlock +
            'dateString += getLongLocalizedGMT(timezoneOffset);\n\n' +
            'string += dateString;\n' +
            'return string;';
          expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
            functionBody: indentSpaces(8, functionBody)
          }));
          done();
        });
      });

      it('should be able to output long localized GMT format', function(done) {
        var localizations = getLocalizations('{variable1, date, ZZZZZ}');
        var dependencies = getDependencies(localizations);
        var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

        compiler.run();
        eventually(function() {
          var functionBody = setDateBlock +
            'dateString += getTimezoneOffset(timezoneOffset);\n\n' +
            'string += dateString;\n' +
            'return string;';
          expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
            functionBody: indentSpaces(8, functionBody)
          }));
          done();
        });
      });
    });

    describe('LongLocalizedGMTTimezone', function() {
      it('should be able to output long localized GMT format', function(done) {
        var localizations = getLocalizations('{variable1, date, O}');
        var dependencies = getDependencies(localizations);
        var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

        compiler.run();
        eventually(function() {
          var functionBody = setDateBlock +
            'dateString += this.__timezones[it.variable1.timezone].GMTFormat.replace(\'{0}\', getTimezoneOffset(timezoneOffset, { zeroPaddingHours: false, minutes: false, colon: false }));\n\n' +
            'string += dateString;\n' +
            'return string;';
          expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
            functionBody: indentSpaces(8, functionBody)
          }));
          done();
        });
      });

      it('should be able to output long localized GMT format', function(done) {
        var localizations = getLocalizations('{variable1, date, OOOO}');
        var dependencies = getDependencies(localizations);
        var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

        compiler.run();
        eventually(function() {
          var functionBody = setDateBlock +
            'dateString += getLongLocalizedGMT(this.__timezones[it.variable1.timezone].GMTFormat, timezoneOffset);\n\n' +
            'string += dateString;\n' +
            'return string;';
          expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
            functionBody: indentSpaces(8, functionBody)
          }));
          done();
        });
      });
    });

    describe('GenericNonLocationTimezone', function() {
      it('should be able to render short format', function() {
        var getFunctionString = function(format, timezoneOffset) {
          return 'function test_specificNonLocationTimezone(it) {' +
            'var dateString =\'\';\n' +
            'this.__timezones = { "America/Los_Angeles": { GMTFormat: "GMT{0}", regionFormat: "{0} Time", city: "Los Angeles", name: { long: { standard: "Pacific Standard Time", daylight: "Pacific Daylight Time", generic: "Pacific Time" }, short: { standard: "PST", daylight: "PDT", generic: "PT" }}}};\n' +
            'var timezoneOffset = \'' + timezoneOffset + '\';\n' +
            dateTemplates['DateGetLongLocalizedGMT']() + ';\n' +
            dateTemplates['DateGenericNonLocationTimezone']({
              variableName: 'time',
              format: format
            }) +
            'return dateString; }';
        }
        eval(getFunctionString(1, 120));
        expect(test_specificNonLocationTimezone({
          time: {
            timezone: 'America/Los_Angeles'
          }
        })).to.equal('PT');
        var getFunctionString = function(format, timezoneOffset) {
          return 'function test_specificNonLocationTimezone(it) {' +
            'var dateString =\'\';\n' +
            'this.__timezones = { "America/Los_Angeles": { GMTFormat: "GMT{0}", regionFormat: "{0} Time", hasCity: true, city: "Los Angeles", name: { long: { standard: "Pacific Standard Time", daylight: "Pacific Daylight Time", generic: "Pacific Time" }, short: { standard: "PST", daylight: "PDT", generic: null }}}};\n' +
            'var timezoneOffset = ' + timezoneOffset + ';\n' +
            dateTemplates['DateGetTimezoneOffset']() + ';\n' +
            dateTemplates['DateGetLongLocalizedGMT']() + ';\n' +
            dateTemplates['DateGenericNonLocationTimezone']({
              variableName: 'time',
              format: format
            }) +
            'return dateString; }';
        }
        eval(getFunctionString(1, 120));
        expect(test_specificNonLocationTimezone({
          time: {
            timezone: 'America/Los_Angeles'
          }
        })).to.equal('Los Angeles Time');
        var getFunctionString = function(format, timezoneOffset) {
          return 'function test_specificNonLocationTimezone(it) {' +
            'var dateString =\'\';\n' +
            'this.__timezones = { "America/Los_Angeles": { GMTFormat: "GMT{0}", regionFormat: "{0} Time", hasCity: false, city: "Los Angeles", name: { long: { standard: "Pacific Standard Time", daylight: "Pacific Daylight Time", generic: "Pacific Time" }, short: { standard: "PST", daylight: "PDT", generic: null }}}};\n' +
            'var timezoneOffset = ' + timezoneOffset + ';\n' +
            dateTemplates['DateGetTimezoneOffset']() + ';\n' +
            dateTemplates['DateGetLongLocalizedGMT']() + ';\n' +
            dateTemplates['DateGenericNonLocationTimezone']({
              variableName: 'time',
              format: format
            }) +
            'return dateString; }';
        }
        eval(getFunctionString(1, 120));
        expect(test_specificNonLocationTimezone({
          time: {
            timezone: 'America/Los_Angeles'
          }
        })).to.equal('GMT+2');
      });


      it('should be able to render long format', function() {
        var getFunctionString = function(format, timezoneOffset) {
          return 'function test_specificNonLocationTimezone(it) {\n' +
            'var dateString =\'\';\n' +
            'this.__timezones = { "America/Los_Angeles": { GMTFormat: "GMT{0}", regionFormat: "{0} Time", hasCity: false, city: "Los Angeles", name: { long: { standard: "Pacific Standard Time", daylight: "Pacific Daylight Time", generic: "Pacific Time" }, short: { standard: "PST", daylight: "PDT", generic: null }}}};\n' +
            'var timezoneOffset = ' + timezoneOffset + ';\n' +
            dateTemplates['DateGetTimezoneOffset']() + ';\n' +
            dateTemplates['DateGetLongLocalizedGMT']() + ';\n' +
            dateTemplates['DateGenericNonLocationTimezone']({
              variableName: 'time',
              format: format
            }) +
            '\n  return dateString; \n}';
        }
        eval(getFunctionString(2, 120));
        expect(test_specificNonLocationTimezone({
          time: {
            timezone: 'America/Los_Angeles'
          }
        })).to.equal('Pacific Time');
        var getFunctionString = function(format, timezoneOffset) {
          return 'function test_specificNonLocationTimezone(it) {\n' +
            'var dateString =\'\';\n' +
            'this.__timezones = { "America/Los_Angeles": { GMTFormat: "GMT{0}", regionFormat: "{0} Time", hasCity: true, city: "Los Angeles", name: { long: { standard: "Pacific Standard Time", daylight: "Pacific Daylight Time", generic: null }, short: { standard: "PST", daylight: "PDT", generic: null }}}};\n' +
            'var timezoneOffset = ' + timezoneOffset + ';\n' +
            dateTemplates['DateGetTimezoneOffset']() + ';\n' +
            dateTemplates['DateGetLongLocalizedGMT']() + ';\n' +
            dateTemplates['DateGenericNonLocationTimezone']({
              variableName: 'time',
              format: format
            }) +
            '\n  return dateString; \n}';
        }
        eval(getFunctionString(2, 120));
        expect(test_specificNonLocationTimezone({
          time: {
            timezone: 'America/Los_Angeles'
          }
        })).to.equal('Los Angeles Time');
        var getFunctionString = function(format, timezoneOffset) {
          return 'function test_specificNonLocationTimezone(it) {\n' +
            'var dateString =\'\';\n' +
            'this.__timezones = { "America/Los_Angeles": { GMTFormat: "GMT{0}", regionFormat: "{0} Time", hasCity: false, city: "Los Angeles", name: { long: { standard: "Pacific Standard Time", daylight: "Pacific Daylight Time", generic: null }, short: { standard: "PST", daylight: "PDT", generic: null }}}};\n' +
            'var timezoneOffset = ' + timezoneOffset + ';\n' +
            dateTemplates['DateGetTimezoneOffset']() + ';\n' +
            dateTemplates['DateGetLongLocalizedGMT']() + ';\n' +
            dateTemplates['DateGenericNonLocationTimezone']({
              variableName: 'time',
              format: format
            }) +
            '\n  return dateString; \n}';
        }
        eval(getFunctionString(2, 120));
        expect(test_specificNonLocationTimezone({
          time: {
            timezone: 'America/Los_Angeles'
          }
        })).to.equal('GMT+02:00');
      });

      it('should be able to output short format', function(done) {
        var localizations = getLocalizations('{variable1, date, v}');
        var dependencies = getDependencies(localizations);
        var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

        compiler.run();
        eventually(function() {
          var functionBody = setDateBlock +
            'if(this.__timezones[it.variable1.timezone].name.long.generic) {\n' +
            '  dateString += this.__timezones[it.variable1.timezone].name.long.generic;\n' +
            '}\n' +
            'else {\n' +
            '  if(this.__timezones[it.variable1.timezone].hasCity) {\n' +
            '    dateString += this.__timezones[it.variable1.timezone].regionFormat.replace(\'{0}\', this.__timezones[it.variable1.timezone].city);\n' +
            '  }\n' +
            '  else {\n' +
            '    dateString += getLongLocalizedGMT(this.__timezones[it.variable1.timezone].GMTFormat, timezoneOffset);\n' +
            '  }\n' +
            '}\n\n' +
            'string += dateString;\n' +
            'return string;';
          expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
            functionBody: indentSpaces(8, functionBody)
          }));
          done();
        });
      });

      it('should be able to output long format', function(done) {
        var localizations = getLocalizations('{variable1, date, vvvv}');
        var dependencies = getDependencies(localizations);
        var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

        compiler.run();
        eventually(function() {
          var functionBody = setDateBlock +
            'if(this.__timezones[it.variable1.timezone].name.long.generic) {\n' +
            '  dateString += this.__timezones[it.variable1.timezone].name.long.generic;\n' +
            '}\n' +
            'else {\n' +
            '  if(this.__timezones[it.variable1.timezone].hasCity) {\n' +
            '    dateString += this.__timezones[it.variable1.timezone].regionFormat.replace(\'{0}\', this.__timezones[it.variable1.timezone].city);\n' +
            '  }\n' +
            '  else {\n' +
            '    dateString += getLongLocalizedGMT(this.__timezones[it.variable1.timezone].GMTFormat, timezoneOffset);\n' +
            '  }\n' +
            '}\n\n' +
            'string += dateString;\n' +
            'return string;';
          expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
            functionBody: indentSpaces(8, functionBody)
          }));
          done();
        });
      });
    });

    describe('GenericLocationTimezone', function() {
      var getFunctionString = function(format) {
        return 'function test_GenericLocationTimezoneRendering(it) {' +
          'var dateString =\'\';\n' +
          'this.__timezones = { "America/Los_Angeles": { GMTFormat: "GMT{0}", regionFormat: "{0} Time", hasCity: true, city: "Los Angeles", name: { long: { standard: "Pacific Standard Time", daylight: "Pacific Daylight Time", generic: null }, short: { standard: "PST", daylight: "PDT", generic: null }}}};\n' +
          dateTemplates['DateGenericLocationTimezone']({
            variableName: 'test',
            format: format
          }) +
          'return dateString; }';
      }
      it('should be able to render time zone id', function() {
        eval(getFunctionString(1));
        expect(test_GenericLocationTimezoneRendering({ test: { timezone: 'America/Los_Angeles' }})).to.equal('America/Los_Angeles');
      });
      it('should be able to render city', function() {
        eval(getFunctionString(2));
        expect(test_GenericLocationTimezoneRendering({ test: { timezone: 'America/Los_Angeles' }})).to.equal('Los Angeles');
      });
      it('should be able to render city time', function() {
        eval(getFunctionString(3));
        expect(test_GenericLocationTimezoneRendering({ test: { timezone: 'America/Los_Angeles' }})).to.equal('Los Angeles Time');
      });
      it('should be able to render long localized GMT format whenever city time format is not available', function() {
        var getFunctionString = function(format, timezoneOffset) {
          return 'function test_GenericLocationTimezoneRendering(it) {' +
            'var dateString =\'\';\n' +
            'var timezoneOffset = ' + timezoneOffset + ';\n' +
            'this.__timezones = { "America/Los_Angeles": { GMTFormat: "GMT{0}", regionFormat: "{0} Time", hasCity: false, city: "Los Angeles", name: { long: { standard: "Pacific Standard Time", daylight: "Pacific Daylight Time", generic: null }, short: { standard: "PST", daylight: "PDT", generic: null }}}};\n' +
            dateTemplates['DateGetTimezoneOffset']() + ';\n' +
            dateTemplates['DateGetLongLocalizedGMT']() + ';\n' +
            dateTemplates['DateGenericLocationTimezone']({
              variableName: 'test',
              format: format
            }) +
            'return dateString; }';
        }
        eval(getFunctionString(3, 120));
        expect(test_GenericLocationTimezoneRendering({ test: { timezone: 'America/Los_Angeles' }})).to.equal('GMT+02:00');
      });
    });

    describe('ISO8601WithZTimezone', function() {
      var getFunctionString = function(format, timezoneOffset) {
        return 'function test_ISO8601WithZRendering(it) {' +
          'var dateString =\'\';\n' +
          'var timezoneOffset = ' + timezoneOffset + ';\n' +
          dateTemplates['DateGetTimezoneOffset']() + ';\n' +
          dateTemplates['DateISO8601WithZTimezone']({
            format: format
          }) +
          'return dateString; }';
      }
      it('should be able to render hours with optional minutes', function() {
        eval(getFunctionString(1, 120));
        expect(test_ISO8601WithZRendering()).to.equal('+02');
        eval(getFunctionString(1, 150));
        expect(test_ISO8601WithZRendering()).to.equal('+0230');
        eval(getFunctionString(1, 0));
        expect(test_ISO8601WithZRendering()).to.equal('Z');
      });

      it('should be able to render with hours and minutes and without colon', function() {
        eval(getFunctionString(2, 120));
        expect(test_ISO8601WithZRendering()).to.equal('+0200');
        eval(getFunctionString(2, 0));
        expect(test_ISO8601WithZRendering()).to.equal('Z');
      });

      it('should be able to render with hours and minutes and with colon', function() {
        eval(getFunctionString(3, 120));
        expect(test_ISO8601WithZRendering()).to.equal('+02:00');
        eval(getFunctionString(3, 0));
        expect(test_ISO8601WithZRendering()).to.equal('Z');
      });
    });

    describe('ISO8601WithoutZTimezone', function() {
      var getFunctionString = function(format, timezoneOffset) {
        return 'function test_ISO8601WithZRendering(it) {' +
          'var dateString =\'\';\n' +
          'var timezoneOffset = ' + timezoneOffset + ';\n' +
          dateTemplates['DateGetTimezoneOffset']() + ';\n' +
          dateTemplates['DateISO8601WithoutZTimezone']({
            format: format
          }) +
          'return dateString; }';
      }
      it('should be able to render hours with optional minutes', function() {
        eval(getFunctionString(1, 120));
        expect(test_ISO8601WithZRendering()).to.equal('+02');
        eval(getFunctionString(1, 150));
        expect(test_ISO8601WithZRendering()).to.equal('+0230');
        eval(getFunctionString(1, 0));
        expect(test_ISO8601WithZRendering()).to.equal('+00');
      });

      it('should be able to render with hours and minutes and without colon', function() {
        eval(getFunctionString(2, 120));
        expect(test_ISO8601WithZRendering()).to.equal('+0200');
        eval(getFunctionString(2, 0));
        expect(test_ISO8601WithZRendering()).to.equal('+0000');
      });

      it('should be able to render with hours and minutes and with colon', function() {
        eval(getFunctionString(3, 120));
        expect(test_ISO8601WithZRendering()).to.equal('+02:00');
        eval(getFunctionString(3, 0));
        expect(test_ISO8601WithZRendering()).to.equal('+00:00');
      });
    });
  });

  describe('Number system', function() {
    it('should be able to compile with an another number system', function(done) {
      var localizations = {
        'ar-AE': {
          'key-1': {
            value: '{variable1, date, d}'
          }
        }
      };
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'var dayOfMonthString = date.getDate() + \'\';\n' +
          'dateString += dayOfMonthString;\n\n' +
          'dateString = dateString\n' +
          '  .replace(/1/g, \'١\')\n' +
          '  .replace(/2/g, \'٢\')\n' +
          '  .replace(/3/g, \'٣\')\n' +
          '  .replace(/4/g, \'٤\')\n' +
          '  .replace(/5/g, \'٥\')\n' +
          '  .replace(/6/g, \'٦\')\n' +
          '  .replace(/7/g, \'٧\')\n' +
          '  .replace(/8/g, \'٨\')\n' +
          '  .replace(/9/g, \'٩\')\n' +
          '  .replace(/0/g, \'٠\');\n' +
          'string += dateString;\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.include(indentSpaces(8, functionBody));
        done();
      });
    });
  });
});
