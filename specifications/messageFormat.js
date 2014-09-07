
var messageFormat = new (require('../libraries/MessageFormat'))('en-US')
  , AST = require('../libraries/MessageFormat/AST');

describe('MessageFormat', function() {
  describe('#parse(string)', function() {
    describe('Sentences', function() {
      it('should parse a sentence', function() {
        messageFormat.parse('sentence');
        expect(messageFormat.messageAST[0].string).to.equal('sentence');
        expect(messageFormat.messageAST.length).to.equal(1);
      });

      it('should parse escaped sentences', function() {
        messageFormat.parse('sentence\\{');
        expect(messageFormat.messageAST[0].string).to.equal('sentence\\{');
        expect(messageFormat.messageAST.length).to.equal(1);
        messageFormat.parse('sentence\\}');
        expect(messageFormat.messageAST[0].string).to.equal('sentence\\}');
        expect(messageFormat.messageAST.length).to.equal(1);
        messageFormat.parse('\\{sentence\\{');
        expect(messageFormat.messageAST[0].string).to.equal('\\{sentence\\{');
        expect(messageFormat.messageAST.length).to.equal(1);
      });

      it('should throw an error if an unescaped reserved character is used', function() {
        function method() {
          messageFormat.parse('sentence {');
        }
        expect(method).to.throw(TypeError, 'Could not parse variable in sentence {')
      });
    });

    describe('Variables', function() {
      it('should parse a sentence with a single variable', function() {
        messageFormat.parse('sentence {variable1}');
        expect(messageFormat.messageAST[0].string).to.equal('sentence ');
        expect(messageFormat.messageAST[1].name).to.equal('variable1');
        expect(messageFormat.messageAST.length).to.equal(2);
      });

      it('should parse a message with multiple variables', function() {
        messageFormat.parse('{variable1} {variable2}');
        expect(messageFormat.messageAST[0].name).to.equal('variable1');
        expect(messageFormat.messageAST[1].string).to.equal(' ');
        expect(messageFormat.messageAST[2].name).to.equal('variable2');
        expect(messageFormat.messageAST.length).to.equal(3);
      });

      it('should parse a sentence with multiple subsequent variables', function() {
        messageFormat.parse('{variable1}{variable2}{variable3}');
        expect(messageFormat.messageAST[0].name).to.equal('variable1');
        expect(messageFormat.messageAST[1].name).to.equal('variable2');
        expect(messageFormat.messageAST[2].name).to.equal('variable3');
        expect(messageFormat.messageAST.length).to.equal(3);
      });

      it('should throw an error if a variable contains non alphanumeric characters', function() {
        var method = function() {
          messageFormat.parse('{!variable1}');
        }
        expect(method).to.throw(TypeError, 'Variable names must be alpha numeric, got a \'!\' in {!');
        var method = function() {
          messageFormat.parse('{varia!ble1}');
        }
        expect(method).to.throw(TypeError, 'Variable names must be alpha numeric, got a \'!\' in {varia!');
        var method = function() {
          messageFormat.parse('{variable1!}');
        }
        expect(method).to.throw(TypeError, 'Variable names must be alpha numeric, got a \'!\' in {variable1!');
        var method = function() {
          messageFormat.parse('{variable1}{varia!ble2}');
        }
        expect(method).to.throw(TypeError, 'Variable names must be alpha numeric, got a \'!\' in {variable1}{varia');
      });
    });

    describe('NumberFormat', function() {
      it('should be able to parse a non-format arguments', function() {
        messageFormat.parse('{variable1,number,integer}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('integer');
        messageFormat.parse('{variable1,number,currency}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('currency');
        messageFormat.parse('{variable1,number,percent}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('percent');
      });

      it('should be able to parse padding characters by setting it on the prefix', function() {
        messageFormat.parse('{variable1,number,*p0}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('*p0');
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.paddingCharacter).to.equal('p');
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse padding characters by setting it on the suffix', function() {
        messageFormat.parse('{variable1,number,0*p}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('0*p');
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.paddingCharacter).to.equal('p');
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse percentage by setting it on the prefix', function() {
        messageFormat.parse('{variable1,number,%0}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('%0');
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.percentage).to.eql({ position: 'prefix' });
        expect(messageFormat.messageAST[0].format.positive.permille).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.currency).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse percentage by setting it on the suffix', function() {
        messageFormat.parse('{variable1,number,0%}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('0%');
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.percentage).to.eql({ position: 'suffix' });
        expect(messageFormat.messageAST[0].format.positive.permille).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.currency).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse permille by setting it on the prefix', function() {
        messageFormat.parse('{variable1,number,‰0}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('‰0');
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.percentage).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.permille).to.eql({ position: 'prefix' });
        expect(messageFormat.messageAST[0].format.positive.currency).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse permille by setting it on the suffix', function() {
        messageFormat.parse('{variable1,number,0‰}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('0‰');
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.percentage).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.permille).to.eql({ position: 'suffix' });
        expect(messageFormat.messageAST[0].format.positive.currency).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse currency by setting it on the prefix', function() {
        messageFormat.parse('{variable1,number,¤0}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('¤0');
        expect(messageFormat.messageAST[0].format.positive.prefix).to.equal('');
        expect(messageFormat.messageAST[0].format.positive.suffix).to.equal('');
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.percentage).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.permille).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.currency).to.eql({ position: 'prefix', characterLength: 1 });
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
        messageFormat.parse('{variable1,number,¤¤0}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('¤¤0');
        expect(messageFormat.messageAST[0].format.positive.prefix).to.equal('');
        expect(messageFormat.messageAST[0].format.positive.suffix).to.equal('');
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.percentage).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.permille).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.currency).to.eql({ position: 'prefix', characterLength: 2 });
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
        messageFormat.parse('{variable1,number,¤¤¤0}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('¤¤¤0');
        expect(messageFormat.messageAST[0].format.positive.prefix).to.equal('');
        expect(messageFormat.messageAST[0].format.positive.suffix).to.equal('');
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.percentage).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.permille).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.currency).to.eql({ position: 'prefix', characterLength: 3 });
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse currency by setting it on the suffix', function() {
        messageFormat.parse('{variable1,number,0¤}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('0¤');
        expect(messageFormat.messageAST[0].format.positive.prefix).to.equal('');
        expect(messageFormat.messageAST[0].format.positive.suffix).to.equal('');
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.currency).to.eql({ position: 'suffix', characterLength: 1 });
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
        messageFormat.parse('{variable1,number,0¤¤}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('0¤¤');
        expect(messageFormat.messageAST[0].format.positive.prefix).to.equal('');
        expect(messageFormat.messageAST[0].format.positive.suffix).to.equal('');
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.currency).to.eql({ position: 'suffix', characterLength: 2 });
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
        messageFormat.parse('{variable1,number,0¤¤¤}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('0¤¤¤');
        expect(messageFormat.messageAST[0].format.positive.prefix).to.equal('');
        expect(messageFormat.messageAST[0].format.positive.suffix).to.equal('');
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.currency).to.eql({ position: 'suffix', characterLength: 3 });
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse a signifcant number pattern with a single non-absent number', function() {
        messageFormat.parse('{variable1,number,@}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._SignificantNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.rightAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse a signifcant number pattern with multiple non-absent numbers', function() {
        messageFormat.parse('{variable1,number,@@}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._SignificantNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.nonAbsentNumbers).to.equal(2);
        expect(messageFormat.messageAST[0].format.positive.rightAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(2);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse a signifcant number pattern with multiple non-absent numbers and a single left absent number', function() {
        messageFormat.parse('{variable1,number,#@@}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._SignificantNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.leftAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.nonAbsentNumbers).to.equal(2);
        expect(messageFormat.messageAST[0].format.positive.rightAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(3);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse a signifcant number pattern with multiple non-absent numbers and multiple left absent numbers', function() {
        messageFormat.parse('{variable1,number,##@@}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._SignificantNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.leftAbsentNumbers).to.equal(2);
        expect(messageFormat.messageAST[0].format.positive.nonAbsentNumbers).to.equal(2);
        expect(messageFormat.messageAST[0].format.positive.rightAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(4);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse a formatted argument with a single non-absent number', function() {
        messageFormat.parse('{variable1,number,0}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('0');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.paddingCharacter).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse a formatted argument with multiple non-absent numbers', function() {
        messageFormat.parse('{variable1,number,00}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('00');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(2);
        expect(messageFormat.messageAST[0].format.positive.fraction).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.paddingCharacter).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(2);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse a formatted argument with a single left absent number', function() {
        messageFormat.parse('{variable1,number,#0}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('#0');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.paddingCharacter).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(2);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse a formatted argument with multiple left absent numbers', function() {
        messageFormat.parse('{variable1,number,##0}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('##0');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(2);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.paddingCharacter).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(3);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse a formatted argument with a single decimal with a non-absent number', function() {
        messageFormat.parse('{variable1,number,#0.0}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('#0.0');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction.rightAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.paddingCharacter).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(4);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse a formatted argument with multiple decimals with multiple non-absent numbers', function() {
        messageFormat.parse('{variable1,number,#0.00}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('#0.00');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction.nonAbsentNumbers).to.equal(2);
        expect(messageFormat.messageAST[0].format.positive.fraction.rightAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.paddingCharacter).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(5);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse a formatted argument with multiple decimals with multiple non-absent numbers and single absent number', function() {
        messageFormat.parse('{variable1,number,#0.00#}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('#0.00#');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction.nonAbsentNumbers).to.equal(2);
        expect(messageFormat.messageAST[0].format.positive.fraction.rightAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.paddingCharacter).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(6);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse a formatted argument with multiple decimals with multiple non-absent numbers and multiple absent numbers', function() {
        messageFormat.parse('{variable1,number,#0.00##}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('#0.00##');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction.nonAbsentNumbers).to.equal(2);
        expect(messageFormat.messageAST[0].format.positive.fraction.rightAbsentNumbers).to.equal(2);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.paddingCharacter).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(7);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse exponent pattern with a single non-absent number and without showing positive character', function() {
        messageFormat.parse('{variable1,number,#0E0}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('#0E0');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.paddingCharacter).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.eql({ nonAbsentNumbers: 1, showPositiveCharacter: false });
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(4);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse exponent pattern with multiple non-absent numbers and without showing positive character', function() {
        messageFormat.parse('{variable1,number,#0E00}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('#0E00');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.paddingCharacter).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.eql({ nonAbsentNumbers: 2, showPositiveCharacter: false });
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(5);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse exponent pattern with showing positive character', function() {
        messageFormat.parse('{variable1,number,#0E+0}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].argument).to.equal('#0E+0');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.positive.fraction).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.paddingCharacter).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive.exponent).to.eql({ nonAbsentNumbers: 1, showPositiveCharacter: true });
        expect(messageFormat.messageAST[0].format.positive.formatLength).to.equal(5);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse a formatted argument with a negative pattern', function() {
        messageFormat.parse('{variable1,number,0;0}');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.negative.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.negative.integer.nonAbsentNumbers).to.equal(1);
        messageFormat.parse('{variable1,number,0;##0.00##E0}');
        expect(messageFormat.messageAST[0].format.negative).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.negative.integer.leftAbsentNumbers).to.equal(2);
        expect(messageFormat.messageAST[0].format.negative.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative.fraction.nonAbsentNumbers).to.equal(2);
        expect(messageFormat.messageAST[0].format.negative.fraction.rightAbsentNumbers).to.equal(2);
        expect(messageFormat.messageAST[0].format.negative.exponent).to.eql({ nonAbsentNumbers: 1, showPositiveCharacter: false });
        expect(messageFormat.messageAST[0].format.negative.paddingCharacter).to.equal(null);
        expect(messageFormat.messageAST[0].format.negative.groupSize).to.equal(null);
        expect(messageFormat.messageAST[0].format.negative.formatLength).to.equal(10);
      });

      it('should be able to parse group size with a single group separator', function() {
        messageFormat.parse('{variable1,number,#,#0}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.groupSize.primary).to.equal(2);
        expect(messageFormat.messageAST[0].format.positive.groupSize.secondary).to.equal(2);
      });

      it('should be able to parse a group size with multiple group separator', function() {
        messageFormat.parse('{variable1,number,#,#,#0}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.groupSize.primary).to.equal(2);
        expect(messageFormat.messageAST[0].format.positive.groupSize.secondary).to.equal(1);
      });

      it('should be able to parse with spaces between keywords', function() {
        messageFormat.parse('{ variable1,number,0}');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
        messageFormat.parse('{variable1 ,number,0}');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
        messageFormat.parse('{variable1 ,number,0}');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
        messageFormat.parse('{variable1, number,0}');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
        messageFormat.parse('{variable1,number, 0}');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
        messageFormat.parse('{variable1,number,0 }');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should be able to parse with tabes between keywords', function() {
        messageFormat.parse('{\tvariable1,number,0}');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
        messageFormat.parse('{variable1\t,number,0}');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
        messageFormat.parse('{variable1\t,number,0}');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
        messageFormat.parse('{variable1,\tnumber,0}');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
        messageFormat.parse('{variable1,number,\t0}');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
        messageFormat.parse('{variable1,number,0\t}');
        expect(messageFormat.messageAST[0].format.positive).to.be.an.instanceOf(AST.NumberFormat._FloatingNumberFormat);
        expect(messageFormat.messageAST[0].format.positive.integer.leftAbsentNumbers).to.equal(0);
        expect(messageFormat.messageAST[0].format.positive.integer.nonAbsentNumbers).to.equal(1);
        expect(messageFormat.messageAST[0].format.negative).to.equal(null);
      });

      it('should throw an error if there exists two padding characters', function() {
        var method = function() {
          messageFormat.parse('{variable1,number,*r*r0}');
        };
        expect(method).to.throw(TypeError, 'Can not set double padding character(*x*x) in *r*r0');
      });

      it('should throw an error if there exists two percentage characters', function() {
        var method = function() {
          messageFormat.parse('{variable1,number,%%0}');
        };
        expect(method).to.throw(TypeError, 'Can not set double percentage character(%%) in %%0');
      });

      it('should throw an error if there exists two permille characters', function() {
        var method = function() {
          messageFormat.parse('{variable1,number,‰‰0}');
        };
        expect(method).to.throw(TypeError, 'Can not set double permille character(‰‰) in ‰‰0');
      });

      it('should throw an error if there exists two permille characters', function() {
        var method = function() {
          messageFormat.parse('{variable1,number,‰‰0}');
        };
        expect(method).to.throw(TypeError, 'Can not set double permille character(‰‰) in ‰‰0');
      });

      it('should throw an error if you set percentage and then set permille', function() {
        var method = function() {
          messageFormat.parse('{variable1,number,%‰0}');
        };
        expect(method).to.throw(TypeError, 'Can not set permille whenever percentage or currency are set in %‰0');
      });

      it('should throw an error if you set permille and then set currency', function() {
        var method = function() {
          messageFormat.parse('{variable1,number,‰¤0}');
        };
        expect(method).to.throw(TypeError, 'Can not set currency whenever percentage or permille are set in ‰¤0');
      });

      it('should throw an error if you set percentage and then set currency', function() {
        var method = function() {
          messageFormat.parse('{variable1,number,%¤0}');
        };
        expect(method).to.throw(TypeError, 'Can not set currency whenever percentage or permille are set in %¤0');
      });

      it('should throw an error if the number pattern does not have any non-absent numbers', function() {
        var method = function() {
          messageFormat.parse('{variable1,number,#}');
        };
        expect(method).to.throw(TypeError, 'Expected a valid integer pattern (/^#*0+$/) in your NumberFormat argument, got (#) in #');
      });

      it('should throw an error if the exponent pattern have no non-absent numbers', function() {
        var method = function() {
          messageFormat.parse('{variable1,number,0E}');
        };
        expect(method).to.throw(TypeError, 'Expected a valid exponent pattern (/^E\\+?[0-9]+$/) in your NumberFormat argument, got (E) in 0E');
      });

      it('should throw an error if a special character exists in between integer and exponent pattern', function() {
        var method = function() {
          messageFormat.parse('{variable1,number,0nE0}');
        };
        expect(method).to.throw(TypeError, 'A number pattern can not exist after suffix pattern in 0nE0');
      });

      it('should throw an error if there exist a non non-absent number after `E` in an exponent pattern', function() {
        var method = function() {
          messageFormat.parse('{variable1,number,0E10}');
        };
        expect(method).to.throw(TypeError, 'Expected a valid exponent pattern (/^E\\+?[0-9]+$/) in your NumberFormat argument, got (E10) in 0E10');
      });
    });

    describe('PluralFormat', function() {
      it('should be able to parse a single case', function() {
        messageFormat.parse('{variable1,plural,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
      });

      it('should be able to parse with multiple cases using keywords', function() {
        messageFormat.parse('{variable1,plural,zero{message1} other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].offset).to.equal(0);
        expect(messageFormat.messageAST[0].values.zero).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural,zero{message1}one{message2}other{message3}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].offset).to.equal(0);
        expect(messageFormat.messageAST[0].values.zero).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message2' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message3' }]);
        messageFormat.parse('{variable1,plural,zero{message1}one{message2}two{message3}other{message4}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].offset).to.equal(0);
        expect(messageFormat.messageAST[0].values.zero).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message2' }]);
        expect(messageFormat.messageAST[0].values.two).to.eql([{ string: 'message3' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message4' }]);
        messageFormat.parse('{variable1,plural,zero{message1}one{message2}two{message3}few{message4}other{message5}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].offset).to.equal(0);
        expect(messageFormat.messageAST[0].values.zero).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message2' }]);
        expect(messageFormat.messageAST[0].values.two).to.eql([{ string: 'message3' }]);
        expect(messageFormat.messageAST[0].values.few).to.eql([{ string: 'message4' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message5' }]);
        messageFormat.parse('{variable1,plural,zero{message1}one{message2}two{message3}few{message4}many{message5}other{message6}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].offset).to.equal(0);
        expect(messageFormat.messageAST[0].values.zero).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message2' }]);
        expect(messageFormat.messageAST[0].values.two).to.eql([{ string: 'message3' }]);
        expect(messageFormat.messageAST[0].values.few).to.eql([{ string: 'message4' }]);
        expect(messageFormat.messageAST[0].values.many).to.eql([{ string: 'message5' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message6' }]);
      });

      it('should be able to parse with exact cases', function() {
        messageFormat.parse('{variable1,plural,=1{message1} other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values['=1']).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural,=1{message1}=2{message2} other{message3}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values['=1']).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values['=2']).to.eql([{ string: 'message2' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message3' }]);
      });

      it('should be able to set offset', function() {
        messageFormat.parse('{variable1,plural, offset:1 other{message1}}');
        expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.PluralFormat);
        expect(messageFormat.messageAST[0].offset).to.equal(1);
      });

      it('should be able to parse sub-message with a remaining symbol', function() {
        messageFormat.parse('{variable1, plural, offset:1 one {message1} other {sentence1#sentence2}}');
        expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.PluralFormat);
        expect(messageFormat.messageAST[0].offset).to.equal(1);
        expect(messageFormat.messageAST[0].values['other'][1]).to.be.an.instanceOf(AST.Remaining);
        expect(messageFormat.messageAST[0].values['other'][1].offset).to.equal(1);
        expect(messageFormat.messageAST[0].values['other'][1].variable.name).to.equal('variable1');
      });

      it('should be able to parse a sub-message with a sentence', function() {
        messageFormat.parse('{variable1,plural,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0].string).to.eql('message1');
      });

      it('should be able to parse a sub-message with a Remaining', function() {
        messageFormat.parse('{variable1,plural,other{message1#}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0].string).to.eql('message1');
        expect(messageFormat.messageAST[0].values.other[1]).to.be.an.instanceOf(AST.Remaining);
      });

      it('should be able to parse a sub-message with the same variable connected to the PluralFormat', function() {
        messageFormat.parse('{variable1,plural,other{{variable1}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0].name).to.equal('variable1');
      });

      it('should be able to parse a sub-message with a variable that is not connected to the PluralFormat', function() {
        messageFormat.parse('{variable1,plural,other{{variable2}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0].name).to.equal('variable2');
      });

      it('should be able to parse a sub-message with multiple variable that is not connected to the PluralFormat', function() {
        messageFormat.parse('{variable1,plural,other{{variable2}{variable3}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0].name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values.other[1].name).to.equal('variable3');
      });

      it('should be able to parse a sub-message with an another PluralFormat', function() {
        messageFormat.parse('{variable1,plural,other{{variable2,plural,other{message1}}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0]).to.be.an.instanceOf(AST.PluralFormat);
        expect(messageFormat.messageAST[0].values.other[0].variable.name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values.other[0].values.other[0].string).to.equal('message1');
      });

      it('should be able to parse a sub-message with a SelectFormat', function() {
        messageFormat.parse('{variable1,plural,other{{variable2,select,other{message1}}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0]).to.be.an.instanceOf(AST.SelectFormat);
        expect(messageFormat.messageAST[0].values.other[0].variable.name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values.other[0].values.other[0].string).to.equal('message1');
      });

      it('should be able to parse a sub-message with a ChoiceFormat', function() {
        messageFormat.parse('{variable1,plural,other{{variable2,choice,1<message1}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0]).to.be.an.instanceOf(AST.ChoiceFormat);
        expect(messageFormat.messageAST[0].values.other[0].variable.name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values.other[0].values[0].messageAST[0].string).to.equal('message1');
      });

      it('should be able to parse a sub-message with both a SelectFormat and a PluralFormat', function() {
        messageFormat.parse('{variable1,plural,other{{variable2,select,other{message1}}{variable3,plural,other{message2}}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0]).to.be.an.instanceOf(AST.SelectFormat);
        expect(messageFormat.messageAST[0].values.other[0].variable.name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values.other[0].values.other[0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values.other[1]).to.be.an.instanceOf(AST.PluralFormat);
        expect(messageFormat.messageAST[0].values.other[1].variable.name).to.equal('variable3');
        expect(messageFormat.messageAST[0].values.other[1].values.other[0].string).to.equal('message2');
      });

      it('should be able to parse a sub-message with both a ChoiceFormat and a PluralFormat', function() {
        messageFormat.parse('{variable1,plural,other{{variable2,choice,1<message1}{variable3,plural,other{message2}}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0]).to.be.an.instanceOf(AST.ChoiceFormat);
        expect(messageFormat.messageAST[0].values.other[0].variable.name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values.other[0].values[0].messageAST[0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values.other[1]).to.be.an.instanceOf(AST.PluralFormat);
        expect(messageFormat.messageAST[0].values.other[1].variable.name).to.equal('variable3');
        expect(messageFormat.messageAST[0].values.other[1].values.other[0].string).to.equal('message2');
      });

      it('should be able to parse a sub-message with both a ChoiceFormat and a SelectFormat', function() {
        messageFormat.parse('{variable1,plural,other{{variable2,choice,1<message1}{variable3,select,other{message2}}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0]).to.be.an.instanceOf(AST.ChoiceFormat);
        expect(messageFormat.messageAST[0].values.other[0].variable.name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values.other[0].values[0].messageAST[0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values.other[1]).to.be.an.instanceOf(AST.SelectFormat);
        expect(messageFormat.messageAST[0].values.other[1].variable.name).to.equal('variable3');
        expect(messageFormat.messageAST[0].values.other[1].values.other[0].string).to.equal('message2');
      });

      it('should parse with spaces between keywords', function() {
        messageFormat.parse('{variable1,plural,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{ variable1,plural,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1 ,plural,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1, plural,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,plural ,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,plural, other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,plural,other {message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,plural,other {message1} }');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,plural,one{message1}other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural, one{message1}other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural,one {message1}other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural,one{message1} other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural,one{message1}other {message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural,offset:1 other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].offset).to.equal(1);
        expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message1');
        messageFormat.parse('{variable1,plural, offset:1 other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].offset).to.equal(1);
        expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message1');
        messageFormat.parse('{variable1,plural, offset:1  other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].offset).to.equal(1);
        expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message1');
        messageFormat.parse('{variable1,plural, offset:1 one{message1} other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].offset).to.equal(1);
        expect(messageFormat.messageAST[0].values.one[0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message2');
      });

      it('should parse with tabs between keywords', function() {
        messageFormat.parse('{variable1,plural,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{\tvariable1,plural,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1\t,plural,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,\tplural,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,plural\t,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,plural,\tother{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,plural,other\t{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,plural,other{message1}\t}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,plural,one{message1}other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural,\tone{message1}other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural,one\t{message1}other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural,one{message1}\tother{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural,one{message1}other\t{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural,offset:1 other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].offset).to.equal(1);
        expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message1');
        messageFormat.parse('{variable1,plural,\toffset:1 other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].offset).to.equal(1);
        expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message1');
        messageFormat.parse('{variable1,plural,\toffset:1\tother{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].offset).to.equal(1);
        expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message1');
        messageFormat.parse('{variable1,plural,\toffset:1\tone{message1}\tother{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].offset).to.equal(1);
        expect(messageFormat.messageAST[0].values.one[0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message2');
      });

      it('should throw an error if there is no other case', function() {
        var method = function() {
          messageFormat.parse('{variable1,plural,one{message1}}');
        }
        expect(method).to.throw(TypeError, 'Missing \'other\' case in {variable1,plural,one{message1}}');
      });

      it('should throw an error if one of the brackets are missing in the values', function() {
        var method = function() {
          messageFormat.parse('{variable1,plural,other message1}}');
        }
        expect(method).to.throw(TypeError, 'Expected bracket \'{\' instead got \'m\' in {variable1,plural,other m');
        var method = function() {
          messageFormat.parse('{variable1,plural,other {message1}');
        }
        expect(method).to.throw(TypeError, 'Expected closing bracket \'}\' in instead got EOF in {variable1,plural,other {message1}');
      });

      it('should throw an error if there is letters or a case after the other case', function() {
        var method = function() {
          messageFormat.parse('{variable1,plural,other {message1}case}');
        }
        expect(method).to.throw(TypeError, 'Expected closing bracket \'}\' in instead got \'c\' in {variable1,plural,other {message1}c');
      });
    });

    describe('SelectFormat', function() {
      it('should be able to parse with a single case', function() {
        messageFormat.parse('{variable1,select,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message1');
      });

      it('should be able to  parse with multiple cases', function() {
        messageFormat.parse('{variable1,select,case1{message1}other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.case1[0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message2');
        messageFormat.parse('{variable1,select,case1{message1}case2{message2}other{message3}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.case1[0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values.case2[0].string).to.equal('message2');
        expect(messageFormat.messageAST[0].values.other[0].string).to.equal('message3');
      });

      it('should be able to parse with spaces between keywords', function() {
        messageFormat.parse('{variable1,select,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{ variable1,select,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1 ,select,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1, select,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,select ,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,select, other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,select,other {message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,select,other {message1} }');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,select,case1{message1}other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.case1).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,select, case1{message1}other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.case1).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,select,case1 {message1}other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.case1).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,select,case1{message1} other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.case1).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,select,case1{message1}other {message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.case1).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
      });

      it('should be able to parse with tabs between keywords', function() {
        messageFormat.parse('{variable1,select,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{\tvariable1,select,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1\t,select,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,\tselect,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,select\t,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,select,\tother{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,select,other\t{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,select,other{message1}\t}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,select,case1{message1}other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.case1).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,select,\tcase1{message1}other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.case1).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,select,case1\t{message1}other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.case1).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,select,case1{message1}\tother{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.case1).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,select,case1{message1}other\t{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.case1).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
      });

      it('should be able to parse a sub-message with a sentence', function() {
        messageFormat.parse('{variable1,select,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0].string).to.eql('message1');
      });

      it('should be able to parse a sub-message with the same variable connected to the SelectFormat', function() {
        messageFormat.parse('{variable1,select,other{{variable1}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0].name).to.equal('variable1');
      });

      it('should be able to parse a sub-message with a variable that is not connected to the SelectFormat', function() {
        messageFormat.parse('{variable1,select,other{{variable2}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0].name).to.equal('variable2');
      });

      it('should be able to parse a sub-message with multiple variable that is not connected to the SelectFormat', function() {
        messageFormat.parse('{variable1,select,other{{variable2}{variable3}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0].name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values.other[1].name).to.equal('variable3');
      });

      it('should be able to parse a sub-message with an another SelectFormat', function() {
        messageFormat.parse('{variable1,select,other{{variable2,select,other{message1}}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0]).to.be.an.instanceOf(AST.SelectFormat);
        expect(messageFormat.messageAST[0].values.other[0].variable.name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values.other[0].values.other[0].string).to.equal('message1');
      });

      it('should be able to parse a sub-message with a PluralFormat', function() {
        messageFormat.parse('{variable1,select,other{{variable2,plural,other{message1}}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0]).to.be.an.instanceOf(AST.PluralFormat);
        expect(messageFormat.messageAST[0].values.other[0].variable.name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values.other[0].values.other[0].string).to.equal('message1');
      });

      it('should be able to parse a sub-message with a ChoiceFormat', function() {
        messageFormat.parse('{variable1,select,other{{variable2,choice,1<message1}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0]).to.be.an.instanceOf(AST.ChoiceFormat);
        expect(messageFormat.messageAST[0].values.other[0].variable.name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values.other[0].values[0].messageAST[0].string).to.equal('message1');
      });

      it('should be able to parse a sub-message with both a SelectFormat and a PluralFormat', function() {
        messageFormat.parse('{variable1,select,other{{variable2,select,other{message1}}{variable3,plural,other{message2}}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0]).to.be.an.instanceOf(AST.SelectFormat);
        expect(messageFormat.messageAST[0].values.other[0].variable.name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values.other[0].values.other[0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values.other[1]).to.be.an.instanceOf(AST.PluralFormat);
        expect(messageFormat.messageAST[0].values.other[1].variable.name).to.equal('variable3');
        expect(messageFormat.messageAST[0].values.other[1].values.other[0].string).to.equal('message2');
      });

      it('should be able to parse a sub-message with both a PluralFormat and a ChoiceFormat', function() {
        messageFormat.parse('{variable1,select,other{{variable2,plural,other{message1}}{variable3,choice,1<message2}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0]).to.be.an.instanceOf(AST.PluralFormat);
        expect(messageFormat.messageAST[0].values.other[0].variable.name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values.other[0].values.other[0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values.other[1]).to.be.an.instanceOf(AST.ChoiceFormat);
        expect(messageFormat.messageAST[0].values.other[1].variable.name).to.equal('variable3');
        expect(messageFormat.messageAST[0].values.other[1].values[0].messageAST[0].string).to.equal('message2');
      });

      it('should be able to parse a sub-message with both a SelectFormat and a ChoiceFormat', function() {
        messageFormat.parse('{variable1,select,other{{variable2,select,other{message1}}{variable3,choice,1<message2}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other[0]).to.be.an.instanceOf(AST.SelectFormat);
        expect(messageFormat.messageAST[0].values.other[0].variable.name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values.other[0].values.other[0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values.other[1]).to.be.an.instanceOf(AST.ChoiceFormat);
        expect(messageFormat.messageAST[0].values.other[1].variable.name).to.equal('variable3');
        expect(messageFormat.messageAST[0].values.other[1].values[0].messageAST[0].string).to.equal('message2');
      });

      it('should throw an error if there is no other case', function() {
        var method = function() {
          messageFormat.parse('{variable1,select,case1{message1}}');
        }
        expect(method).to.throw(TypeError, 'Missing \'other\' case in {variable1,select,case1{message1}}');
      });

      it('should throw an error if one of the brackets are missing in the values', function() {
        var method = function() {
          messageFormat.parse('{variable1,select,other message1}}');
        }
        expect(method).to.throw(TypeError, 'Expected bracket \'{\' instead got \'m\' in {variable1,select,other m');
        var method = function() {
          messageFormat.parse('{variable1,select,other {message1}');
        }
        expect(method).to.throw(TypeError, 'Expected closing bracket \'}\' in instead got EOF in {variable1,select,other {message1}');
      });

      it('should throw an error if there is letters or a case after the other case', function() {
        var method = function() {
          messageFormat.parse('{variable1,select,other {message1}case}');
        }
        expect(method).to.throw(TypeError, 'Expected closing bracket \'}\' in instead got \'c\' in {variable1,select,other {message1}c');
      });
    });

    describe('ChoiceFormat', function() {
      it('should be able to parse a single case', function() {
        messageFormat.parse('{variable1,choice,1<message1}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values[0].limits.lower.type).to.equal('>');
        expect(messageFormat.messageAST[0].values[0].limits.lower.value).to.equal(1);
        expect(messageFormat.messageAST[0].values[0].limits.upper.type).to.equal('<=');
        expect(messageFormat.messageAST[0].values[0].limits.upper.value).to.equal(Infinity);
      });

      it('should be able to parse a case with positive infinity', function() {
        messageFormat.parse('{variable1,choice,∞#message1}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values[0].limits.lower.type).to.equal('>=');
        expect(messageFormat.messageAST[0].values[0].limits.lower.value).to.equal(Infinity);
        expect(messageFormat.messageAST[0].values[0].limits.upper.type).to.equal('<=');
        expect(messageFormat.messageAST[0].values[0].limits.upper.value).to.equal(Infinity);
      });

      it('should be able to parse a case with negative infinity', function() {
        messageFormat.parse('{variable1,choice,-∞#message1}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values[0].limits.lower.type).to.equal('>=');
        expect(messageFormat.messageAST[0].values[0].limits.lower.value).to.equal(-Infinity);
        expect(messageFormat.messageAST[0].values[0].limits.upper.type).to.equal('<=');
        expect(messageFormat.messageAST[0].values[0].limits.upper.value).to.equal(Infinity);
      });

      it('should be able to parse a case with a negative double', function() {
        messageFormat.parse('{variable1,choice,-1#message1}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values[0].limits.lower.type).to.equal('>=');
        expect(messageFormat.messageAST[0].values[0].limits.lower.value).to.equal(-1);
        expect(messageFormat.messageAST[0].values[0].limits.upper.type).to.equal('<=');
        expect(messageFormat.messageAST[0].values[0].limits.upper.value).to.equal(Infinity);
        messageFormat.parse('{variable1,choice,-2#message1}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values[0].limits.lower.type).to.equal('>=');
        expect(messageFormat.messageAST[0].values[0].limits.lower.value).to.equal(-2);
        expect(messageFormat.messageAST[0].values[0].limits.upper.type).to.equal('<=');
        expect(messageFormat.messageAST[0].values[0].limits.upper.value).to.equal(Infinity);
      });

      it('should be able to parse multiple cases', function() {
        messageFormat.parse('{variable1,choice,1<message1|3#message2}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values[0].limits.lower.type).to.equal('>');
        expect(messageFormat.messageAST[0].values[0].limits.lower.value).to.equal(1);
        expect(messageFormat.messageAST[0].values[0].limits.upper.type).to.equal('<');
        expect(messageFormat.messageAST[0].values[0].limits.upper.value).to.equal(3);
        expect(messageFormat.messageAST[0].values[1].messageAST[0].string).to.equal('message2');
        expect(messageFormat.messageAST[0].values[1].limits.lower.type).to.equal('>=');
        expect(messageFormat.messageAST[0].values[1].limits.lower.value).to.equal(3);
        expect(messageFormat.messageAST[0].values[1].limits.upper.type).to.equal('<=');
        expect(messageFormat.messageAST[0].values[1].limits.upper.value).to.equal(Infinity);
        messageFormat.parse('{variable1,choice,1<message1|3#message2|4#message3}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values[0].limits.lower.type).to.equal('>');
        expect(messageFormat.messageAST[0].values[0].limits.lower.value).to.equal(1);
        expect(messageFormat.messageAST[0].values[0].limits.upper.type).to.equal('<');
        expect(messageFormat.messageAST[0].values[0].limits.upper.value).to.equal(3);
        expect(messageFormat.messageAST[0].values[1].messageAST[0].string).to.equal('message2');
        expect(messageFormat.messageAST[0].values[1].limits.lower.type).to.equal('>=');
        expect(messageFormat.messageAST[0].values[1].limits.lower.value).to.equal(3);
        expect(messageFormat.messageAST[0].values[1].limits.upper.type).to.equal('<');
        expect(messageFormat.messageAST[0].values[1].limits.upper.value).to.equal(4);
        expect(messageFormat.messageAST[0].values[2].messageAST[0].string).to.equal('message3');
        expect(messageFormat.messageAST[0].values[2].limits.lower.type).to.equal('>=');
        expect(messageFormat.messageAST[0].values[2].limits.lower.value).to.equal(4);
        expect(messageFormat.messageAST[0].values[2].limits.upper.type).to.equal('<=');
        expect(messageFormat.messageAST[0].values[2].limits.upper.value).to.equal(Infinity);
      });

      it('should be able to parse sub-messages with ChoiceFormat', function() {
        messageFormat.parse('{variable1,choice,1<{variable2,choice,1<message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0].limits.lower.type).to.equal('>');
        expect(messageFormat.messageAST[0].values[0].limits.lower.value).to.equal(1);
        expect(messageFormat.messageAST[0].values[0].limits.upper.type).to.equal('<=');
        expect(messageFormat.messageAST[0].values[0].limits.upper.value).to.equal(Infinity);
        expect(messageFormat.messageAST[0].values[0].messageAST[0]).to.be.an.instanceOf(AST.ChoiceFormat);
        expect(messageFormat.messageAST[0].values[0].messageAST[0].variable.name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values[0].messageAST[0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values[0].limits.lower.type).to.equal('>');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values[0].limits.lower.value).to.equal(1);
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values[0].limits.upper.type).to.equal('<=');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values[0].limits.upper.value).to.equal(Infinity);

        // Check that a sub message case can have smaller range than the super message
        messageFormat.parse('{variable1, choice, 2#{variable2, choice, 2.0<message3|4#message4}|3.0<message2}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0].limits.lower.type).to.equal('>=');
        expect(messageFormat.messageAST[0].values[0].limits.lower.value).to.equal(2);
        expect(messageFormat.messageAST[0].values[0].limits.upper.type).to.equal('<=');
        expect(messageFormat.messageAST[0].values[0].limits.upper.value).to.equal(3);
        expect(messageFormat.messageAST[0].values[1].limits.lower.type).to.equal('>');
        expect(messageFormat.messageAST[0].values[1].limits.lower.value).to.equal(3);
        expect(messageFormat.messageAST[0].values[1].limits.upper.type).to.equal('<=');
        expect(messageFormat.messageAST[0].values[1].limits.upper.value).to.equal(Infinity);
        expect(messageFormat.messageAST[0].values[0].messageAST[0]).to.be.an.instanceOf(AST.ChoiceFormat);
        expect(messageFormat.messageAST[0].values[0].messageAST[0].variable.name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values[0].messageAST[0].string).to.equal('message3');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values[0].limits.lower.type).to.equal('>');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values[0].limits.lower.value).to.equal(2);
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values[0].limits.upper.type).to.equal('<');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values[0].limits.upper.value).to.equal(4);
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values[1].limits.lower.type).to.equal('>=');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values[1].limits.lower.value).to.equal(4);
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values[1].limits.upper.type).to.equal('<=');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values[1].limits.upper.value).to.equal(Infinity);
      });

      it('should be able to parse sub-messages with SelectFormat', function() {
        messageFormat.parse('{variable1,choice,1<{variable2,select,case1{message1}other{message2}}}');
        expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.ChoiceFormat);
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0].limits.lower.type).to.equal('>');
        expect(messageFormat.messageAST[0].values[0].limits.lower.value).to.equal(1);
        expect(messageFormat.messageAST[0].values[0].limits.upper.type).to.equal('<=');
        expect(messageFormat.messageAST[0].values[0].limits.upper.value).to.equal(Infinity);
        expect(messageFormat.messageAST[0].values[0].messageAST[0]).to.be.an.instanceOf(AST.SelectFormat);
        expect(messageFormat.messageAST[0].values[0].messageAST[0].variable.name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values['case1'][0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values['other'][0].string).to.equal('message2');
      });

      it('should be able to parse sub-messages with PluralFormat', function() {
        messageFormat.parse('{variable1,choice,1<{variable2,plural,one{message1}other{message2}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0].limits.lower.type).to.equal('>');
        expect(messageFormat.messageAST[0].values[0].limits.lower.value).to.equal(1);
        expect(messageFormat.messageAST[0].values[0].limits.upper.type).to.equal('<=');
        expect(messageFormat.messageAST[0].values[0].limits.upper.value).to.equal(Infinity);
        expect(messageFormat.messageAST[0].values[0].messageAST[0]).to.be.an.instanceOf(AST.PluralFormat);
        expect(messageFormat.messageAST[0].values[0].messageAST[0].variable.name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values['one'][0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values['other'][0].string).to.equal('message2');
      });

      it('should be able to parse a single sub-messages with both ChoiceFormat and PluralFormat', function() {
        messageFormat.parse('{variable1,choice,1<{variable2,choice,1<message1}{variable3,plural,one{message2}other{message3}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0].limits.lower.type).to.equal('>');
        expect(messageFormat.messageAST[0].values[0].limits.lower.value).to.equal(1);
        expect(messageFormat.messageAST[0].values[0].limits.upper.type).to.equal('<=');
        expect(messageFormat.messageAST[0].values[0].limits.upper.value).to.equal(Infinity);
        expect(messageFormat.messageAST[0].values[0].messageAST[0]).to.be.an.instanceOf(AST.ChoiceFormat);
        expect(messageFormat.messageAST[0].values[0].messageAST[0].variable.name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values[0].messageAST[0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values[0].messageAST[1]).to.be.an.instanceOf(AST.PluralFormat);
        expect(messageFormat.messageAST[0].values[0].messageAST[1].variable.name).to.equal('variable3');
        expect(messageFormat.messageAST[0].values[0].messageAST[1].values['one'][0].string).to.equal('message2');
        expect(messageFormat.messageAST[0].values[0].messageAST[1].values['other'][0].string).to.equal('message3');
      });

      it('should be able to parse a single sub-messages with both SelectFormat and PluralFormat', function() {
        messageFormat.parse('{variable1,choice,1<{variable2,select,case1{message1}other{message2}}{variable3,plural,one{message3}other{message4}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0].limits.lower.type).to.equal('>');
        expect(messageFormat.messageAST[0].values[0].limits.lower.value).to.equal(1);
        expect(messageFormat.messageAST[0].values[0].limits.upper.type).to.equal('<=');
        expect(messageFormat.messageAST[0].values[0].limits.upper.value).to.equal(Infinity);
        expect(messageFormat.messageAST[0].values[0].messageAST[0]).to.be.an.instanceOf(AST.SelectFormat);
        expect(messageFormat.messageAST[0].values[0].messageAST[0].variable.name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values['case1'][0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values['other'][0].string).to.equal('message2');
        expect(messageFormat.messageAST[0].values[0].messageAST[1]).to.be.an.instanceOf(AST.PluralFormat);
        expect(messageFormat.messageAST[0].values[0].messageAST[1].variable.name).to.equal('variable3');
        expect(messageFormat.messageAST[0].values[0].messageAST[1].values['one'][0].string).to.equal('message3');
        expect(messageFormat.messageAST[0].values[0].messageAST[1].values['other'][0].string).to.equal('message4');
      });

      it('should be able to parse a single sub-messages with both SelectFormat and ChoiceFormat', function() {
        messageFormat.parse('{variable1,choice,1<{variable2,select,one{message1}other{message2}}{variable3,choice,1<message3}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0].limits.lower.type).to.equal('>');
        expect(messageFormat.messageAST[0].values[0].limits.lower.value).to.equal(1);
        expect(messageFormat.messageAST[0].values[0].limits.upper.type).to.equal('<=');
        expect(messageFormat.messageAST[0].values[0].limits.upper.value).to.equal(Infinity);
        expect(messageFormat.messageAST[0].values[0].messageAST[0].variable.name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values[0].messageAST[0]).to.be.an.instanceOf(AST.SelectFormat);
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values['one'][0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values['other'][0].string).to.equal('message2');
        expect(messageFormat.messageAST[0].values[0].messageAST[1]).to.be.an.instanceOf(AST.ChoiceFormat);
        expect(messageFormat.messageAST[0].values[0].messageAST[1].variable.name).to.equal('variable3');
        expect(messageFormat.messageAST[0].values[0].messageAST[1].values[0].messageAST[0].string).to.equal('message3');
        expect(messageFormat.messageAST[0].values[0].messageAST[1].values[0].limits.lower.type).to.equal('>');
        expect(messageFormat.messageAST[0].values[0].messageAST[1].values[0].limits.lower.value).to.equal(1);
        expect(messageFormat.messageAST[0].values[0].messageAST[1].values[0].limits.upper.type).to.equal('<=');
        expect(messageFormat.messageAST[0].values[0].messageAST[1].values[0].limits.upper.value).to.equal(Infinity);
      });

      it('should be able to parse multiple sub-messages with both SelectFormat and PluralFormat', function() {
        messageFormat.parse('{variable1,choice,1<{variable2,plural,one{message1}other{message2}}{variable3,select,case1{message3}other{message4}}|2#{variable2,plural,one{message1}other{message2}}{variable3,select,case1{message3}other{message4}}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0].limits.lower.type).to.equal('>');
        expect(messageFormat.messageAST[0].values[0].limits.lower.value).to.equal(1);
        expect(messageFormat.messageAST[0].values[0].limits.upper.type).to.equal('<');
        expect(messageFormat.messageAST[0].values[0].limits.upper.value).to.equal(2);
        expect(messageFormat.messageAST[0].values[1].limits.lower.type).to.equal('>=');
        expect(messageFormat.messageAST[0].values[1].limits.lower.value).to.equal(2);
        expect(messageFormat.messageAST[0].values[1].limits.upper.type).to.equal('<=');
        expect(messageFormat.messageAST[0].values[1].limits.upper.value).to.equal(Infinity);
        expect(messageFormat.messageAST[0].values[0].messageAST[0].variable.name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values['one'][0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].values['other'][0].string).to.equal('message2');
        expect(messageFormat.messageAST[0].values[0].messageAST[1].variable.name).to.equal('variable3');
        expect(messageFormat.messageAST[0].values[0].messageAST[1].values['case1'][0].string).to.equal('message3');
        expect(messageFormat.messageAST[0].values[0].messageAST[1].values['other'][0].string).to.equal('message4');
        expect(messageFormat.messageAST[0].values[1].messageAST[0].variable.name).to.equal('variable2');
        expect(messageFormat.messageAST[0].values[1].messageAST[0].values['one'][0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values[1].messageAST[0].values['other'][0].string).to.equal('message2');
        expect(messageFormat.messageAST[0].values[1].messageAST[1].variable.name).to.equal('variable3');
        expect(messageFormat.messageAST[0].values[1].messageAST[1].values['case1'][0].string).to.equal('message3');
        expect(messageFormat.messageAST[0].values[1].messageAST[1].values['other'][0].string).to.equal('message4');
      });

      it('should be able to parse with spaces between keywords', function() {
        var value = {
          messageAST: [{ string: 'message1' }],
          limits: {
            lower: {
              value: 1,
              type: '>'
            },
            upper: {
              value: Infinity,
              type: '<='
            }
          }
        };
        messageFormat.parse('{ variable1,choice,1<message1}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0]).to.eql(value);
        messageFormat.parse('{variable1 ,choice,1<message1}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0]).to.eql(value);
        messageFormat.parse('{variable1, choice,1<message1}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0]).to.eql(value);
        messageFormat.parse('{variable1,choice ,1<message1}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0]).to.eql(value);
        messageFormat.parse('{variable1,choice, 1<message1}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0]).to.eql(value);
        messageFormat.parse('{variable1,choice, 1< message1}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0]).to.eql({
          messageAST: [{ string: ' message1' }],
          limits: {
            lower: {
              value: 1,
              type: '>'
            },
            upper: {
              value: Infinity,
              type: '<='
            }
          }
        });
      });

      it('should be able to parse with tabs between keywords', function() {
        var value = {
          messageAST: [{ string: 'message1' }],
          limits: {
            lower: {
              value: 1,
              type: '>'
            },
            upper: {
              value: Infinity,
              type: '<='
            }
          }
        };
        messageFormat.parse('{\tvariable1,choice,1<message1}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0]).to.eql(value);
        messageFormat.parse('{variable1\t,choice,1<message1}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0]).to.eql(value);
        messageFormat.parse('{variable1,\tchoice,1<message1}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0]).to.eql(value);
        messageFormat.parse('{variable1,choice\t,1<message1}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0]).to.eql(value);
        messageFormat.parse('{variable1,choice,\t1<message1}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0]).to.eql(value);
        messageFormat.parse('{variable1,choice, 1<\tmessage1}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values[0]).to.eql({
          messageAST: [{ string: '\tmessage1' }],
          limits: {
            lower: {
              value: 1,
              type: '>'
            },
            upper: {
              value: Infinity,
              type: '<='
            }
          }
        });
      });

      it('should throw en error if \'<\' or \'#\' is missing', function() {
        var method = function() {
          messageFormat.parse('{variable1,choice,1message1}');
        };
        expect(method).to.throw(TypeError, 'Expected a ChoiceFormat case (/^(\\-?\\d+\\.?\\d*[<#]|∞#|\\-∞[<#])$/), instead got \'1\' in {variable1,choice,1m');
      });

      it('should throw en error if the cases are not in order', function() {
        var method = function() {
          messageFormat.parse('{variable1,choice,2<message1|1<message2}');
        };
        expect(method).to.throw(TypeError, 'Case \'1<\' needs to bigger than case \'2<\' in {variable1,choice,2<message1|1<m');
        var method = function() {
          messageFormat.parse('{variable1,choice,1#message1|1<message2}');
        };
        expect(method).to.throw(TypeError, 'Case \'1<\' needs to bigger than case \'1#\' in {variable1,choice,1#message1|1<m');
        var method = function() {
          messageFormat.parse('{variable1,choice,1#message1|-1<message2}');
        };
        expect(method).to.throw(TypeError, 'Case \'-1<\' needs to bigger than case \'1#\' in {variable1,choice,1#message1|-1<m');
        var method = function() {
          messageFormat.parse('{variable1,choice,1#message1|-∞#message2}');
        };
        expect(method).to.throw(TypeError, 'Case \'-∞#\' needs to bigger than case \'1#\' in {variable1,choice,1#message1|-∞#m');
      });

      it('should throw an error if ∞< is used', function() {
         var method = function() {
          messageFormat.parse('{variable1,choice,1#message1|∞<message2}');
        };
        expect(method).to.throw(TypeError, 'Expected a ChoiceFormat case (/^(\\-?\\d+\\.?\\d*[<#]|∞#|\\-∞[<#])$/), instead got \'∞<\' in {variable1,choice,1#message1|∞<m');
      });

      it('should throw an error if same cases appears', function() {
        var method = function() {
          messageFormat.parse('{variable1,choice,1<message1|1<message2}');
        };
        expect(method).to.throw(TypeError, 'Same ChoiceFormat case in {variable1,choice,1<message1|1<m');
      });
    });

    describe('SelectordinalFormat', function() {
      it('should be able to parse a single case', function() {
        messageFormat.parse('{variable1, selectordinal, other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.SelectordinalFormat);
        expect(messageFormat.messageAST[0].values['other'][0].string).to.equal('message1');
      });

      it('should be able to parse a multiple cases', function() {
        messageFormat.parse('{variable1, selectordinal, one{message1} other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.SelectordinalFormat);
        expect(messageFormat.messageAST[0].values['one'][0].string).to.equal('message1');
        expect(messageFormat.messageAST[0].values['other'][0].string).to.equal('message2');
      });

      it('should throw an error if one of the brackets are missing in the values', function() {
        var method = function() {
          messageFormat.parse('{variable1,selectordinal,other message1}}');
        }
        expect(method).to.throw(TypeError, 'Expected bracket \'{\' instead got \'m\' in {variable1,selectordinal,other m');
        var method = function() {
          messageFormat.parse('{variable1,selectordinal,other {message1}');
        }
        expect(method).to.throw(TypeError, 'Expected closing bracket \'}\' in instead got EOF in {variable1,selectordinal,other {message1}');
      });

      it('should throw an error if there is letters or a case after the other case', function() {
        var method = function() {
          messageFormat.parse('{variable1,selectordinal,other {message1}case}');
        }
        expect(method).to.throw(TypeError, 'Expected closing bracket \'}\' in instead got \'c\' in {variable1,selectordinal,other {message1}c');
      });
    });
  });
});
