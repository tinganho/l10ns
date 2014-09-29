
var MessageFormat = require('../libraries/MessageFormat')
  , messageFormat = new MessageFormat('en-US')
  , AST = require('../libraries/MessageFormat/AST');

project.currencies = ['USD'];

describe('MessageFormat', function() {
  describe('#constructor', function() {
    it('should read decimal pattern', function() {
      var messageFormat = new MessageFormat('en-US');
      expect(messageFormat.decimalPattern.positive.groupSize).to.eql({
        primary: 3,
        secondary: 3
      });
      expect(messageFormat.decimalPattern.positive).to.include({
        patternLength: 9,
      });
      expect(messageFormat.decimalPattern.positive.integer).to.eql({
        leftAbsentNumbers: 3,
        nonAbsentNumbers: 1
      });
      expect(messageFormat.decimalPattern.positive.fraction).to.eql({
        nonAbsentNumbers: 0,
        rightAbsentNumbers: 3
      });
    });

    it('should read percentage pattern', function() {
      var messageFormat = new MessageFormat('en-US');
      expect(messageFormat.percentagePattern.positive.percentage).to.equal(true);
      expect(messageFormat.percentagePattern.positive.patternLength).to.equal(6);
      expect(messageFormat.percentagePattern.positive.suffix).to.equal('%');
      expect(messageFormat.percentagePattern.positive.groupSize).to.eql({
        primary: 3,
        secondary: 3
      });
      expect(messageFormat.percentagePattern.positive.integer).to.eql({
        leftAbsentNumbers: 3,
        nonAbsentNumbers: 1
      });
    });

    it('should read currencies', function() {
      var messageFormat = new MessageFormat('en-US');
      expect(messageFormat.currencies).to.eql({
        'USD': {
          name: 'US Dollar',
          text: {
            local: {
              one: 'dollar',
              other: 'dollars'
            },
            global: {
              one: 'US dollar',
              other: 'US dollars'
            }
          },
          symbol: {
            local: '$',
            global: 'US$',
            reverseGlobal: '$US'
          }
        }
      });
    });

    it('should read currency unit patterns', function() {
      var messageFormat = new MessageFormat('en-US');
      expect(messageFormat.currencyUnitPattern).to.eql({
        one: '{0} {1}',
        other: '{0} {1}'
      });
    });

    it('should read number sumbols', function() {
      var messageFormat = new MessageFormat('en-US');
      expect(messageFormat.numberSymbols).to.eql({
        decimal: '.',
        group: ',',
        list: ';',
        percentSign: '%',
        plusSign: '+',
        minusSign: '-',
        exponential: 'E',
        superscriptingExponent: '×',
        perMille: '‰',
        infinity: '∞',
        nan: 'NaN'
      });
    });
  });

  describe('#parse(string)', function() {
    describe('Sentences', function() {
      it('should parse a sentence', function() {
        messageFormat.parse('sentence');
        expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.Sentence);
        expect(messageFormat.messageAST[0].string).to.equal('sentence');
        expect(messageFormat.messageAST.length).to.equal(1);
      });

      it('should escape diagraph character in non-choice format context', function() {
        messageFormat.parse('sentence1 | sentence2');
        expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.Sentence);
        expect(messageFormat.messageAST[0].string).to.equal('sentence1 | sentence2');
        expect(messageFormat.messageAST.length).to.equal(1);

        messageFormat.parse('{variable1, plural, other{sentence1 | sentence2}}');
        expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.PluralFormat);
        expect(messageFormat.messageAST[0].values['other'][0]).to.be.an.instanceOf(AST.Sentence);
        expect(messageFormat.messageAST[0].values['other'][0].string).to.equal('sentence1 | sentence2');

        messageFormat.parse('{variable1, select, other{sentence1 | sentence2}}');
        expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.SelectFormat);
        expect(messageFormat.messageAST[0].values['other'][0]).to.be.an.instanceOf(AST.Sentence);
        expect(messageFormat.messageAST[0].values['other'][0].string).to.equal('sentence1 | sentence2');

        messageFormat.parse('{variable1, selectordinal, other{sentence1 | sentence2}}');
        expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.SelectordinalFormat);
        expect(messageFormat.messageAST[0].values['other'][0]).to.be.an.instanceOf(AST.Sentence);
        expect(messageFormat.messageAST[0].values['other'][0].string).to.equal('sentence1 | sentence2');
      });

      it('should parse escaped sentences', function() {
        messageFormat.parse('sentence\'{\'');
        expect(messageFormat.messageAST[0].string).to.equal('sentence{');
        expect(messageFormat.messageAST.length).to.equal(1);
        messageFormat.parse('sentence\'}\'');
        expect(messageFormat.messageAST[0].string).to.equal('sentence}');
        expect(messageFormat.messageAST.length).to.equal(1);
        messageFormat.parse('\'{\'sentence\'{\'');
        expect(messageFormat.messageAST[0].string).to.equal('{sentence{');
        expect(messageFormat.messageAST.length).to.equal(1);
        messageFormat.parse('{variable1, choice, 1<\'|\'}');
        expect(messageFormat.messageAST[0].values[0].messageAST[0].string).to.equal('|');
        messageFormat.parse('{variable1, plural, other{\'#\'}}');
        expect(messageFormat.messageAST[0].values['other'][0].string).to.equal('#');
      });

      it('should not escape if it does not percede a special character', function() {
        messageFormat.parse('don\'t');
        expect(messageFormat.messageAST[0].string).to.equal('don\'t');
        expect(messageFormat.messageAST.length).to.equal(1);
      });

      it('should be able to parse a sentence only containing #', function() {
        messageFormat.parse('#');
        expect(messageFormat.messageAST[0].string).to.equal('#');
        expect(messageFormat.messageAST.length).to.equal(1);
      });

      it('should throw an error if an unescaped reserved character is used', function() {
        function method() {
          messageFormat.parse('sentence {');
        }
        expect(method).to.throw(TypeError, 'Could not parse variable in sentence {');
      });

      it('should throw an error if a missing ending quote is missing in sentence', function() {
        function method() {
          messageFormat.parse('sentence\'{');
        }
        expect(method).to.throw(TypeError, 'Escape message doesn\'t have an ending quote(\') in sentence\'{');
      });

      it('should throw en error if a missing ending quote is missing in a choice value', function() {
        function method() {
          messageFormat.parse('{variable1, choice, 1<\'|}');
        }
        expect(method).to.throw(TypeError, 'Escape message doesn\'t have an ending quote(\') in {variable1, choice, 1<\'|}');
      });

      it('should throw en error if a missing ending quote is missing in a plural value', function() {
        function method() {
          messageFormat.parse('{variable1, plural, other{\'#}}');
        }
        expect(method).to.throw(TypeError, 'Escape message doesn\'t have an ending quote(\') in {variable1, plural, other{\'#}}');
      });
    });

    describe('Variables', function() {
      afterEach(function() {
        messageFormat.unsetVariables();
      });

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
        };
        expect(method).to.throw(TypeError, 'Variable names must be alpha numeric, got a \'!\' in {!');
        var method = function() {
          messageFormat.parse('{varia!ble1}');
        };
        expect(method).to.throw(TypeError, 'Variable names must be alpha numeric, got a \'!\' in {varia!');
        var method = function() {
          messageFormat.parse('{variable1!}');
        };
        expect(method).to.throw(TypeError, 'Variable names must be alpha numeric, got a \'!\' in {variable1!');
        var method = function() {
          messageFormat.parse('{variable1}{varia!ble2}');
        };
        expect(method).to.throw(TypeError, 'Variable names must be alpha numeric, got a \'!\' in {variable1}{varia');
      });

      it('should throw an error if an undefined variable is used', function() {
        var method = function() {
          messageFormat.setVariables(['variable2']);
          messageFormat.parse('{variable1}');
        };
        expect(method).to.throw(TypeError, 'Variable \'variable1\' is not defined in \'{variable1}\'. Please tell your developer to add the variable to his source code and update translations.');
      });
    });

    require('./numberFormat');
    require('./currencyFormat');

    describe('PluralFormat', function() {
      afterEach(function() {
        messageFormat.unsetVariables();
      });

      it('should be able to parse a single case', function() {
        messageFormat.parse('{variable1,plural,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
      });

      it('should be able to parse with multiple cases using keywords', function() {
        messageFormat.parse('{variable1,plural,one{message1} other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].offset).to.equal(0);
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
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
        messageFormat.parse('{variable1, plural, one {message1} other {#sentence1}}');
        expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.PluralFormat);
        expect(messageFormat.messageAST[0].offset).to.equal(0);
        expect(messageFormat.messageAST[0].values['other'][0]).to.be.an.instanceOf(AST.Remaining);
        expect(messageFormat.messageAST[0].values['other'][0].offset).to.equal(0);
        expect(messageFormat.messageAST[0].values['other'][0].variable.name).to.equal('variable1');
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
        expect(method).to.throw(TypeError, 'There must exist one other case in {variable1,plural,one{message1}}');
      });

      it('should throw an error if there is one case that is not defined in the plural rules', function() {
        var method = function() {
          messageFormat.parse('{variable1,plural,few{message1}other{message2}}');
        }
        expect(method).to.throw(TypeError, 'Expected a keyword (one, other) or an exact case (n=). Instead got \'few\' in {variable1,plural,few{');
        var method = function() {
          messageFormat.parse('{variable1,plural,somecase{message1}other{message2}}');
        }
        expect(method).to.throw(TypeError, 'Expected a keyword (one, other) or an exact case (n=). Instead got \'somecase\' in {variable1,plural,somecase{');
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

      it('should throw an error if one undefined variable is used', function() {
        var method = function() {
          messageFormat.setVariables(['variable2'])
          messageFormat.parse('{variable1,plural,other {message1}}');
        }
        expect(method).to.throw(TypeError, 'Variable \'variable1\' is not defined in \'{variable1,\'. Please tell your developer to add the variable to his source code and update translations.');
      });
    });

    describe('SelectFormat', function() {
      afterEach(function() {
        messageFormat.unsetVariables();
      });

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

      it('should throw an error if one undefined variable is used', function() {
        var method = function() {
          messageFormat.setVariables(['variable2'])
          messageFormat.parse('{variable1,select,other {message1}}');
        }
        expect(method).to.throw(TypeError, 'Variable \'variable1\' is not defined in \'{variable1,\'. Please tell your developer to add the variable to his source code and update translations.');
      });
    });

    describe('ChoiceFormat', function() {
      afterEach(function() {
        messageFormat.unsetVariables();
      });

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
        expect(method).to.throw(TypeError, 'Expected a ChoiceFormat case (n<, n#, ∞#, -∞<) in {variable1,choice,1m');
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
        expect(method).to.throw(TypeError, 'Expected a ChoiceFormat case (n<, n#, ∞#, -∞<) in {variable1,choice,1#message1|∞<m');
      });

      it('should throw an error if same cases appears', function() {
        var method = function() {
          messageFormat.parse('{variable1,choice,1<message1|1<message2}');
        };
        expect(method).to.throw(TypeError, 'Same ChoiceFormat case in {variable1,choice,1<message1|1<m');
      });

      it('should throw an error if one undefined variable is used', function() {
        var method = function() {
          messageFormat.setVariables(['variable2'])
          messageFormat.parse('{variable1,choice,1<message1|2<message2}');
        }
        expect(method).to.throw(TypeError, 'Variable \'variable1\' is not defined in \'{variable1,\'. Please tell your developer to add the variable to his source code and update translations.');
      });
    });

    describe('SelectordinalFormat', function() {
      afterEach(function() {
        messageFormat.unsetVariables();
      });

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

      it('should throw an error if one undefined variable is used', function() {
        var method = function() {
          messageFormat.setVariables(['variable2'])
          messageFormat.parse('{variable1,selectordinal,other {message1}}');
        }
        expect(method).to.throw(TypeError, 'Variable \'variable1\' is not defined in \'{variable1,\'. Please tell your developer to add the variable to his source code and update translations.');
      });

      it('should throw an error if there is one case that is not defined in the ordinal rules', function() {
        var method = function() {
          messageFormat.parse('{variable1,selectordinal,many{message1}other{message2}}');
        }
        expect(method).to.throw(TypeError, 'Expected a keyword (one, two, few, other). Instead got \'many\' in {variable1,selectordinal,many{');
        var method = function() {
          messageFormat.parse('{variable1,selectordinal,somecase{message1}other{message2}}');
        }
        expect(method).to.throw(TypeError, 'Expected a keyword (one, two, few, other). Instead got \'somecase\' in {variable1,selectordinal,somecase{');
      });
    });
  });
});
