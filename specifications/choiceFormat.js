
var MessageFormat = require('../libraries/MessageFormat')
  , messageFormat = new MessageFormat('en-US')
  , AST = require('../libraries/MessageFormat/AST');

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
