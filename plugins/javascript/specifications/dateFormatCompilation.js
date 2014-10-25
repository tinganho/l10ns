
var dateTemplates = require('../templates/build/templates');

var setDateBlock =
  'var string = \'\';\n' +
  'var date;\n' +
  'if(typeof it.variable1 === \'string\') {\n' +
  '  date = new Date(it.variable1);\n' +
  '}\n' +
  'else {\n' +
  '  date = it.variable1;\n' +
  '}\n';

describe('DateFormat', function() {
  describe('Era', function() {
    it('should be able to compile an abbreviated era', function(done) {
      var localizations = getLocalizations('{variable1, date, G}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'if(date.getFullYear() >= 0) {\n' +
          '  string += \'AD\';\n' +
          '}\n' +
          'else {\n' +
          '  string += \'BC\';\n' +
          '}\n' +
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
          '  string += \'Anno Domini\';\n' +
          '}\n' +
          'else {\n' +
          '  string += \'Before Christ\';\n' +
          '}\n' +
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
          '  string += \'A\';\n' +
          '}\n' +
          'else {\n' +
          '  string += \'B\';\n' +
          '}\n' +
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
          'if(year.length >= 1) {\n' +
          '  string += year;\n' +
          '}\n' +
          'else {\n' +
          '  var difference = 1 - year.length;\n' +
          '  for(var i = 0; i < difference; i++) {\n' +
          '    string += \'0\';\n' +
          '  }\n' +
          '  string += year;\n' +
          '}\n' +
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
          'if(year.length < 2) {\n' +
          '  string += \'0\' + year;\n' +
          '}\n' +
          'else {\n' +
          '  string += year.substring(year.length - 2, year.length);\n' +
          '}\n' +
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
          'if(year.length >= 4) {\n' +
          '  string += year;\n' +
          '}\n' +
          'else {\n' +
          '  var difference = 4 - year.length;\n' +
          '  for(var i = 0; i < difference; i++) {\n' +
          '    string += \'0\';\n' +
          '  }\n' +
          '  string += year;\n' +
          '}\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a calendar year of length 1', function(done) {
      var localizations = getLocalizations('{variable1, date, Y}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          dateTemplates['DateWeekBasedYear']() + '\n' +
          dateTemplates['FormatYear']({ length: 1 }) + '\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a calendar year of length 2', function(done) {
      var localizations = getLocalizations('{variable1, date, YY}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          dateTemplates['DateWeekBasedYear']() + '\n' +
          dateTemplates['FormatYear']({ length: 2 }) + '\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('should be able to compile a calendar year of length bigger than 2', function(done) {
      var localizations = getLocalizations('{variable1, date, YYY}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          dateTemplates['DateWeekBasedYear']() + '\n' +
          dateTemplates['FormatYear']({ length: 3 }) + '\n' +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });

    it('week based year block should set week based year correctly', function() {
      var function_ = 'function test_weekBasedYearBlock(it) {\n' +
        'var string = \'\';\n' +
        dateTemplates['SetDateBlock']({
          variableName: 'date'
        }) + '\n' +
        dateTemplates['DateWeekBasedYear']() + '\n' +
        dateTemplates['FormatYear']({ length: 3 }) + '\n' +
        'return string; }';
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

    it('format year block of length 1 should format without padding', function() {
      var function_ = 'function test_formatYearBlock() {\n' +
        'var string = \'\';\n' +
        'var year = \'208\';\n' +
        dateTemplates['FormatYear']({ length: 1 }) + '\n' +
        'return string; }';
        eval(function_);
      expect(test_formatYearBlock()).to.equal('208');
    });

    it('format year block should pad with zero whenever minimum length is not met', function() {
      var function_ = 'function test_formatYearBlock() {\n' +
        'var string = \'\';\n' +
        'var year = \'8\';\n' +
        dateTemplates['FormatYear']({ length: 2 }) + '\n' +
        'return string; }';
        eval(function_);
      expect(test_formatYearBlock()).to.equal('08');
    });

    it('format year block of length 2 should add padding with zero', function() {
      var function_ = 'function test_formatYearBlock() {\n' +
        'var string = \'\';\n' +
        'var year = \'8\';\n' +
        dateTemplates['FormatYear']({ length: 2 }) + '\n' +
        'return string; }';
        eval(function_);
      expect(test_formatYearBlock()).to.equal('08');
    });

    it('format year block of length 2 should truncate year string', function() {
      var function_ = 'function test_formatYearBlock() {\n' +
        'var string = \'\';\n' +
        'var year = \'2008\';\n' +
        dateTemplates['FormatYear']({ length: 2 }) + '\n' +
        'return string; }';
        eval(function_);
      expect(test_formatYearBlock()).to.equal('08');
    });
  });

  describe('Quarter', function() {
    it('we', function() {
      var localizations = getLocalizations('{variable1, date, Q}');
      var dependencies = getDependencies(localizations);
      var compiler = proxyquire('../plugins/javascript/compiler', dependencies);

      compiler.run();
      eventually(function() {
        var functionBody = setDateBlock +
          'return string;';
        expect(dependencies.fs.writeFileSync.args[1][1]).to.eql(template['JavascriptWrapper']({
          functionBody: indentSpaces(8, functionBody)
        }));
        done();
      });
    });
  });
});
