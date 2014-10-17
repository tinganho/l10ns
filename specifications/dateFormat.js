
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

    it('should begin with a new formated quarter when maximum consecutive identifiers have been exceeded', function() {
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

  describe('Week', function() {
    it('should be able to parse a week of year identifier', function() {
      messageFormat.parse('{variable1, date, w}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Week);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.Week.Types.WEEK_OF_YEAR);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Week.Formats.NUMERIC);
    });

    it('should be able to parse two consecutive week of year identifiers', function() {
      messageFormat.parse('{variable1, date, ww}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Week);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.Week.Types.WEEK_OF_YEAR);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Week.Formats.NUMERIC_WITH_PADDING);
    });

    it('should begin with a new week of year when maximum consecutive identifiers have been exceeded', function() {
      messageFormat.parse('{variable1, date, www}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST.length).to.equal(2);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Week);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.Week.Types.WEEK_OF_YEAR);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Week.Formats.NUMERIC_WITH_PADDING);
      expect(messageFormat.messageAST[0].AST[1]).to.be.an.instanceOf(AST.date.Week);
      expect(messageFormat.messageAST[0].AST[1].type).to.equal(AST.date.Week.Types.WEEK_OF_YEAR);
      expect(messageFormat.messageAST[0].AST[1].format).to.equal(AST.date.Week.Formats.NUMERIC);
    });

    it('should be able to parse a week of month identifier', function() {
      messageFormat.parse('{variable1, date, W}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Week);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.Week.Types.WEEK_OF_MONTH);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Week.Formats.NUMERIC);
    });

    it('should begin with a new week of month when maximum consecutive identifiers have been exceeded', function() {
      messageFormat.parse('{variable1, date, WW}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST.length).to.equal(2);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.Week);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.Week.Types.WEEK_OF_MONTH);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.Week.Formats.NUMERIC);
      expect(messageFormat.messageAST[0].AST[1]).to.be.an.instanceOf(AST.date.Week);
      expect(messageFormat.messageAST[0].AST[1].type).to.equal(AST.date.Week.Types.WEEK_OF_MONTH);
      expect(messageFormat.messageAST[0].AST[1].format).to.equal(AST.date.Week.Formats.NUMERIC);
    });
  });

  describe('Day', function() {
    it('should be able to parse a day of month identifier', function() {
      messageFormat.parse('{variable1, date, d}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.day.DayOfMonth);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.day.DayOfMonth.Formats.NUMERIC);
    });

    it('should be able to parse two consecutive day of month identifiers', function() {
      messageFormat.parse('{variable1, date, dd}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.day.DayOfMonth);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.day.DayOfMonth.Formats.NUMERIC_WITH_PADDING);
    });

    it('should begin with a new day of month when maximum consecutive identifiers have been exceeded', function() {
      messageFormat.parse('{variable1, date, ddd}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST.length).to.equal(2);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.day.DayOfMonth);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.day.DayOfMonth.Formats.NUMERIC_WITH_PADDING);
      expect(messageFormat.messageAST[0].AST[1]).to.be.an.instanceOf(AST.date.day.DayOfMonth);
      expect(messageFormat.messageAST[0].AST[1].format).to.equal(AST.date.day.DayOfMonth.Formats.NUMERIC);
    });

    it('should be able to parse a day of year identifier', function() {
      messageFormat.parse('{variable1, date, D}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.day.DayOfYear);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.day.DayOfYear.Formats.WITHOUT_PADDING);
    });

    it('should be able to parse two consecutive day of year identifiers', function() {
      messageFormat.parse('{variable1, date, DD}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.day.DayOfYear);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.day.DayOfYear.Formats.WITH_ONE_ZERO_PADDING);
    });

    it('should be able to parse three consecutive day of year identifiers', function() {
      messageFormat.parse('{variable1, date, DDD}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.day.DayOfYear);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.day.DayOfYear.Formats.WITH_TWO_ZERO_PADDING);
    });

    it('should begin with a new day of year when maximum consecutive identifiers have been exceeded', function() {
      messageFormat.parse('{variable1, date, DDDD}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST.length).to.equal(2);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.day.DayOfYear);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.day.DayOfYear.Formats.WITH_TWO_ZERO_PADDING);
      expect(messageFormat.messageAST[0].AST[1]).to.be.an.instanceOf(AST.date.day.DayOfYear);
      expect(messageFormat.messageAST[0].AST[1].format).to.equal(AST.date.day.DayOfYear.Formats.WITHOUT_PADDING);
    });

    it('should be able to parse a day of week in month identifier', function() {
      messageFormat.parse('{variable1, date, F}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.day.DayOfWeekInMonth);
    });

    it('should begin with a new day of week in month when maximum consecutive identifiers have been exceeded', function() {
      messageFormat.parse('{variable1, date, FF}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST.length).to.equal(2);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.day.DayOfWeekInMonth);
      expect(messageFormat.messageAST[0].AST[1]).to.be.an.instanceOf(AST.date.day.DayOfWeekInMonth);
    });

    it('should be able to parse a modified Julian day', function() {
      messageFormat.parse('{variable1, date, g}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.day.ModifiedJulianDay);
      expect(messageFormat.messageAST[0].AST[0].length).to.equal(1);
      messageFormat.parse('{variable1, date, gg}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.day.ModifiedJulianDay);
      expect(messageFormat.messageAST[0].AST[0].length).to.equal(2);
    });
  });

  describe('WeekDay', function() {
    it('should be able to parse a day of week identifier', function() {
      messageFormat.parse('{variable1, date, E}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.weekDay.DayOfWeek);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.weekDay.DayOfWeek.Formats.SHORT);
    });

    it('should be able to parse two consecutive day of week identifiers', function() {
      messageFormat.parse('{variable1, date, EE}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.weekDay.DayOfWeek);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.weekDay.DayOfWeek.Formats.SHORT);
    });

    it('should be able to parse three consecutive day of week identifiers', function() {
      messageFormat.parse('{variable1, date, EEE}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.weekDay.DayOfWeek);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.weekDay.DayOfWeek.Formats.SHORT);
    });

    it('should be able to parse four consecutive day of week identifiers', function() {
      messageFormat.parse('{variable1, date, EEEE}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.weekDay.DayOfWeek);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.weekDay.DayOfWeek.Formats.FULL);
    });

    it('should be able to parse five consecutive day of week identifiers', function() {
      messageFormat.parse('{variable1, date, EEEEE}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.weekDay.DayOfWeek);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.weekDay.DayOfWeek.Formats.NARROW);
    });

    it('should be able to parse six consecutive day of week identifiers', function() {
      messageFormat.parse('{variable1, date, EEEEEE}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.weekDay.DayOfWeek);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.weekDay.DayOfWeek.Formats.ABBREVIATED);
    });

    it('should begin with a new day of week when maximum consecutive identifiers have been exceeded', function() {
      messageFormat.parse('{variable1, date, EEEEEEE}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST.length).to.equal(2);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.weekDay.DayOfWeek);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.weekDay.DayOfWeek.Formats.ABBREVIATED);
      expect(messageFormat.messageAST[0].AST[1]).to.be.an.instanceOf(AST.date.weekDay.DayOfWeek);
      expect(messageFormat.messageAST[0].AST[1].format).to.equal(AST.date.weekDay.DayOfWeek.Formats.SHORT);
    });

    it('should be able to parse a local day of week identifier', function() {
      messageFormat.parse('{variable1, date, e}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.weekDay.LocalDayOfWeek);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.weekDay.LocalDayOfWeek.Formats.NUMERIC);
    });

    it('should be able to parse two consecutive local day of week identifiers', function() {
      messageFormat.parse('{variable1, date, ee}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.weekDay.LocalDayOfWeek);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.weekDay.LocalDayOfWeek.Formats.NUMERIC_WITH_PADDING);
    });

    it('should be able to parse three consecutive local day of week identifiers', function() {
      messageFormat.parse('{variable1, date, eee}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.weekDay.LocalDayOfWeek);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.weekDay.LocalDayOfWeek.Formats.SHORT);
    });

    it('should be able to parse four consecutive local day of week identifiers', function() {
      messageFormat.parse('{variable1, date, eeee}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.weekDay.LocalDayOfWeek);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.weekDay.LocalDayOfWeek.Formats.FULL);
    });

    it('should be able to five two consecutive local day of week identifiers', function() {
      messageFormat.parse('{variable1, date, eeeee}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.weekDay.LocalDayOfWeek);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.weekDay.LocalDayOfWeek.Formats.NARROW);
    });

    it('should be able to six two consecutive local day of week identifiers', function() {
      messageFormat.parse('{variable1, date, eeeeee}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.weekDay.LocalDayOfWeek);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.weekDay.LocalDayOfWeek.Formats.ABBREVIATED);
    });

    it('should begin with a new local day of week if the length of maximum consecutive identifiers have been exceeded', function() {
      messageFormat.parse('{variable1, date, eeeeeee}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST.length).to.equal(2);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.weekDay.LocalDayOfWeek);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.weekDay.LocalDayOfWeek.Formats.ABBREVIATED);
      expect(messageFormat.messageAST[0].AST[1]).to.be.an.instanceOf(AST.date.weekDay.LocalDayOfWeek);
      expect(messageFormat.messageAST[0].AST[1].format).to.equal(AST.date.weekDay.LocalDayOfWeek.Formats.NUMERIC);
    });

    it('should be able to parse a stand-alone local day of week identifier', function() {
      messageFormat.parse('{variable1, date, c}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.weekDay.StandAloneLocalDayOfWeek);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.weekDay.StandAloneLocalDayOfWeek.Formats.NUMERIC);
    });

    it('should be able to parse two consecutive stand-alone local day of week identifiers', function() {
      messageFormat.parse('{variable1, date, cc}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.weekDay.StandAloneLocalDayOfWeek);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.weekDay.StandAloneLocalDayOfWeek.Formats.NUMERIC_WITH_PADDING);
    });

    it('should be able to parse three consecutive stand-alone local day of week identifiers', function() {
      messageFormat.parse('{variable1, date, ccc}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.weekDay.StandAloneLocalDayOfWeek);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.weekDay.StandAloneLocalDayOfWeek.Formats.SHORT);
    });

    it('should be able to parse four consecutive stand-alone local day of week identifiers', function() {
      messageFormat.parse('{variable1, date, cccc}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.weekDay.StandAloneLocalDayOfWeek);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.weekDay.StandAloneLocalDayOfWeek.Formats.FULL);
    });

    it('should be able to five two consecutive stand-alone local day of week identifiers', function() {
      messageFormat.parse('{variable1, date, ccccc}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.weekDay.StandAloneLocalDayOfWeek);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.weekDay.StandAloneLocalDayOfWeek.Formats.NARROW);
    });

    it('should be able to six two consecutive stand-alone local day of week identifiers', function() {
      messageFormat.parse('{variable1, date, cccccc}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.weekDay.StandAloneLocalDayOfWeek);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.weekDay.StandAloneLocalDayOfWeek.Formats.ABBREVIATED);
    });

    it('should begin with a new stand-alone local day of week if maximum consecutive identifiers have been exceeded', function() {
      messageFormat.parse('{variable1, date, ccccccc}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST.length).to.equal(2);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.weekDay.StandAloneLocalDayOfWeek);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.weekDay.StandAloneLocalDayOfWeek.Formats.ABBREVIATED);
      expect(messageFormat.messageAST[0].AST[1]).to.be.an.instanceOf(AST.date.weekDay.StandAloneLocalDayOfWeek);
      expect(messageFormat.messageAST[0].AST[1].format).to.equal(AST.date.weekDay.StandAloneLocalDayOfWeek.Formats.NUMERIC);
    });
  });

  describe('Period', function() {
    it('should be able to parse a period identifier', function() {
      messageFormat.parse('{variable1, date, a}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.time.Period);
    });

    it('should begin with a new period if maximum consecutive identifiers have been exceeded', function() {
      messageFormat.parse('{variable1, date, aa}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST.length).to.equal(2);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.time.Period);
      expect(messageFormat.messageAST[0].AST[1]).to.be.an.instanceOf(AST.date.time.Period);
    });
  });

  describe('Hour', function() {
    it('should be able to parse a twelve-hours-starting-at-one identifier', function() {
      messageFormat.parse('{variable1, date, h}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.time.Hour);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.time.Hour.Types.TWELVE_HOURS_STARTING_AT_ONE);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.time.Hour.Formats.NUMERIC);
    });

    it('should be able to parse two consecutive twelve-hours-starting-at-one identifiers', function() {
      messageFormat.parse('{variable1, date, hh}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.time.Hour);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.time.Hour.Types.TWELVE_HOURS_STARTING_AT_ONE);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.time.Hour.Formats.NUMERIC_WITH_PADDING);
    });

    it('should begin with a new twelve-hours-starting-at-one if maximum consecutive identifiers have been exceeded', function() {
      messageFormat.parse('{variable1, date, hhh}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST.length).to.equal(2);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.time.Hour);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.time.Hour.Types.TWELVE_HOURS_STARTING_AT_ONE);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.time.Hour.Formats.NUMERIC_WITH_PADDING);
      expect(messageFormat.messageAST[0].AST[1].type).to.equal(AST.date.time.Hour.Types.TWELVE_HOURS_STARTING_AT_ONE);
      expect(messageFormat.messageAST[0].AST[1].format).to.equal(AST.date.time.Hour.Formats.NUMERIC);
    });

    it('should be able to parse a twenty-four-hours-starting-at-zero identifier', function() {
      messageFormat.parse('{variable1, date, H}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.time.Hour);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.time.Hour.Types.TWENTY_FOUR_HOURS_STARTING_AT_ZERO);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.time.Hour.Formats.NUMERIC);
    });

    it('should be able to parse two consecutive twenty-four-hours-starting-at-zero identifiers', function() {
      messageFormat.parse('{variable1, date, HH}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.time.Hour);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.time.Hour.Types.TWENTY_FOUR_HOURS_STARTING_AT_ZERO);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.time.Hour.Formats.NUMERIC_WITH_PADDING);
    });

    it('should begin with a new twenty-four-hours-starting-at-zero if maximum consecutive identifiers have been exceeded', function() {
      messageFormat.parse('{variable1, date, HHH}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST.length).to.equal(2);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.time.Hour);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.time.Hour.Types.TWENTY_FOUR_HOURS_STARTING_AT_ZERO);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.time.Hour.Formats.NUMERIC_WITH_PADDING);
      expect(messageFormat.messageAST[0].AST[1].type).to.equal(AST.date.time.Hour.Types.TWENTY_FOUR_HOURS_STARTING_AT_ZERO);
      expect(messageFormat.messageAST[0].AST[1].format).to.equal(AST.date.time.Hour.Formats.NUMERIC);
    });

    it('should be able to parse a twelve-hours-starting-at-zero identifier', function() {
      messageFormat.parse('{variable1, date, K}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.time.Hour);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.time.Hour.Types.TWELVE_HOURS_STARTING_AT_ZERO);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.time.Hour.Formats.NUMERIC);
    });

    it('should be able to parse two consecutive twelve-hours-starting-at-zero identifiers', function() {
      messageFormat.parse('{variable1, date, KK}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.time.Hour);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.time.Hour.Types.TWELVE_HOURS_STARTING_AT_ZERO);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.time.Hour.Formats.NUMERIC_WITH_PADDING);
    });

    it('should begin with a new twelve-hours-starting-at-zero if maximum consecutive identifiers have been exceeded', function() {
      messageFormat.parse('{variable1, date, KKK}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST.length).to.equal(2);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.time.Hour);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.time.Hour.Types.TWELVE_HOURS_STARTING_AT_ZERO);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.time.Hour.Formats.NUMERIC_WITH_PADDING);
      expect(messageFormat.messageAST[0].AST[1].type).to.equal(AST.date.time.Hour.Types.TWELVE_HOURS_STARTING_AT_ZERO);
      expect(messageFormat.messageAST[0].AST[1].format).to.equal(AST.date.time.Hour.Formats.NUMERIC);
    });

    it('should be able to parse a twenty-four-hours-starting-at-one identifier', function() {
      messageFormat.parse('{variable1, date, k}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.time.Hour);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.time.Hour.Types.TWENTY_FOUR_HOURS_STARTING_AT_ONE);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.time.Hour.Formats.NUMERIC);
    });

    it('should be able to parse two consecutive twenty-four-hours-starting-at-one identifiers', function() {
      messageFormat.parse('{variable1, date, kk}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.time.Hour);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.time.Hour.Types.TWENTY_FOUR_HOURS_STARTING_AT_ONE);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.time.Hour.Formats.NUMERIC_WITH_PADDING);
    });

    it('should begin with a new twenty-four-hours-starting-at-one if maximum consecutive identifiers have been exceeded', function() {
      messageFormat.parse('{variable1, date, kkk}');
      expect(messageFormat.messageAST[0]).to.be.an.instanceOf(AST.date.DateFormat);
      expect(messageFormat.messageAST[0].AST.length).to.equal(2);
      expect(messageFormat.messageAST[0].AST[0]).to.be.an.instanceOf(AST.date.time.Hour);
      expect(messageFormat.messageAST[0].AST[0].type).to.equal(AST.date.time.Hour.Types.TWENTY_FOUR_HOURS_STARTING_AT_ONE);
      expect(messageFormat.messageAST[0].AST[0].format).to.equal(AST.date.time.Hour.Formats.NUMERIC_WITH_PADDING);
      expect(messageFormat.messageAST[0].AST[1].type).to.equal(AST.date.time.Hour.Types.TWENTY_FOUR_HOURS_STARTING_AT_ONE);
      expect(messageFormat.messageAST[0].AST[1].format).to.equal(AST.date.time.Hour.Formats.NUMERIC);
    });
  });
});
