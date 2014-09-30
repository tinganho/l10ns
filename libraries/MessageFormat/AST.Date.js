
/**
 * Use namespace AST
 */
var AST = {};

/**
 * Use namespace AST.Date
 */

AST.Date = {};


/**
 * Era AST.
 *
 * @param {Era.Type} type
 * @constructor
 */

AST.Date.Era = function(type) {
  this.type;
};

/**
 * Era types. An Era type is specified by the `G` letter. 1-3 letters
 * means a abbreviated era type. e.g. G means AD. GGGG mean Anno Domini.
 * GGGGG means narrow era type or just using the letter A for Anno Domini.
 *
 * @enum {AST.Data.Era.Type}
 */

AST.Data.Era.Type = {
 ABBREVIATED: 0,
 FULL: 1,
 NARROW: 2
};

/**
 * Year AST
 *
 * @param {AST.Date.Year.Type} type
 * @param {Number} length
 * @constructor
 */

AST.Date.Year = function(type, length) {
  this.type = type;
  this.length = length;
};

/**
 * Year types. There exists four different year types. CALENDAR_YEAR,
 * WEEK_BASED_YEAR, EXTENDED_YEAR and CYCLIC_YEAR.
 *
 * @enum {Number}
 */

AST.Date.Year.Type = {
  CALENDAR: 0,
  WEEK_BASED: 1,
  EXTENDED: 2,
  CYCLIC: 3
};

/**
 * Quarter AST.
 *
 * @param {AST.Date.Quarter.Context} context
 * @param {AST.Date.Quarter.Type} type
 * @param {Number} length
 * @constructor
 */

AST.Date.Quarter = function(context, type, length) {
  this.type = type;
  this.length = length;
};

/**
 * Quarter context. Formated context is used along with other values. Stand alones
 * means that they stand alone and not being formated with other values.
 *
 * @enum {Number}
 */

AST.Date.Quarter.Context = {
  FORMATED: 1,
  STAND_ALONE: 2,
};

/**
 * Quarter types.
 *
 * Examples:
 *
 *   ONE_DIGIT = 1
 *   TWO_DIGIT = 01
 *   ABBREVIATED = Q2
 *   WIDE = 2nd quarter
 *
 * @enum {Number}
 */

AST.Date.Quarter.Type = {
  ONE_DIGIT: 1,
  TWO_DIGIT: 2,
  ABBREVIATED: 3,
  WIDE: 4
};


/**
 * Month AST.
 *
 * @param {AST.Date.Month.Context} context
 * @param {AST.Date.Month.Type} type
 * @param {Number} length
 * @constructor
 */

AST.Date.Month = function(context, type, length) {
  this.type = type;
  this.length = length;
};

/**
 * Month context. Formated context is used along with other values. Stand alones
 * means that they stand alone and not being formated with other values.
 *
 * @enum {Number}
 */

AST.Date.Month.Context = {
  FORMATED: 1,
  STAND_ALONE: 2,
};

/**
 * Quarter types.
 *
 * Examples:
 *
 *   ONE_DIGIT = 9
 *   TWO_DIGIT = 09
 *   SHORT = Sept
 *   WIDE = September
 *   NARROW = S
 *
 * @enum {Number}
 */

AST.Date.Month.Type = {
  ONE_DIGIT: 1,
  TWO_DIGIT: 2,
  SHORT: 3,
  WIDE: 4,
  NARROW: 5
};

/**
 * Week of year AST.
 *
 * @param {Number} length (1|2)
 * @constructor
 */

AST.Date.WeekOfYear = function(length) {
  this.length = length;
};

/**
 * Week of month AST.
 *
 * @constructor
 */

AST.Date.WeekOfMonth = function() {};

/**
 * Namespace Day
 */

AST.Date.Day = {};

/**
 * Day of month AST.
 *
 * @param {Number(1..2)}  length
 * @constructor
 */

AST.Date.Day.DayOfMonth = function(length) {
  this.length = length;
};

/**
 * Day of year AST.
 *
 * @param {Number(1..3)} length
 * @constructor
 */

AST.Date.Day.DayOfYear = function(length) {
  this.length = length;
};

/**
 * Day of week in month AST.
 *
 * @constructor
 */

AST.Date.Day.DayOfWeekInMonth = function() {};

/**
 * Day of week in month AST.
 *
 * @param {Number(1..n)} length
 * @constructor
 */

AST.Date.Day.ModifiedJulianDay = function(length) {
  this.length = length;
};

/**
 * Regular WeekDay. A regular weekday.
 *
 *   Example:
 *
 *     n      string
 *     1..3   Tues
 *     4      Tuesday
 *     5      T
 *     6      Tu
 *
 * @param {Number(1..6)} length
 * @constructor
 */

AST.Date.WeekDay.RegularWeekDay = function(length) {
  this.length = length;
};

/**
 * Regular WeekDay with no numeric value for starting order of the week day.
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
 * @param {Number(1..6)} length
 * @constructor
 */

AST.Date.WeekDay.RegularWeekDay = function(length) {
  this.length = length;
};

/**
 * Regular WeekDay with numeric value for starting order of the week day.
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
 * @param {Number(1..6)} length
 * @constructor
 */

AST.Date.WeekDay.LocalWeekDay = function(length) {
  this.length = length;
};

/**
 * Stand-alone regular WeekDay with numeric value for starting order of
 * the week day.
 *
 * @param {Number(1..6)} length
 * @constructor
 */

AST.Date.WeekDay.LocalStandAloneWeekDay = function(length) {
  this.length = length;
};

/**
 * Namespace time
 */

AST.Date.Time = {};

/**
 * Period of day AST.
 *
 * @constructor
 */

AST.Date.Time.Period = function() {};

/**
 * Namespace hour
 */

AST.Date.Time.Hour = {};

/**
 * 12 hour [1-12] AST.
 *
 * @param {Number(1,2)} length. Length of two gives zero padding.
 * @contructor
 */

AST.Date.Time.Hour.TwelveHourStartingAtOne = function(length) {
  this.lenght = length;
};

/**
 * 24 hour [0-23] AST.
 *
 * @param {Number(1,2)} length. Length of two gives zero padding.
 * @contructor
 */

AST.Date.Time.Hour.TwentyFourHourStartingAtZero = function(length) {
  this.lenght = length;
};

/**
 * 12 hour [0-11] AST.
 *
 * @param {Number(1,2)} length. Length of two gives zero padding.
 * @contructor
 */

AST.Date.Time.Hour.TwelveHourStartingAtZero = function(length) {
  this.lenght = length;
};

/**
 * 24 hour [1-24] AST.
 *
 * @param {Number(1,2)} length. Length of two gives zero padding.
 * @contructor
 */

AST.Date.Time.Hour.TwentyFourHourStartingAtOne = function(length) {
  this.lenght = length;
};

/**
 * Minute AST.
 *
 * @param {Number(1,2)} length. Length of two gives zero padding.
 * @contructor
 */

AST.Date.Minute = function(length) {
  this.length = length;
};

/**
 * Namespace second
 */

AST.Date.Second = {};

/**
 * Regular second AST.
 *
 * @param {Number(1,2)} length. Length of two gives zero padding.
 * @contructor
 */

AST.Date.Second.RegularSecond = function(length) {
  this.length = length;
};

/**
 * Fractional second AST.
 *
 * @param {Number(1..n)} length.
 * @contructor
 */

AST.Date.Second.FractionalSecond = function(length) {
  this.length = length;
};

/**
 * Milliseconds in day AST.
 *
 * @param {Number(1..n)} length.
 * @contructor
 */

AST.Date.Second.MilliSecondInDay = function(length) {
  this.length = length;
};

/**
 * Namespace time zone
 */

AST.Date.Timezone = {};

/**
 * Time zone in specific non location format AST.
 *
 * @param {Number(1..n)} length.
 * @contructor
 */

AST.Date.Timezone.SpecificNonLocationFormat = function(length) {
  this.length = length;
};

/**
 * Time zone in ISO8601 format AST.
 *
 *   Example:
 *
 *     length   string
 *     1..3     -08.00
 *     4        GMT-8:00
 *     5        -08:00 or -07:52:58
 *
 * @param {Number(1..5)} length.
 * @contructor
 */

AST.Date.Timezone.ISO8601 = function(length) {
  this.length = length;
};

/**
 * Time zone in localizaed GMT format.
 *
 *   Example:
 *
 *     length   string
 *     1        GMT-8
 *     4        GMT-08:00
 *
 * @param {Number(1,4)} length.
 * @contructor
 */

AST.Date.Timezone.LocalizedGMTFormat = function(length) {
  this.length = length;
};

/**
 * Time zone in generic non location format.
 *
 *   Example:
 *
 *     length   string
 *     1        PT
 *     4        Pacific Time
 *
 * @param {Number(1,4)} length.
 * @contructor
 */

AST.Date.Timezone.GenericNonLocationFormat = function(length) {
  this.length = length;
};

/**
 * Time zone in generic non location format.
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

AST.Date.Timezone.GenericLocationFormat = function(length) {
  this.length = length;
};

