
/**
 * Use namespace AST
 */
var AST = {};

/**
 * Use namespace AST.date
 */

AST.date = {};


/**
 * Era AST.
 *
 * @param {Era.Type}.Type
 * @constructor
 */

AST.date.Era = function.Type) {
  this.Type;
};

/**
 * Era.Types. An Era.Type is specified by the `G` letter. 1-3 letters
 * means a abbreviated era.Type. e.g. G means AD. GGGG mean Anno Domini.
 * GGGGG means narrow era.Type or just using the letter A for Anno Domini.
 *
 * @enum {AST.Data.Era.Type}
 */

AST.date.Era.Type = {
 ABBREVIATED: 0,
 FULL: 1,
 NARROW: 2
};

/**
 * Year AST
 *
 * @param {AST.date.Year.Type}.Type
 * @param {Number} length
 * @constructor
 */

AST.date.Year = function.Type, length) {
  this.Type =.Type;
  this.length = length;
};

/**
 * Year.Types. There exists four different year.Types. CALENDAR_YEAR,
 * WEEK_BASED_YEAR, EXTENDED_YEAR and CYCLIC_YEAR.
 *
 * @enum {Number}
 */

AST.date.Year.Type = {
  CALENDAR: 0,
  WEEK_BASED: 1,
  EXTENDED: 2,
  CYCLIC: 3
};

/**
 * Quarter AST.
 *
 * @param {AST.date.Quarter.Context} context
 * @param {AST.date.Quarter.Type}.Type
 * @param {Number} length
 * @constructor
 */

AST.date.Quarter = function(context, type, length) {
  this.type = type;
  this.length = length;
};

/**
 * Quarter context. Formated context is used along with other values. Stand alones
 * means that they stand alone and not being formated with other values.
 *
 * @enum {Number}
 */

AST.date.Quarter.Context = {
  FORMATED: 1,
  STAND_ALONE: 2,
};

/**
 * Quarter.Types.
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

AST.date.Quarter.Type = {
  ONE_DIGIT: 1,
  TWO_DIGIT: 2,
  ABBREVIATED: 3,
  WIDE: 4
};


/**
 * Month AST.
 *
 * @param {AST.date.Month.Context} context
 * @param {AST.date.Month.Type} type
 * @param {Number} length
 * @constructor
 */

AST.date.Month = function(context, type, length) {
  this.type = type;
  this.length = length;
};

/**
 * Month context. Formated context is used along with other values. Stand alones
 * means that they stand alone and not being formated with other values.
 *
 * @enum {Number}
 */

AST.date.Month.Context = {
  FORMATED: 1,
  STAND_ALONE: 2,
};

/**
 * Quarter.Types.
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

AST.date.Month.Type = {
  ONE_DIGIT: 1,
  TWO_DIGIT: 2,
  SHORT: 3,
  WIDE: 4,
  NARROW: 5
};

/**
 * Week of year AST.
 *
 * @param {AST.date.WeekOfYear.Type} type
 * @constructor
 */

AST.date.WeekOfYear = function(type) {
  this.type = type;
};

/**
 * Week of year.Types.
 *
 * @enum {Number}
 * @api public
 */

AST.date.WeekOfYear.Type = {
  WITHOUT_ZERO_PADDING: 1,
  WITH_ZERO_PADDING: 2
};

/**
 * Week of month AST.
 *
 * @constructor
 */

AST.date.WeekOfMonth = function() {};

/**
 * Namespace Day
 */

AST.date.day = {};

/**
 * Day of month AST.
 *
 * @param {AST.date.day.DayOfMonth.Type} type
 * @constructor
 */

AST.date.day.DayOfMonth = function(type) {
  this.type = type;
};

/**
 * Week of year.Types.
 *
 * @enum {Number}
 * @api public
 */

AST.date.day.DayOfMonth.Type = {
  WITHOUT_ZERO_PADDING: 1,
  WITH_ZERO_PADDING: 2
};

/**
 * Day of year AST.
 *
 * @param {AST.date.day.DayOfYear.Type}.Type
 * @constructor
 */

AST.date.day.DayOfYear = function(type) {
  this.type = type;
};

/**
 * Week of year types.
 *
 * @enum {Number}
 * @api public
 */

AST.date.day.DayOfYear.Type = {
  WITHOUT_ZERO_PADDING: 1,
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
 * Regular WeekDay. A regular weekday.
 *
 * @param {AST.date.weekDay.RegularWeekDay.Type} type
 * @constructor
 */

AST.date.weekDay.RegularWeekDay = function(type) {
  this.type = type;
};

/**
 * Regular week day types.
 *
 *   Example:
 *
 *     Type                 Output
 *
 *     ONE_CHARACTER        T
 *     TWO_CHARACTERS       Tu
 *     FOUR_CHARACTERS      Tues
 *     FULL                 Tuesday
 *
 * @enum {Number}
 * @api public
 */

AST.date.weekDay.RegularWeekDay.Type = {
  ONE_CHARACTER: 1,
  TWO_CHARACTERS: 2,
  FOUR_CHARACTERS: 3,
  FULL: 4
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
 * @param {AST.date.weekDay.LocalWeekDay.Type} type
 * @constructor
 */

AST.date.weekDay.LocalWeekDay = function(type) {
  this.type = type;
};

/**
 * Regular week day types.
 *
 *   Example:
 *
 *     Type                 Output
 *
 *     ONE_CHARACTER        T
 *     TWO_CHARACTERS       Tu
 *     FOUR_CHARACTERS      Tues
 *     FULL                 Tuesday
 *
 * @enum {Number}
 * @api public
 */

AST.date.weekDay.LocalWeekDay.Type = {
  DIGITS_WITHOUT_ZERO_PADDING: 1,
  DIGITS_WITH_ZERO_PADDING: 2,
  ONE_CHARACTER: 3,
  TWO_CHARACTERS: 4,
  FOUR_CHARACTERS: 5,
  FULL: 6
};


/**
 * Stand-alone regular WeekDay with numeric value for starting order of
 * the week day.
 *
 * @param {AST.date.weekDay.LocalStandAloneWeekDay.Type} type
 * @constructor
 */

AST.date.weekDay.LocalStandAloneWeekDay = function(type) {
  this.type = type;
};

/**
 * Regular week day types.
 *
 *   Example:
 *
 *     Type                 Output
 *
 *     ONE_CHARACTER        T
 *     TWO_CHARACTERS       Tu
 *     FOUR_CHARACTERS      Tues
 *     FULL                 Tuesday
 *
 * @enum {Number}
 * @api public
 */

AST.date.weekDay.LocalStandAloneWeekDay.Type = {
  DIGITS_WITHOUT_ZERO_PADDING: 1,
  DIGITS_WITH_ZERO_PADDING: 2,
  ONE_CHARACTER: 3,
  TWO_CHARACTERS: 4,
  FOUR_CHARACTERS: 5,
  FULL: 6
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
 * Namespace hour
 */

AST.date.time.hour = {};

/**
 * 12 hour [1-12] AST.
 *
 * @param {AST.date.TwelveHourStartingAtOne.Type} type
 * @contructor
 */

AST.date.time.hour.TwelveHourStartingAtOne = function(type) {
  this.type = type;
};

/**
 * 12 hours starting at 1.Types.
 *
 * @enum {Number}
 * @api public
 */

AST.date.time.hour.TwelveHourStartingAtOne.Type = {
  WITHOUT_ZERO_PADDING: 1,
  WITH_ZERO_PADDING: 2
};

/**
 * 24 hour [0-23] AST.
 *
 * @param {AST.date.TwentyFourHourStartingAtZero.Type}.Type
 * @contructor
 */

AST.date.time.hour.TwentyFourHourStartingAtZero = function(length) {
  this.lenght = length;
};

/**
 * 24 hours starting at 0.Types.
 *
 * @enum {Number}
 * @api public
 */

AST.date.time.hour.TwentyFourHourStartingAtZero.Type = {
  WITHOUT_ZERO_PADDING: 1,
  WITH_ZERO_PADDING: 2
};

/**
 * 12 hour [0-11] AST.
 *
 * @param {AST.date.TwelveHourStartingAtZero.Type} type
 * @contructor
 */

AST.date.time.hour.TwelveHourStartingAtZero = function(type) {
  this.type = type;
};

/**
 * 12 hours starting at 0.Types.
 *
 * @enum {Number}
 * @api public
 */

AST.date.time.hour.TwelveHourStartingAtZero.Type = {
  WITHOUT_ZERO_PADDING: 1,
  WITH_ZERO_PADDING: 2
};

/**
 * 24 hour [1-24] AST.
 *
 * @param {AST.date.TwentyFourHourStartingAtOne.Type}.Type
 * @contructor
 */

AST.date.time.Hour.TwentyFourHourStartingAtOne = function(type) {
  this.type = type;
};

/**
 * 24 hours starting at 1.Types.
 *
 * @enum {Number}
 * @api public
 */

AST.date.TwentyFourHourStartingAtOne.Type = {
  WITHOUT_ZERO_PADDING: 1,
  WITH_ZERO_PADDING: 2
};

/**
 * Minute AST.
 *
 * @param {AST.date.Minute.Type}.Type
 * @contructor
 */

AST.date.Minute = function(type) {
  this.type = type;
};

/**
 * Minute.Types.
 *
 * @enum {Number}
 * @api public
 */

AST.date.Minute.Type = {
  WITHOUT_ZERO_PADDING: 1,
  WITH_ZERO_PADDING: 2
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
 * ISO8601 time zone format with `Z` types.
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
