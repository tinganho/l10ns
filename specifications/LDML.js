
var LDMLPlural_ = require('../libraries/LDML')
  , AST = require('../libraries/LDML/AST');

describe('LDMLPlural', function() {
  describe('parse(string)', function() {
    it('should parse a number comparison with a single character number and with the comparator `=`', function() {
      LDMLPlural_.parse('n = 1');
      expect(LDMLPlural_.ruleAST).to.be.an.instanceOf(AST.NumberComparison);
      expect(LDMLPlural_.ruleAST.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.LHS.modulus).to.equal(null);
      expect(LDMLPlural_.ruleAST.comparator).to.equal('=');
      expect(LDMLPlural_.ruleAST.RHS).to.be.an.instanceOf(AST.RangeList);
      expect(LDMLPlural_.ruleAST.RHS.values[0].value).to.equal(1);
    });

    it('should parse a number comparison with multiple character number and with the comparator `=`', function() {
      LDMLPlural_.parse('n = 10');
      expect(LDMLPlural_.ruleAST).to.be.an.instanceOf(AST.NumberComparison);
      expect(LDMLPlural_.ruleAST.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.LHS.modulus).to.equal(null);
      expect(LDMLPlural_.ruleAST.comparator).to.equal('=');
      expect(LDMLPlural_.ruleAST.RHS).to.be.an.instanceOf(AST.RangeList);
      expect(LDMLPlural_.ruleAST.RHS.values[0].value).to.equal(10);
    });

    it('should parse a number comparison with a single character number and with the comparator `!=`', function() {
      LDMLPlural_.parse('n != 1');
      expect(LDMLPlural_.ruleAST).to.be.an.instanceOf(AST.NumberComparison);
      expect(LDMLPlural_.ruleAST.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.LHS.modulus).to.equal(null);
      expect(LDMLPlural_.ruleAST.comparator).to.equal('!=');
      expect(LDMLPlural_.ruleAST.RHS).to.be.an.instanceOf(AST.RangeList);
      expect(LDMLPlural_.ruleAST.RHS.values[0].value).to.equal(1);
    });

    it('should parse a number comparison with multiple character number and with the comparator `!=`', function() {
      LDMLPlural_.parse('n != 10');
      expect(LDMLPlural_.ruleAST).to.be.an.instanceOf(AST.NumberComparison);
      expect(LDMLPlural_.ruleAST.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.LHS.modulus).to.equal(null);
      expect(LDMLPlural_.ruleAST.comparator).to.equal('!=');
      expect(LDMLPlural_.ruleAST.RHS).to.be.an.instanceOf(AST.RangeList);
      expect(LDMLPlural_.ruleAST.RHS.values[0].value).to.equal(10);
    });

    it('should parse a number comparison with a single character number modulus', function() {
      LDMLPlural_.parse('n % 3 = 1');
      expect(LDMLPlural_.ruleAST).to.be.an.instanceOf(AST.NumberComparison);
      expect(LDMLPlural_.ruleAST.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.LHS.modulus).to.equal(3);
      expect(LDMLPlural_.ruleAST.comparator).to.equal('=');
      expect(LDMLPlural_.ruleAST.RHS).to.be.an.instanceOf(AST.RangeList);
      expect(LDMLPlural_.ruleAST.RHS.values[0].value).to.equal(1);
    });

    it('should parse a number comparison with a multiple character number modulus', function() {
      LDMLPlural_.parse('n % 10 = 1');
      expect(LDMLPlural_.ruleAST).to.be.an.instanceOf(AST.NumberComparison);
      expect(LDMLPlural_.ruleAST.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.LHS.modulus).to.equal(10);
      expect(LDMLPlural_.ruleAST.comparator).to.equal('=');
      expect(LDMLPlural_.ruleAST.RHS).to.be.an.instanceOf(AST.RangeList);
      expect(LDMLPlural_.ruleAST.RHS.values[0].value).to.equal(1);
    });

    it('should parse a number comparison with modulus and `!=`', function() {
      LDMLPlural_.parse('n % 3 != 1');
      expect(LDMLPlural_.ruleAST).to.be.an.instanceOf(AST.NumberComparison);
      expect(LDMLPlural_.ruleAST.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.LHS.modulus).to.equal(3);
      expect(LDMLPlural_.ruleAST.comparator).to.equal('!=');
      expect(LDMLPlural_.ruleAST.RHS).to.be.an.instanceOf(AST.RangeList);
    });

    it('should parse a number comparison group of type and', function() {
      LDMLPlural_.parse('n % 3 = 2 and n % 2 = 6');
      expect(LDMLPlural_.ruleAST).to.be.an.instanceOf(AST.NumberComparisonGroup);
      expect(LDMLPlural_.ruleAST.LHS.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.LHS.LHS.modulus).to.equal(3);
      expect(LDMLPlural_.ruleAST.LHS.comparator).to.equal('=');
      expect(LDMLPlural_.ruleAST.LHS.RHS.values[0].value).to.equal(2);
      expect(LDMLPlural_.ruleAST.RHS.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.RHS.LHS.modulus).to.equal(2);
      expect(LDMLPlural_.ruleAST.RHS.RHS.values[0].value).to.equal(6);
    });

    it('should be able to parse ranges', function() {
      LDMLPlural_.parse('n = 3..5');
      expect(LDMLPlural_.ruleAST.RHS.values[0].from).to.equal(3);
      expect(LDMLPlural_.ruleAST.RHS.values[0].to).to.equal(5);
    });

    it('should be able to parse range list', function() {
      LDMLPlural_.parse('n = 3,5');
      expect(LDMLPlural_.ruleAST.RHS.values[0].value).to.equal(3);
      expect(LDMLPlural_.ruleAST.RHS.values[1].value).to.equal(5);
      LDMLPlural_.parse('n = 3..5');
      expect(LDMLPlural_.ruleAST.RHS.values[0].from).to.equal(3);
      expect(LDMLPlural_.ruleAST.RHS.values[0].to).to.equal(5);
      LDMLPlural_.parse('n = 3..5,6');
      expect(LDMLPlural_.ruleAST.RHS.values[0].from).to.equal(3);
      expect(LDMLPlural_.ruleAST.RHS.values[0].to).to.equal(5);
      expect(LDMLPlural_.ruleAST.RHS.values[1].value).to.equal(6);
      LDMLPlural_.parse('n = 6,3..5');
      expect(LDMLPlural_.ruleAST.RHS.values[0].value).to.equal(6);
      expect(LDMLPlural_.ruleAST.RHS.values[1].from).to.equal(3);
      expect(LDMLPlural_.ruleAST.RHS.values[1].to).to.equal(5);
      LDMLPlural_.parse('n = 3..5,6..9');
      expect(LDMLPlural_.ruleAST.RHS.values[0].from).to.equal(3);
      expect(LDMLPlural_.ruleAST.RHS.values[0].to).to.equal(5);
      expect(LDMLPlural_.ruleAST.RHS.values[1].from).to.equal(6);
      expect(LDMLPlural_.ruleAST.RHS.values[1].to).to.equal(9);
    });

    it('should parse multiple number comparison group of type `and` and `or`', function() {
      LDMLPlural_.parse('n % 3 = 2 and n % 2 = 6 or n = 10');

      // First
      expect(LDMLPlural_.ruleAST).to.be.an.instanceOf(AST.NumberComparisonGroup);
      expect(LDMLPlural_.ruleAST.LHS.LHS.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.LHS.LHS.LHS.modulus).to.equal(3);
      expect(LDMLPlural_.ruleAST.LHS.LHS.comparator).to.equal('=');
      expect(LDMLPlural_.ruleAST.LHS.LHS.RHS.values[0].value).to.equal(2);

      // Second
      expect(LDMLPlural_.ruleAST.LHS.RHS.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.LHS.RHS.LHS.modulus).to.equal(2);
      expect(LDMLPlural_.ruleAST.LHS.RHS.comparator).to.equal('=');
      expect(LDMLPlural_.ruleAST.LHS.RHS.RHS.values[0].value).to.equal(6);

      // Third
      expect(LDMLPlural_.ruleAST.RHS.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.RHS.LHS.modulus).to.equal(null);
      expect(LDMLPlural_.ruleAST.RHS.comparator).to.equal('=');
      expect(LDMLPlural_.ruleAST.RHS.RHS.values[0].value).to.equal(10);

      LDMLPlural_.parse('n % 3 = 2 or n % 2 = 6 and n = 10');

      // First
      expect(LDMLPlural_.ruleAST).to.be.an.instanceOf(AST.NumberComparisonGroup);
      expect(LDMLPlural_.ruleAST.LHS.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.LHS.LHS.modulus).to.equal(3);
      expect(LDMLPlural_.ruleAST.LHS.comparator).to.equal('=');
      expect(LDMLPlural_.ruleAST.LHS.RHS.values[0].value).to.equal(2);

      // Second
      expect(LDMLPlural_.ruleAST.RHS.LHS.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.RHS.LHS.LHS.modulus).to.equal(2);
      expect(LDMLPlural_.ruleAST.RHS.LHS.comparator).to.equal('=');
      expect(LDMLPlural_.ruleAST.RHS.LHS.RHS.values[0].value).to.equal(6);

      // Third
      expect(LDMLPlural_.ruleAST.RHS.RHS.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.RHS.RHS.LHS.modulus).to.equal(null);
      expect(LDMLPlural_.ruleAST.RHS.RHS.comparator).to.equal('=');
      expect(LDMLPlural_.ruleAST.RHS.RHS.RHS.values[0].value).to.equal(10);

      LDMLPlural_.parse('n % 3 = 2 or n % 2 = 6 and n = 10 or n != 6');

      // First
      expect(LDMLPlural_.ruleAST).to.be.an.instanceOf(AST.NumberComparisonGroup);
      expect(LDMLPlural_.ruleAST.LHS.LHS.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.LHS.LHS.LHS.modulus).to.equal(3);
      expect(LDMLPlural_.ruleAST.LHS.LHS.comparator).to.equal('=');
      expect(LDMLPlural_.ruleAST.LHS.LHS.RHS.values[0].value).to.equal(2);

      // Second
      expect(LDMLPlural_.ruleAST.LHS.RHS.LHS.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.LHS.RHS.LHS.LHS.modulus).to.equal(2);
      expect(LDMLPlural_.ruleAST.LHS.RHS.LHS.comparator).to.equal('=');
      expect(LDMLPlural_.ruleAST.LHS.RHS.LHS.RHS.values[0].value).to.equal(6);

      // Third
      expect(LDMLPlural_.ruleAST.LHS.RHS.RHS.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.LHS.RHS.RHS.LHS.modulus).to.equal(null);
      expect(LDMLPlural_.ruleAST.LHS.RHS.RHS.comparator).to.equal('=');
      expect(LDMLPlural_.ruleAST.LHS.RHS.RHS.RHS.values[0].value).to.equal(10);

      // Fourth
      expect(LDMLPlural_.ruleAST.RHS.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.RHS.LHS.modulus).to.equal(null);
      expect(LDMLPlural_.ruleAST.RHS.comparator).to.equal('!=');
      expect(LDMLPlural_.ruleAST.RHS.RHS.values[0].value).to.equal(6);

      LDMLPlural_.parse('n % 3 = 2 and n % 2 = 6 or n = 10,11 and n != 6..9');

      // First
      expect(LDMLPlural_.ruleAST).to.be.an.instanceOf(AST.NumberComparisonGroup);
      expect(LDMLPlural_.ruleAST.LHS.LHS.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.LHS.LHS.LHS.modulus).to.equal(3);
      expect(LDMLPlural_.ruleAST.LHS.LHS.comparator).to.equal('=');
      expect(LDMLPlural_.ruleAST.LHS.LHS.RHS.values[0].value).to.equal(2);

      // Second
      expect(LDMLPlural_.ruleAST.LHS.RHS.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.LHS.RHS.LHS.modulus).to.equal(2);
      expect(LDMLPlural_.ruleAST.LHS.RHS.comparator).to.equal('=');
      expect(LDMLPlural_.ruleAST.LHS.RHS.RHS.values[0].value).to.equal(6);

      // Third
      expect(LDMLPlural_.ruleAST.RHS.LHS.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.RHS.LHS.LHS.modulus).to.equal(null);
      expect(LDMLPlural_.ruleAST.RHS.LHS.comparator).to.equal('=');
      expect(LDMLPlural_.ruleAST.RHS.LHS.RHS.values[0].value).to.equal(10);
      expect(LDMLPlural_.ruleAST.RHS.LHS.RHS.values[1].value).to.equal(11);

      // Fourth
      expect(LDMLPlural_.ruleAST.RHS.RHS.LHS.variable).to.equal('n');
      expect(LDMLPlural_.ruleAST.RHS.RHS.LHS.modulus).to.equal(null);
      expect(LDMLPlural_.ruleAST.RHS.RHS.comparator).to.equal('!=');
      expect(LDMLPlural_.ruleAST.RHS.RHS.RHS.values[0].from).to.equal(6);
      expect(LDMLPlural_.ruleAST.RHS.RHS.RHS.values[0].to).to.equal(9);
    });

    it('should parse integer example', function() {
      LDMLPlural_.parse('n = 1 @integer 1');
      expect(LDMLPlural_.integerExample).to.eql(['1']);
    });

    it('should parse decimal exampl', function() {
      LDMLPlural_.parse('n = 1 @decimal 1.0, 1.00, 1.000');
      expect(LDMLPlural_.decimalExample).to.eql(['1.0', '1.00', '1.000']);
    });

    it('should parse both decimal and integer example', function() {
      LDMLPlural_.parse('n = 1 @integer 1 @decimal 1.0, 1.00, 1.000');
      expect(LDMLPlural_.integerExample).to.eql(['1']);
      expect(LDMLPlural_.decimalExample).to.eql(['1.0', '1.00', '1.000']);
    });
  });
});
