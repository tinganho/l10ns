
var MessageFormat = require('../libraries/MessageFormat')
  , messageFormat = new MessageFormat('en-US')
  , AST = require('../libraries/MessageFormat/AST');

describe('DateFormat', function() {
  describe('Era', function() {
    it('should be able to parse an abbreviated era format', function() {
      messageFormat.parse('{variable1, date, G}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Era);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Era.Types.ABBREVIATED);
      messageFormat.parse('{variable1, date, GG}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Era);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Era.Types.ABBREVIATED);
      messageFormat.parse('{variable1, date, GGG}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Era);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Era.Types.ABBREVIATED);
    });

    it('should be able to parse a full era format', function() {
      messageFormat.parse('{variable1, date, GGGG}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Era);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Era.Types.FULL);
    });

    it('should be able to parse a full narrow format', function() {
      messageFormat.parse('{variable1, date, GGGGG}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Era);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Era.Types.NARROW);
    });

    it('should begin use a new identifier(s) if exceeding length of 5', function() {
      messageFormat.parse('{variable1, date, GGGGGG}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Era);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Era.Types.NARROW);
      expect(messageFormat.messageAST[0].AST[1]).to.be.an.instanceOf(AST.date.Era);
      expect(messageFormat.messageAST[0].AST[1].format).to.equal(AST.date.Era.Types.ABBREVIATED);
    });
  });

  describe('Year', function() {
    it('should be able to parse a calendar year identifier', function() {
      messageFormat.parse('{variable1, date, y}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Year);
      expect(messageFormat.messageAST[0].AST[0].length).to.equal(1);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.Year.Types.CALENDAR);
      messageFormat.parse('{variable1, date, yy}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Year);
      expect(messageFormat.messageAST[0].AST[0].length).to.equal(2);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.Year.Types.CALENDAR);
    });

    it('should be able to parse a week based year identifier', function() {
      messageFormat.parse('{variable1, date, Y}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Year);
      expect(messageFormat.messageAST[0].AST[0].length).to.equal(1);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.Year.Types.WEEK_BASED);
      messageFormat.parse('{variable1, date, YY}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Year);
      expect(messageFormat.messageAST[0].AST[0].length).to.equal(2);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.Year.Types.WEEK_BASED);
    });

    it('should be able to parse a week based year identifier', function() {
      messageFormat.parse('{variable1, date, u}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Year);
      expect(messageFormat.messageAST[0].AST[0].length).to.equal(1);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.Year.Types.EXTENDED);
      messageFormat.parse('{variable1, date, uu}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Year);
      expect(messageFormat.messageAST[0].AST[0].length).to.equal(2);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.Year.Types.EXTENDED);
    });

    it('should be able to parse a cyclic year identifier', function() {
      messageFormat.parse('{variable1, date, U}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.CyclicYear);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.CyclicYear.Types.ABBREVIATED);
      messageFormat.parse('{variable1, date, UUUUUU}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST.length).to.equal(2);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.CyclicYear);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.CyclicYear.Types.ABBREVIATED);
      expect(messageFormat.messageAST[0].AST[1]).to.be.an.instanceOf(AST.date.CyclicYear);
      expect(messageFormat.messageAST[0].AST[1].format).to.equal(AST.date.CyclicYear.Types.ABBREVIATED);
    });
  });

  describe('Quarter', function() {
    it('should be able to parse a formated quarter identifier', function() {
      messageFormat.parse('{variable1, date, Q}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Quarter);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Quarter.Context.FORMATED);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Quarter.Formats.NUMERIC);
    });

    it('should be able to parse two consecutive formated quarter identifier', function() {
      messageFormat.parse('{variable1, date, QQ}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Quarter);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Quarter.Context.FORMATED);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Quarter.Formats.NUMERIC_WITH_PADDING);
    });

    it('should be able to parse three consecutive formated quarter identifier', function() {
      messageFormat.parse('{variable1, date, QQQ}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Quarter);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Quarter.Context.FORMATED);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Quarter.Formats.ABBREVIATED);
    });

    it('should be able to parse four consecutive formated quarter identifier', function() {
      messageFormat.parse('{variable1, date, QQQQ}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Quarter);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Quarter.Context.FORMATED);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Quarter.Formats.FULL);
    });

    it('shoud begin with a new formated quarter when maxium consecutive identifiers have been reached', function() {
      messageFormat.parse('{variable1, date, QQQQQ}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST.length).to.equal(2);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Quarter);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Quarter.Context.FORMATED);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Quarter.Formats.FULL);
      expect(messageFormat.messageAST[0].AST[1]).to.be.an.instanceOf(AST.date.Quarter);
      expect(messageFormat.messageAST[0].AST[1].context).to.equal(AST.date.Quarter.Context.FORMATED);
      expect(messageFormat.messageAST[0].AST[1].format).to.equal(AST.date.Quarter.Formats.NUMERIC);
    });

    it('should be able to parse a stand-alone quarter identifier', function() {
      messageFormat.parse('{variable1, date, q}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Quarter);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Quarter.Context.STAND_ALONE);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Quarter.Formats.NUMERIC);
    });

    it('should be able to parse two consecutive stand-alone quarter identifier', function() {
      messageFormat.parse('{variable1, date, qq}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Quarter);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Quarter.Context.STAND_ALONE);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Quarter.Formats.NUMERIC_WITH_PADDING);
    });

    it('should be able to parse three consecutive stand-alone quarter identifier', function() {
      messageFormat.parse('{variable1, date, qqq}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Quarter);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Quarter.Context.STAND_ALONE);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Quarter.Formats.ABBREVIATED);
    });

    it('should be able to parse four consecutive stand-alone quarter identifier', function() {
      messageFormat.parse('{variable1, date, qqqq}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Quarter);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Quarter.Context.STAND_ALONE);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Quarter.Formats.FULL);
    });

    it('shoud begin with a new stand-alone quarter when maxium consecutive identifiers have been reached', function() {
      messageFormat.parse('{variable1, date, qqqqq}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST.length).to.equal(2);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Quarter);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Quarter.Context.STAND_ALONE);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Quarter.Formats.FULL);
      expect(messageFormat.messageAST[0].AST[1]).to.be.an.instanceOf(AST.date.Quarter);
      expect(messageFormat.messageAST[0].AST[1].context).to.equal(AST.date.Quarter.Context.STAND_ALONE);
      expect(messageFormat.messageAST[0].AST[1].format).to.equal(AST.date.Quarter.Formats.NUMERIC);
    });
  });

  describe('Month', function() {
    it('should be able to parse a formated month identifier', function() {
      messageFormat.parse('{variable1, date, M}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Month);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Month.Context.FORMATED);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Month.Formats.NUMERIC);
    });

    it('should be able to parse two consecutive formated month identifier', function() {
      messageFormat.parse('{variable1, date, MM}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Month);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Month.Context.FORMATED);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Month.Formats.NUMERIC_WITH_PADDING);
    });

    it('should be able to parse three consecutive formated month identifier', function() {
      messageFormat.parse('{variable1, date, MMM}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Month);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Month.Context.FORMATED);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Month.Formats.SHORT);
    });

    it('should be able to parse four consecutive formated month identifier', function() {
      messageFormat.parse('{variable1, date, MMMM}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Month);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Month.Context.FORMATED);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Month.Formats.WIDE);
    });

    it('should be able to parse five consecutive formated month identifier', function() {
      messageFormat.parse('{variable1, date, MMMMM}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Month);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Month.Context.FORMATED);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Month.Formats.NARROW);
    });

    it('should begin with a new formated quarter when maxium consecutive identifiers have been reached', function() {
      messageFormat.parse('{variable1, date, MMMMMM}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST.length).to.equal(2);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Month);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Month.Context.FORMATED);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Month.Formats.NARROW);
      expect(messageFormat.messageAST[0].AST[1]).to.be.an.instanceOf(AST.date.Month);
      expect(messageFormat.messageAST[0].AST[1].context).to.equal(AST.date.Month.Context.FORMATED);
      expect(messageFormat.messageAST[0].AST[1].format).to.equal(AST.date.Month.Formats.NUMERIC);
    });

    it('should be able to parse a formated month identifier', function() {
      messageFormat.parse('{variable1, date, L}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Month);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Month.Context.STAND_ALONE);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Month.Formats.NUMERIC);
    });

    it('should be able to parse two consecutive formated month identifier', function() {
      messageFormat.parse('{variable1, date, LL}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Month);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Month.Context.STAND_ALONE);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Month.Formats.NUMERIC_WITH_PADDING);
    });

    it('should be able to parse three consecutive formated month identifier', function() {
      messageFormat.parse('{variable1, date, LLL}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Month);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Month.Context.STAND_ALONE);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Month.Formats.SHORT);
    });

    it('should be able to parse four consecutive formated month identifier', function() {
      messageFormat.parse('{variable1, date, LLLL}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Month);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Month.Context.STAND_ALONE);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Month.Formats.WIDE);
    });

    it('should be able to parse five consecutive formated month identifier', function() {
      messageFormat.parse('{variable1, date, LLLLL}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Month);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Month.Context.STAND_ALONE);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Month.Formats.NARROW);
    });

    it('should begin with a new formated quarter when maxium consecutive identifiers have been reached', function() {
      messageFormat.parse('{variable1, date, LLLLLL}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST.length).to.equal(2);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Month);
      expect(messageFormat.messageAST[0].AST[0].context).to.equal(AST.date.Month.Context.STAND_ALONE);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Month.Formats.NARROW);
      expect(messageFormat.messageAST[0].AST[1]).to.be.an.instanceOf(AST.date.Month);
      expect(messageFormat.messageAST[0].AST[1].context).to.equal(AST.date.Month.Context.STAND_ALONE);
      expect(messageFormat.messageAST[0].AST[1].format).to.equal(AST.date.Month.Formats.NUMERIC);
    });
  });
});
