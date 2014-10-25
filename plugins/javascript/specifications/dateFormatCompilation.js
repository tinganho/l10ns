
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
          '  string += \'0\';\n' +
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

    it('block should set week based year correctly', function() {
      var function_ = 'function test_weekBasedYearBlock(it) {\n' +
        'var string = \'\';\n' +
        dateTemplates['SetDateBlock']({
          variableName: 'date'
        }) + '\n' +
        dateTemplates['DateWeekBasedYear']() + '\n' +
        dateTemplates['FormatYear']({ length: 3 }) + '\n' +
        'return string; }';
        console.log(function_)
        eval(function_);
      expect(test_weekBasedYearBlock({ date: new Date('2001-12-31')})).to.equal('2002');
    });
  });
});
