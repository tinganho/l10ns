
var Lexer = require('../Lexer')
  , EOF = -1;

/**
 * Use namespace AST
 */
var AST = {};

/**
 * Use namespace AST.date
 */

AST.date = {};

/**
 * Export AST.date
 */

module.exports = AST.date;

/**
 * AST class representing an ICU DateFormat
 *
 * @param {String} variable
 * @param {String} argument
 * @constructor
 */

AST.date.DateFormat = function(locale, variable, argument, messageFormat) {
  this.locale = locale;
  this.language = /^([a-z]+)\-/.exec(this.locale)[1];
  this.region = /\-([A-Z]+)$/.exec(this.locale)[1];
  this.variable = variable;
  this.argument = argument;
  this.lexer = null;
  this.AST = [];
  this.parse(argument);
};

/**
 * Date format identifiers
 *
 * @enum {Number}
 * @api public
 */

AST.date.DateFormat.Identifiers = {
  ERA: 'G',
  CALENDAR_YEAR: 'y',
  WEEK_BASED_YEAR: 'Y',
  EXTENDED_YEAR: 'u',
  CYCLIC_YEAR: 'U',
  FORMATED_QUARTER: 'Q',
  STAND_ALONE_QUARTER: 'q',
  FORMATED_MONTH: 'M',
  STAND_ALONE_MONTH: 'L',
  WEEK_OF_YEAR: 'w',
  WEEK_OF_MONTH: 'W',
  DAY_OF_MONTH: 'd',
  DAY_OF_YEAR: 'D',
  DAY_OF_WEEK_IN_MONTH: 'F',
  MODIFIED_JULIAN_DAY: 'g',
  DAY_OF_WEEK: 'E',
  LOCAL_DAY_OF_WEEK: 'e',
  STAND_ALONE_LOCAL_DAY_OF_WEEK: 'c',
  PERIOD: 'a',
  TWELVE_HOURS_STARTING_AT_ONE: 'h',
  TWENTY_FOUR_HOURS_STARTING_AT_ZERO: 'H',
  TWELVE_HOURS_STARTING_AT_ZERO: 'K',
  TWENTY_FOUR_HOURS_STARTING_AT_ONE: 'k',
  MINUTE: 'm',
  SECOND: 's',
  FRACTIONAL_SECOND: 'S',
  MILLI_SECONDS_IN_DAY: 'A'
};

/**
 * Parse date format
 *
 * @param {String} string
 * @return {Array} AST of the date
 * @api public
 */

AST.date.DateFormat.prototype.parse = function(string) {
  this.lexer = new Lexer(string);
  this.currentToken = this.lexer.getNextToken();
  while(this.currentToken !== EOF) {
    switch(this.currentToken) {
      case AST.date.DateFormat.Identifiers.ERA:
        this.AST.push(this._parseEra());
        break;
      case AST.date.DateFormat.Identifiers.CALENDAR_YEAR:
      case AST.date.DateFormat.Identifiers.WEEK_BASED_YEAR:
      case AST.date.DateFormat.Identifiers.EXTENDED_YEAR:
        this.AST.push(this._parseYear());
        break;
      case AST.date.DateFormat.Identifiers.CYCLIC_YEAR:
        this.AST.push(this._parseCyclicYear());
        break;
      case AST.date.DateFormat.Identifiers.FORMATED_QUARTER:
      case AST.date.DateFormat.Identifiers.STAND_ALONE_QUARTER:
        this.AST.push(this._parseQuarter());
        break;
      case AST.date.DateFormat.Identifiers.FORMATED_MONTH:
      case AST.date.DateFormat.Identifiers.STAND_ALONE_MONTH:
        this.AST.push(this._parseMonth());
        break;
      case AST.date.DateFormat.Identifiers.WEEK_OF_YEAR:
      case AST.date.DateFormat.Identifiers.WEEK_OF_MONTH:
        this.AST.push(this._parseWeek());
        break;
      case AST.date.DateFormat.Identifiers.DAY_OF_MONTH:
      case AST.date.DateFormat.Identifiers.DAY_OF_YEAR:
      case AST.date.DateFormat.Identifiers.DAY_OF_WEEK_IN_MONTH:
      case AST.date.DateFormat.Identifiers.MODIFIED_JULIAN_DAY:
        this.AST.push(this._parseDay());
        break;
      case AST.date.DateFormat.Identifiers.DAY_OF_WEEK:
      case AST.date.DateFormat.Identifiers.LOCAL_DAY_OF_WEEK:
      case AST.date.DateFormat.Identifiers.STAND_ALONE_LOCAL_DAY_OF_WEEK:
        this.AST.push(this._parseWeekDay());
        break;
      case AST.date.DateFormat.Identifiers.PERIOD:
        this._getConsecutiveLength(1);
        this.AST.push(new AST.date.time.Period());
        break;
      case AST.date.DateFormat.Identifiers.TWELVE_HOURS_STARTING_AT_ONE:
      case AST.date.DateFormat.Identifiers.TWENTY_FOUR_HOURS_STARTING_AT_ZERO:
      case AST.date.DateFormat.Identifiers.TWELVE_HOURS_STARTING_AT_ZERO:
      case AST.date.DateFormat.Identifiers.TWENTY_FOUR_HOURS_STARTING_AT_ONE:
        this.AST.push(this._parseHour());
        break;
      case AST.date.DateFormat.Identifiers.MINUTE:
        this.AST.push(this._parseMinute());
        break;
    }
  }
};

/**
 * Parse era G, GG and GGG for AD, Anno Domini and A.
 *
 * @return {AST.date.Era}
 * @api private
 */

AST.date.DateFormat.prototype._parseEra = function() {
  var length = this._getConsecutiveLength(5);
  if(length <= 3) {
    return new AST.date.Era(AST.date.Era.Types.ABBREVIATED);
  }
  else if(length === 4) {
    return new AST.date.Era(AST.date.Era.Types.FULL);
  }
  else {
    return new AST.date.Era(AST.date.Era.Types.NARROW);
  }
};

/**
 * Parse year identifiers (y). Length specifies zero padding. Two identifiers
 * is used for specifying max length of 2.
 *
 * @return {AST.date.Year}
 * @api private
 */

AST.date.DateFormat.prototype._parseYear = function() {
  var type;
  switch(this.currentToken) {
    case AST.date.DateFormat.Identifiers.CALENDAR_YEAR:
      type = AST.date.Year.Types.CALENDAR;
      break;
    case AST.date.DateFormat.Identifiers.WEEK_BASED_YEAR:
      type = AST.date.Year.Types.WEEK_BASED;
      break;
    case AST.date.DateFormat.Identifiers.EXTENDED_YEAR:
      type = AST.date.Year.Types.EXTENDED;
      break;
  }

  var length = this._getConsecutiveLength();

  return new AST.date.Year(type, length);
};

/**
 * Parse cyclic years identifiers (U).
 *
 * @return {AST.date.CyclicYear}
 * @api private
 */

AST.date.DateFormat.prototype._parseCyclicYear = function() {
  // swallow 'U'
  this._getConsecutiveLength(5);

  return new AST.date.CyclicYear(AST.date.CyclicYear.Types.ABBREVIATED);
};

/**
 * Parse quarter identifiers (Q, q)
 *
 * @return {AST.date.Quarter}
 * @api private
 */

AST.date.DateFormat.prototype._parseQuarter = function() {
  var context;
  switch(this.currentToken) {
    case AST.date.DateFormat.Identifiers.FORMATED_QUARTER:
      context = AST.date.Quarter.Context.FORMATED;
      break;
    case AST.date.DateFormat.Identifiers.STAND_ALONE_QUARTER:
      context = AST.date.Quarter.Context.STAND_ALONE;
      break;
  }

  var length = this._getConsecutiveLength(4);

  var format;
  switch(length) {
    case 1:
      format = AST.date.Quarter.Formats.NUMERIC;
      break;
    case 2:
      format = AST.date.Quarter.Formats.NUMERIC_WITH_PADDING;
      break;
    case 3:
      format = AST.date.Quarter.Formats.ABBREVIATED;
      break;
    case 4:
      format = AST.date.Quarter.Formats.FULL;
      break;
  }

  return new AST.date.Quarter(context, format);
};

/**
 * Parse month identifiers (M, L)
 *
 * @return {AST.date.Month}
 * @api private
 */

AST.date.DateFormat.prototype._parseMonth = function() {
  var context;
  switch(this.currentToken) {
    case AST.date.DateFormat.Identifiers.FORMATED_MONTH:
      context = AST.date.Month.Context.FORMATED;
      break;
    case AST.date.DateFormat.Identifiers.STAND_ALONE_MONTH:
      context = AST.date.Month.Context.STAND_ALONE;
      break;
  }

  var length = this._getConsecutiveLength(5);

  var format;
  switch(length) {
    case 1:
      format = AST.date.Month.Formats.NUMERIC;
      break;
    case 2:
      format = AST.date.Month.Formats.NUMERIC_WITH_PADDING;
      break;
    case 3:
      format = AST.date.Month.Formats.SHORT;
      break;
    case 4:
      format = AST.date.Month.Formats.WIDE;
      break;
    case 5:
      format = AST.date.Month.Formats.NARROW;
      break;
  }

  return new AST.date.Month(context, format);
};

/**
 * Parse week identifiers (w, W)
 *
 * @return {AST.date.Month}
 * @api private
 */

AST.date.DateFormat.prototype._parseWeek = function() {
  var type, length, format;
  switch(this.currentToken) {
    case AST.date.DateFormat.Identifiers.WEEK_OF_YEAR:
      type = AST.date.Week.Types.WEEK_OF_YEAR;
      length = this._getConsecutiveLength(2);
      if(length === 1) {
        format = AST.date.Week.Formats.NUMERIC;
      }
      else {
        format = AST.date.Week.Formats.NUMERIC_WITH_PADDING;
      }
      break;
    case AST.date.DateFormat.Identifiers.WEEK_OF_MONTH:
      type = AST.date.Week.Types.WEEK_OF_MONTH;
      this._getConsecutiveLength(1);
      format = AST.date.Week.Formats.NUMERIC;
      break;
  }

  return new AST.date.Week(type, format);
};

/**
 * Parse week identifiers (d, D, F, g)
 *
 * @return {AST.date.day.DayOfMonth|AST.date.day.DayOfYear
 * |AST.date.day.DayOfWeekInMonth|AST.date.day.ModifiedJulianDay}
 * @api private
 */

AST.date.DateFormat.prototype._parseDay = function() {
  var type, length, format;
  switch(this.currentToken) {
    case AST.date.DateFormat.Identifiers.DAY_OF_MONTH:
      length = this._getConsecutiveLength(2);
      if(length === 1) {
        format = AST.date.day.DayOfMonth.Formats.NUMERIC;
      }
      else {
        format = AST.date.day.DayOfMonth.Formats.NUMERIC_WITH_PADDING;
      }
      return new AST.date.day.DayOfMonth(format);
    case AST.date.DateFormat.Identifiers.DAY_OF_YEAR:
      length = this._getConsecutiveLength(3);
      switch(length) {
        case 1:
          format = AST.date.day.DayOfYear.Formats.WITHOUT_PADDING;
          break;
        case 2:
          format = AST.date.day.DayOfYear.Formats.WITH_ONE_ZERO_PADDING;
          break;
        case 3:
          format = AST.date.day.DayOfYear.Formats.WITH_TWO_ZERO_PADDING;
          break;
      }
      return new AST.date.day.DayOfYear(format);
    case AST.date.DateFormat.Identifiers.DAY_OF_WEEK_IN_MONTH:
      this._getConsecutiveLength(1);
      return new AST.date.day.DayOfWeekInMonth;
    default:
      length = this._getConsecutiveLength();
      return new AST.date.day.ModifiedJulianDay(length);
  }
};

/**
 * Parse week day identifiers (E, e, c)
 *
 * @return {AST.date.weekDay.DayOfWeek|AST.date.weekDay.LocalDayOfWeek
 * |AST.date.weekDay.StandAloneLocalDayOfWeek}
 * @api private
 */

AST.date.DateFormat.prototype._parseWeekDay = function() {
  var type, length, format;
  switch(this.currentToken) {
    case AST.date.DateFormat.Identifiers.DAY_OF_WEEK:
      length = this._getConsecutiveLength(6);
      if(length <= 3) {
        format = AST.date.weekDay.DayOfWeek.Formats.SHORT;
      }
      else {
        switch(length) {
          case 4:
            format = AST.date.weekDay.DayOfWeek.Formats.FULL;
            break;
          case 5:
            format = AST.date.weekDay.DayOfWeek.Formats.NARROW;
            break;
          case 6:
            format = AST.date.weekDay.DayOfWeek.Formats.ABBREVIATED;
            break;
        }
      }
      return new AST.date.weekDay.DayOfWeek(format);
    case AST.date.DateFormat.Identifiers.LOCAL_DAY_OF_WEEK:
      length = this._getConsecutiveLength(6);
      switch(length) {
        case 1:
          format = AST.date.weekDay.LocalDayOfWeek.Formats.NUMERIC;
          break;
        case 2:
          format = AST.date.weekDay.LocalDayOfWeek.Formats.NUMERIC_WITH_PADDING;
          break;
        case 3:
          format = AST.date.weekDay.LocalDayOfWeek.Formats.SHORT;
          break;
        case 4:
          format = AST.date.weekDay.LocalDayOfWeek.Formats.FULL;
          break;
        case 5:
          format = AST.date.weekDay.LocalDayOfWeek.Formats.NARROW;
          break;
        case 6:
          format = AST.date.weekDay.LocalDayOfWeek.Formats.ABBREVIATED;
          break;
      }
      return new AST.date.weekDay.LocalDayOfWeek(format);
    default:
      length = this._getConsecutiveLength(6);
      switch(length) {
        case 1:
          format = AST.date.weekDay.StandAloneLocalDayOfWeek.Formats.NUMERIC;
          break;
        case 2:
          format = AST.date.weekDay.StandAloneLocalDayOfWeek.Formats.NUMERIC_WITH_PADDING;
          break;
        case 3:
          format = AST.date.weekDay.StandAloneLocalDayOfWeek.Formats.SHORT;
          break;
        case 4:
          format = AST.date.weekDay.StandAloneLocalDayOfWeek.Formats.FULL;
          break;
        case 5:
          format = AST.date.weekDay.StandAloneLocalDayOfWeek.Formats.NARROW;
          break;
        case 6:
          format = AST.date.weekDay.StandAloneLocalDayOfWeek.Formats.ABBREVIATED;
          break;
      }
      return new AST.date.weekDay.StandAloneLocalDayOfWeek(format);
  }
};

/**
 * Parse hour identifiers (h, H, K, k)
 *
 * @return {AST.date.Hour}
 * @api private
 */

AST.date.DateFormat.prototype._parseHour = function() {
  var type;
  var length;
  var format;

  switch(this.currentToken) {
    case AST.date.DateFormat.Identifiers.TWELVE_HOURS_STARTING_AT_ONE:
      type = AST.date.time.Hour.Types.TWELVE_HOURS_STARTING_AT_ONE;
      break;
    case AST.date.DateFormat.Identifiers.TWENTY_FOUR_HOURS_STARTING_AT_ZERO:
      type = AST.date.time.Hour.Types.TWENTY_FOUR_HOURS_STARTING_AT_ZERO;
      break;
    case AST.date.DateFormat.Identifiers.TWELVE_HOURS_STARTING_AT_ZERO:
      type = AST.date.time.Hour.Types.TWELVE_HOURS_STARTING_AT_ZERO;
      break;
    case AST.date.DateFormat.Identifiers.TWENTY_FOUR_HOURS_STARTING_AT_ONE:
      type = AST.date.time.Hour.Types.TWENTY_FOUR_HOURS_STARTING_AT_ONE;
      break;
  }

  length = this._getConsecutiveLength(2);
  if(length === 1) {
    format = AST.date.time.Hour.Formats.NUMERIC;
  }
  else {
    format = AST.date.time.Hour.Formats.NUMERIC_WITH_PADDING;
  }

  return new AST.date.time.Hour(type, format);
};

/**
 * Parse minute identifier (m)
 *
 * @return {AST.date.Minute}
 * @api private
 */

AST.date.DateFormat.prototype._parseMinute = function() {
  var length = this._getConsecutiveLength(2);
  var format;

  if(length === 1) {
    format = AST.date.time.Minute.Formats.NUMERIC;
  }
  else {
    format = AST.date.time.Minute.Formats.NUMERIC_WITH_PADDING;
  }

  return new AST.date.time.Minute(format);
};

/**
 * Return consecutive length of a character
 *
 * @return {Number}
 * @api private
 */

AST.date.DateFormat.prototype._getConsecutiveLength = function(max) {
  var token = this.currentToken;
  var length = 0;

  while(token === this.currentToken) {
    length++;
    this.currentToken = this.lexer.getNextToken();
    if(max && length === max) {
      break;
    }
  }

  return length;
};

/**
 * Era AST.
 *
 * @param {Era.Type}.Type
 * @constructor
 */

AST.date.Era = function(format) {
  this.format = format;
};

/**
 * Era.Types. An Era.Type is specified by the `G` letter. 1-3 letters
 * means a abbreviated era.Type. e.g. G means AD. GGGG mean Anno Domini.
 * GGGGG means narrow era.Type or just using the letter A for Anno Domini.
 *
 * @enum {AST.Data.Era.Type}
 */

AST.date.Era.Types = {
 ABBREVIATED: 1,
 FULL: 2,
 NARROW: 3
};

/**
 * Year AST
 *
 * @param {AST.date.Year.Types} type
 * @param {Number} length
 * @constructor
 */

AST.date.Year = function(type, length) {
  this.type = type;
  this.length = length;
};

/**
 * Year.Types. There exists four different year.Types. CALENDAR_YEAR,
 * WEEK_BASED_YEAR, EXTENDED_YEAR and CYCLIC_YEAR.
 *
 * @enum {Number}
 */

AST.date.Year.Types = {
  CALENDAR: 1,
  WEEK_BASED: 2,
  EXTENDED: 3,
  CYCLIC: 4
};


/**
 * Year AST
 *
 * @param {AST.date.CyclicYear.Types} type
 * @constructor
 */

AST.date.CyclicYear = function(format) {
  this.format = format;
};


/**
 * Cyclic year types, Currently on abbreviated.
 *
 * @enum {Number}
 */

AST.date.CyclicYear.Types = {
  ABBREVIATED: 1
};

/**
 * Quarter AST.
 *
 * @param {AST.date.Quarter.Context} context
 * @param {AST.date.Quarter.Formats} format
 * @param {Number} length
 * @constructor
 */

AST.date.Quarter = function(context, format) {
  this.context = context;
  this.format = format;
};

/**
 * Quarter context. Formated context is used along with other values. Stand alones
 * means that they stand alone and not being formated with other values.
 *
 * @enum {Number}
 */

AST.date.Quarter.Context = {
  FORMATED: 1,
  STAND_ALONE: 2
};

/**
 * Quarter context. Formated context is used along with other values. Stand alones
 * means that they stand alone and not being formated with other values.
 *
 * @enum {Number}
 */

AST.date.Quarter.Formats = {
  NUMERIC: 1,
  NUMERIC_WITH_PADDING: 2,
  ABBREVIATED: 3,
  FULL: 4
};

/**
 * Month AST.
 *
 * @param {AST.date.Month.Context} context
 * @param {AST.date.Month.Formats} format
 * @constructor
 */

AST.date.Month = function(context, format) {
  this.context = context;
  this.format = format;
};

/**
 * Month context. Formated context is used along with other values. Stand alones
 * means that they stand alone and not being formated with other values.
 *
 * @enum {Number}
 */

AST.date.Month.Context = {
  FORMATED: 1,
  STAND_ALONE: 2
};

/**
 * Quarter types
 *
 * Examples:
 *
 *   NUMERIC = 9
 *   NUMERIC_WITH_PADDING = 09
 *   SHORT = Sept
 *   WIDE = September
 *   NARROW = S
 *
 * @enum {Number}
 */

AST.date.Month.Formats = {
  NUMERIC: 1,
  NUMERIC_WITH_PADDING: 2,
  SHORT: 3,
  WIDE: 4,
  NARROW: 5
};

/**
 * Week of year AST.
 *
 * @param {AST.date.Week.Types} type
 * @pram {AST.date.Week.Formats} format
 * @constructor
 */

AST.date.Week = function(type, format) {
  this.type = type;
  this.format = format;
};

/**
 * Week types.
 *
 * @enum {Number}
 * @api public
 */

AST.date.Week.Types = {
  WEEK_OF_YEAR: 1,
  WEEK_OF_MONTH: 2
};

/**
 * Week formats
 *
 * @enum {Number}
 * @api public
 */

AST.date.Week.Formats = {
  NUMERIC: 1,
  NUMERIC_WITH_PADDING: 2
};

/**
 * Namespace Day
 */

AST.date.day = {};

/**
 * Day of month AST.
 *
 * @param {AST.date.day.DayOfMonth.Formats} format
 * @constructor
 */

AST.date.day.DayOfMonth = function(format) {
  this.format = format;
};

/**
 * Week of year.Types.
 *
 * @enum {Number}
 * @api public
 */

AST.date.day.DayOfMonth.Formats = {
  NUMERIC: 1,
  NUMERIC_WITH_PADDING: 2
};

/**
 * Day of year AST.
 *
 * @param {AST.date.day.DayOfYear.Formats} format
 * @constructor
 */

AST.date.day.DayOfYear = function(format) {
  this.format = format;
};

/**
 * Week of year types.
 *
 * @enum {Number}
 * @api public
 */

AST.date.day.DayOfYear.Formats = {
  WITHOUT_PADDING: 1,
  WITH_ONE_ZERO_PADDING: 2,
  WITH_TWO_ZERO_PADDING: 3
};

/**
 * Day of week in month AST.
 *
 * @constructor
 */

AST.date.day.DayOfWeekInMonth = function() {};

/**
 * Day of week in month AST.
 *
 * @param {Number(1..n)} length
 * @constructor
 */

AST.date.day.ModifiedJulianDay = function(length) {
  this.length = length;
};

/**
 * Namespace week day.
 */

AST.date.weekDay = {};

/**
 * Day of week.
 *
 * @param {AST.date.weekDay.RegularWeekDay.Formats} format
 * @constructor
 */

AST.date.weekDay.DayOfWeek = function(format) {
  this.format = format;
};

/**
 * Day of week formats.
 *
 *   Example:
 *
 *     Type                 Output
 *
 *     SHORT                Tue
 *     FULL                 Tuesday
 *     NARROW               T
 *     ABBREVIATED          Tu
 *
 * @enum {Number}
 * @api public
 */

AST.date.weekDay.DayOfWeek.Formats = {
  SHORT: 1,
  FULL: 2,
  NARROW: 3,
  ABBREVIATED: 4
};

/**
 * Local day of week.
 *
 *   Example:
 *
 *     n      string
 *     1..2   2
 *     3      Tues
 *     4      Tuesday
 *     5      T
 *     6      Tu
 *
 * @param {AST.date.weekDay.LocalDayOfWeek.Formats} format
 * @constructor
 */

AST.date.weekDay.LocalDayOfWeek = function(format) {
  this.format = format;
};

/**
 * Local day of week formats.
 *
 *   Example:
 *
 *     Type                 Output
 *
 *     NUMERIC              2
 *     NUMERIC_WITH_PADDING 02
 *     SHORT                Tue
 *     FULL                 Tuesday
 *     NARROW               T
 *     ABBREVIATED          Tu
 *
 * @enum {Number}
 * @api public
 */

AST.date.weekDay.LocalDayOfWeek.Formats = {
  NUMERIC: 1,
  NUMERIC_WITH_PADDING: 2,
  SHORT : 3,
  FULL: 4,
  NARROW: 5,
  ABBREVIATED: 6,
};


/**
 * Stand-alone local day of week.
 *
 * @param {AST.date.weekDay.LocalStandAloneWeekDay.Type} format
 * @constructor
 */

AST.date.weekDay.StandAloneLocalDayOfWeek = function(format) {
  this.format = format;
};

/**
 * Stand-alone local day of week formats.
 *
 *   Example:
 *
 *     Type                 Output
 *
 *     NUMERIC              2
 *     NUMERIC_WITH_PADDING 02
 *     SHORT                Tue
 *     FULL                 Tuesday
 *     NARROW               T
 *     ABBREVIATED          Tu
 *
 * @enum {Number}
 * @api public
 */

AST.date.weekDay.StandAloneLocalDayOfWeek.Formats = {
  NUMERIC: 1,
  NUMERIC_WITH_PADDING: 2,
  SHORT : 3,
  FULL: 4,
  NARROW: 5,
  ABBREVIATED: 6,
};


/**
 * Namespace time
 */

AST.date.time = {};

/**
 * Period of day AST.
 *
 * @constructor
 */

AST.date.time.Period = function() {};

/**
 * Hour.
 *
 * @param {AST.date.time.Hour.Types} type
 * @param {AST.date.time.Hour.Formats} format
 * @constructor
 * @api public
 */

AST.date.time.Hour = function(type, format) {
  this.type = type;
  this.format = format;
};

/**
 * Hour types.
 *
 * @enum {Numbers}
 * @api public
 */

AST.date.time.Hour.Types = {
  TWELVE_HOURS_STARTING_AT_ONE: 1,
  TWENTY_FOUR_HOURS_STARTING_AT_ZERO: 2,
  TWELVE_HOURS_STARTING_AT_ZERO: 3,
  TWENTY_FOUR_HOURS_STARTING_AT_ONE: 4
};

/**
 * Hour formats.
 *
 * @enum {Numbers}
 * @api public
 */

AST.date.time.Hour.Formats = {
  NUMERIC: 1,
  NUMERIC_WITH_PADDING: 2
};

/**
 * Minute AST.
 *
 * @param {AST.date.time.Minute.Formats} format
 * @contructor
 */

AST.date.time.Minute = function(format) {
  this.format = format;
};

/**
 * Minute formats.
 *
 * @enum {Number}
 * @api public
 */

AST.date.time.Minute.Formats = {
  NUMERIC: 1,
  NUMERIC_WITH_PADDING: 2
};

/**
 * Namespace second
 */

AST.date.second = {};

/**
 * Regular second AST.
 *
 * @param {Number(1,2)} length. Length of two gives zero padding.
 * @contructor
 */

AST.date.second.RegularSecond = function(type) {
  this.type = type;
};

/**
 * Regular second.Types. Sepcify which kind of format in second output
 * you want. Either with or without trailing zeros.
 *
 * @enum {Number}
 * @api public
 */

AST.date.second.RegularSecond.Type = {
  WITHOUT_ZERO_PADDING: 1,
  WITH_ZERO_PADDING: 2
};

/**
 * Fractional second AST.
 *
 * @param {Number(1..n)} length.
 * @contructor
 */

AST.date.second.FractionalSecond = function(length) {
  this.length = length;
};

/**
 * Milliseconds in day AST.
 *
 * @param {Number(1..n)} length.
 * @contructor
 */

AST.date.second.MilliSecondInDay = function(length) {
  this.length = length;
};

/**
 * Namespace time zone
 */

AST.date.timeZone = {};

/**
 * Time zone in specific non location format AST.
 *
 * @param {AST.date.timeZone.SpecificNonLocationFormat.Type}.Type
 * @contructor
 */

AST.date.timeZone.SpecificNonLocationFormat = function(type) {
  this.type = type;
};

/**
 * Specific non-location format.Types.
 *
 *   Example:
 *
 *     Type    Output
 *
 *     SHORT   PDT
 *     LONG    Pacific Daylight Time
 *
 * @enum {Number}
 * @api public
 */

AST.date.timeZone.SpecificNonLocationFormat.Type = {
  SHORT: 1,
  LONG: 2
};

/**
 * Time zone in ISO8601 format AST.
 *
 * @param {AST.date.timeZone.ISO8601.Type}.Type
 * @contructor
 */

AST.date.timeZone.ISO8601 = function(type) {
  this.type = type;
};

/**
 * Time zone in ISO8601 format.Types.
 *
 *   Example:
 *
 *     Type                 Output
 *
 *     BASIC                -0800
 *     LONG_LOCALIZED_GMT   GMT-8:00
 *     EXTENDED             -08:00
 *                          -07:52:58
 *
 * @enum {Number}
 * @api public
 */

AST.date.timeZone.ISO8601.Type = {
  BASIC: 1,
  LONG_LOCALIZED_GMT: 2,
  EXTENDED: 3
};

/**
 * time zone in localizaed GMT format.
 *
 * @param {AST.date.timeZone.LocalizedGMTFormat.Type}.Type.
 * @contructor
 */

AST.date.timeZone.LocalizedGMTFormat = function(type) {
  this.type = type;
};

/**
 * Localized GMT format.Types
 *
 *   Example:
 *
 *     Type       Output
 *
 *     SHORT      GMT-8
 *     LONG       GMT-08:00
 *
 * @enum {Number}
 * @api public
 */

AST.date.timeZone.LocalizedGMTFormat.Type = {
  SHORT: 1,
  LONG: 2
};

/**
 * time zone in generic non location format
 *
 * @param {AST.date.timeZone.GenericNonLocationFormat.Type}.Type
 * @contructor
 */

AST.date.timeZone.GenericNonLocationFormat = function(type) {
  this.type = type;
};

/**
 * Generice non location format.Types
 *
 *   Example:
 *
 *     Type          Output
 *
 *     ABBREVIATED   PT
 *     FULL          Pacific time
 *
 * @enum {Number}
 * @api public
 */

AST.date.timeZone.GenericNonLocationFormat.Type = {
  ABBREVIATED: 1,
  FULL: 2
};

/**
 * time zone in generic non location format.
 *
 *   Example:
 *
 *     length   string
 *     1        uslax
 *     2        America/Los_Angeles
 *     3        Los Angeles
 *     4        Los Angeles Time
 *
 * @param {Number(1..4)} length.
 * @contructor
 */

AST.date.timeZone.GenericLocationFormat = function(type) {
  this.type = type;
};

/**
 * Generice non location format.Types
 *
 *   Example:
 *
 *     Type                 Output
 *
 *     SHORT_TIME_ZONE_ID   uslax
 *     LONG_TIME_ZONE_ID    America/Los_Angeles
 *     CITY                 Los Angeles
 *     GENERIC_LOCATION     Los Angeles Time
 *
 * @enum {Number}
 * @api public
 */

AST.date.timeZone.GenericLocationFormat.Type = {
  SHORT_TIME_ZONE_ID: 1,
  LONG_TIME_ZONE_ID: 2,
  CITY: 3,
  GENERIC_LOCATION: 4
};

/**
 * ISO8601 time zone format with `Z` representing zero time zone offset.
 *
 * @param {AST.date.timeZone.ISO8601WithZ.Type} type
 * @constructor
 */

AST.date.timeZone.ISO8601WithZ = function(type) {
  this.type = type;
};

/**
 * ISO8601 time zone format with `Z` types.
 *
 *   Example:
 *
 *     Type                                                     Output
 *
 *     BASIC_FORMAT_WITH_OPTIONAL_MINUTES                       -08
 *                                                              +0530
 *                                                              Z
 *     BASIC_FORMAT_WITH_MINUTES                                -0800
 *                                                              Z
 *     EXTENDED_FORMAT_WITH_HOURS_AND_MINUTES                   -08:00
 *                                                              Z
 *     BASIC_FORMAT_WITH_HOURS_MINUTES_AND_OPTIONAL_SECONDS     -0800
 *                                                              -075258
 *                                                              Z
 *     EXTENDED_FORMAT_WITH_HOURS_MINUTES_AND_OPTIONAL_SECONDS  -08:00
 *                                                              -07:52:58
 *                                                              Z
 *
 * @enum {Number}
 * @api public
 */

AST.date.timeZone.ISO8601WithZ.Type = {
  BASIC_FORMAT_WITH_OPTIONAL_MINUTES: 1,
  BASIC_FORMAT_WITH_MINUTES: 2,
  EXTENDED_FORMAT_WITH_HOURS_AND_MINUTES: 3,
  BASIC_FORMAT_WITH_HOURS_MINUTES_AND_OPTIONAL_SECONDS: 4,
  EXTENDED_FORMAT_WITH_HOURS_MINUTES_AND_OPTIONAL_SECONDS: 5
};

/**
 * ISO8601 time zone format without `Z` representing zero time zone offset.
 *
 * @param {AST.date.timeZone.ISO8601WithZ.Type} type
 * @constructor
 */

AST.date.timeZone.ISO8601WithoutZ = function(type) {
  this.type = type;
};

/**
 * ISO8601 time zone format without `Z` types.
 *
 *   Example:
 *
 *     Type                                                     Output
 *
 *     BASIC_FORMAT_WITH_OPTIONAL_MINUTES                       -08
 *                                                              +0530
 *     BASIC_FORMAT_WITH_MINUTES                                -0800
 *     EXTENDED_FORMAT_WITH_HOURS_AND_MINUTES                   -08:00
 *     BASIC_FORMAT_WITH_HOURS_MINUTES_AND_OPTIONAL_SECONDS     -0800
 *                                                              -075258
 *     EXTENDED_FORMAT_WITH_HOURS_MINUTES_AND_OPTIONAL_SECONDS  -08:00
 *                                                              -07:52:58
 *
 * @enum {Number}
 * @api public
 */

AST.date.timeZone.ISO8601WithZ.Type = {
  BASIC_FORMAT_WITH_OPTIONAL_MINUTES: 1,
  BASIC_FORMAT_WITH_MINUTES: 2,
  EXTENDED_FORMAT_WITH_HOURS_AND_MINUTES: 3,
  BASIC_FORMAT_WITH_HOURS_MINUTES_AND_OPTIONAL_SECONDS: 4,
  EXTENDED_FORMAT_WITH_HOURS_MINUTES_AND_OPTIONAL_SECONDS: 5
};
