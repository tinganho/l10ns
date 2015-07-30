function encodeHTMLSource() {  var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },  matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;  return function() {    return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;  };};
String.prototype.encodeHTML=encodeHTMLSource();
var tmpl = {};
  tmpl['Case']=function anonymous(it) {
var out='case \''+(it.case)+'\':\n'+(it.caseBody)+'\n  break;';return out;
};
  tmpl['Condition']=function anonymous(it) {
var out='it.'+(it.variableName)+' '+(it.comparator)+' '+(it.value);return out;
};
  tmpl['ConditionStatement']=function anonymous(it) {
var out=''+(it.order)+'('+(it.condition)+') {\n'+(it.body)+'\n}';return out;
};
  tmpl['DateDayOfMonth']=function anonymous(it) {
var out='var dayOfMonthString = date.getDate() + \'\';';if(it.padding){out+='\nif(dayOfMonthString.length === 1) {\n  dayOfMonthString = \'0\' + dayOfMonthString;\n}';}out+='\ndateString += dayOfMonthString;';return out;
};
  tmpl['DateDayOfWeek']=function anonymous(it) {
var out='var days = [\n  \''+(it.days.mon)+'\',\n  \''+(it.days.tue)+'\',\n  \''+(it.days.wed)+'\',\n  \''+(it.days.thu)+'\',\n  \''+(it.days.fri)+'\',\n  \''+(it.days.sat)+'\',\n  \''+(it.days.sun)+'\'\n];\nvar day = date.getDay();\nif(day === 0) {\n  day = 6;\n}\nelse {\n  day--;\n}\ndateString += days[day];';return out;
};
  tmpl['DateDayOfWeekInMonth']=function anonymous(it) {
var out='var currentMonth = date.getMonth();\nvar currentDate = date.getDate();\nvar month = +currentMonth;\nvar year = date.getFullYear();\nvar count = 0;\nvar exploringDate;\nwhile(currentMonth === month) {\n  currentDate = currentDate - 7;\n  exploringDate = new Date(year, month, currentDate);\n  currentMonth = exploringDate.getMonth();\n  count++;\n}\ncount += \'\';\ndateString += count;';return out;
};
  tmpl['DateDayOfYear']=function anonymous(it) {
var out='var start = new Date(date.getFullYear(), 0, 0);\nvar diff = date - start;\nvar oneDay = 1000 * 60 * 60 * 24;\nvar day = Math.floor(diff / oneDay) + \'\';';if(it.padding){out+='\n'+(it.padding);}out+='\ndateString += day;';return out;
};
  tmpl['DateEra']=function anonymous(it) {
var out='if(date.getFullYear() >= 0) {\n  dateString += \''+(it.AD)+'\';\n}\nelse {\n  dateString += \''+(it.BC)+'\';\n}';return out;
};
  tmpl['DateFractionalSeconds']=function anonymous(it) {
var out='var milliseconds = date.getMilliseconds() + \'\';\nwhile(milliseconds.length < 3) {\n  milliseconds = \'0\' + milliseconds;\n}\nwhile(milliseconds.length < '+(it.length)+') {\n  milliseconds += \'0\';\n}\ndateString += milliseconds.substr(0, '+(it.length)+');';return out;
};
  tmpl['DateGenericLocationTimezone']=function anonymous(it) {
var out='';if(it.format === 1){out+='dateString += it.'+(it.variableName)+'.timezone;\n';}else if(it.format === 2){out+='dateString += this.__timezones[it.'+(it.variableName)+'.timezone].city;\n';}else{out+='if(this.__timezones[it.'+(it.variableName)+'.timezone].hasCity) {\n  dateString += this.__timezones[it.'+(it.variableName)+'.timezone].regionFormat.replace(\'{0}\', this.__timezones[it.'+(it.variableName)+'.timezone].city);\n}\nelse {\n  dateString += getLongLocalizedGMT(this.__timezones[it.'+(it.variableName)+'.timezone].GMTFormat, timezoneOffset);\n}';}return out;
};
  tmpl['DateGenericNonLocationTimezone']=function anonymous(it) {
var out='';if(it.format === 1){out+='if(this.__timezones[it.'+(it.variableName)+'.timezone].name.short.generic) {\n  dateString += this.__timezones[it.'+(it.variableName)+'.timezone].name.short.generic;\n}\nelse {\n  if(this.__timezones[it.'+(it.variableName)+'.timezone].hasCity) {\n    dateString += this.__timezones[it.'+(it.variableName)+'.timezone].regionFormat.replace(\'{0}\', this.__timezones[it.'+(it.variableName)+'.timezone].city);\n  }\n  else {\n    dateString += this.__timezones[it.'+(it.variableName)+'.timezone].GMTFormat.replace(\'{0}\', getTimezoneOffset(timezoneOffset, { zeroPaddingHours: false, minutes: false, colon: false }));\n  }\n}';}else{out+='if(this.__timezones[it.'+(it.variableName)+'.timezone].name.long.generic) {\n  dateString += this.__timezones[it.'+(it.variableName)+'.timezone].name.long.generic;\n}\nelse {\n  if(this.__timezones[it.'+(it.variableName)+'.timezone].hasCity) {\n    dateString += this.__timezones[it.'+(it.variableName)+'.timezone].regionFormat.replace(\'{0}\', this.__timezones[it.'+(it.variableName)+'.timezone].city);\n  }\n  else {\n    dateString += getLongLocalizedGMT(this.__timezones[it.'+(it.variableName)+'.timezone].GMTFormat, timezoneOffset);\n  }\n}';}return out;
};
  tmpl['DateGetLongLocalizedGMT']=function anonymous(it) {
var out='function getLongLocalizedGMT(GMTFormat, timezoneOffset) {\n  return GMTFormat.replace(\'{0}\', getTimezoneOffset(timezoneOffset));\n}';return out;
};
  tmpl['DateGetTimezoneOffset']=function anonymous(it) {
var out='function getTimezoneOffset(timezoneOffset, options) {\n  options = options || {};\n  options.hours = typeof options.hours !== \'undefined\' ? options.hours : true;\n  options.zeroPaddingHours = typeof options.zeroPaddingHours !== \'undefined\' ? options.zeroPaddingHours : true;\n  options.minutes = typeof options.minutes !== \'undefined\' ? options.minutes : true;\n  options.colon = typeof options.colon !== \'undefined\' ? options.colon : true;\n  options.zulu = typeof options.zulu !== \'undefined\' ? options.zulu : false;\n\n  var offsetFloatingHours = timezoneOffset / 60;\n  var offsetHours;\n  var offsetMinutes;\n\n  if(timezoneOffset >= 0) {\n    offsetHours = Math.floor(offsetFloatingHours);\n    offsetMinutes = ((offsetFloatingHours % 1) * 60).toFixed(0);\n  }\n  else {\n    offsetHours = Math.ceil(offsetFloatingHours);\n    offsetMinutes = - ((offsetFloatingHours % 1) * 60).toFixed(0);\n  }\n  if(offsetMinutes < 10) {\n    offsetMinutes = \'0\' + offsetMinutes;\n  }\n\n  if(options.zulu && offsetHours === 0) {\n    return \'Z\';\n  }\n\n  var result = \'\';\n  if(options.zeroPaddingHours) {\n    if(offsetHours > -10 && offsetHours < 0) {\n      offsetHours = (offsetHours + \'\').replace(\'-\', \'-0\');\n    }\n    else if(offsetHours >= 0 && offsetHours < 10) {\n      offsetHours = \'0\' + offsetHours;\n    }\n  }\n  if(options.hours) {\n    if((offsetHours + \'\').charAt(0) !== \'-\') {\n      offsetHours = \'+\' + offsetHours;\n    }\n    result += offsetHours;\n  }\n  if(options.colon) {\n    result += \':\';\n  }\n  if(options.minutes) {\n    result += offsetMinutes;\n  }\n\n  return result;\n}';return out;
};
  tmpl['DateHour']=function anonymous(it) {
var out='var hours = date.getHours();';if(it.start === 0 && it.length === 24){}else if(it.start === 1 && it.length === 24){out+='\nif(hours === 0) {\n  hours = 24;\n}';}else if(it.start === 0 && it.length === 12){out+='\nif(hours > 11) {\n  hours = hours - 12;\n}';}else{out+='\nif(hours > 11) {\n  hours = hours - 12;\n}\nif(hours === 0) {\n  hours = 12;\n}';}if(it.padding){out+='\nif(hours < 10) {\n  hours = \'0\' + hours;\n}';}out+='\ndateString += hours;';return out;
};
  tmpl['DateISO8601WithZTimezone']=function anonymous(it) {
var out='';if(it.format === 1){out+='if(timezoneOffset % 60 === 0) {\n  dateString += getTimezoneOffset(timezoneOffset, { minutes: false, colon: false, zulu: true });\n}\nelse {\n  dateString += getTimezoneOffset(timezoneOffset, { colon: false });\n}';}else if(it.format === 2){out+='dateString += getTimezoneOffset(timezoneOffset, { colon: false, zulu: true });\n';}else{out+='dateString += getTimezoneOffset(timezoneOffset, { zulu: true });\n';}return out;
};
  tmpl['DateISO8601WithoutZTimezone']=function anonymous(it) {
var out='';if(it.format === 1){out+='if(timezoneOffset % 60 === 0) {\n  dateString += getTimezoneOffset(timezoneOffset, { minutes: false, colon: false });\n}\nelse {\n  dateString += getTimezoneOffset(timezoneOffset, { colon: false });\n}';}else if(it.format === 2){out+='dateString += getTimezoneOffset(timezoneOffset, { colon: false });\n';}else{out+='dateString += getTimezoneOffset(timezoneOffset);\n';}return out;
};
  tmpl['DateLocalDayOfWeekDigit']=function anonymous(it) {
var out='var day = date.getDay();\nif(day === 0) {\n  day = 7;\n}\nday += \'\';';if(it.padding){out+='\nday = \'0\' + day;';}out+='\ndateString += day;';return out;
};
  tmpl['DateLocalizedGMTTimezone']=function anonymous(it) {
var out='';if(it.format === 1){out+='dateString += this.__timezones[it.'+(it.variableName)+'.timezone].GMTFormat.replace(\'{0}\', getTimezoneOffset(timezoneOffset, { zeroPaddingHours: false, minutes: false, colon: false }));\n';}else{out+='dateString += getLongLocalizedGMT(this.__timezones[it.'+(it.variableName)+'.timezone].GMTFormat, timezoneOffset);\n';}return out;
};
  tmpl['DateMinute']=function anonymous(it) {
var out='var minutes = date.getMinutes();';if(it.padding){out+='\nif(minutes < 10) {\n  minutes = \'0\' + minutes;\n}';}out+='\ndateString += minutes;';return out;
};
  tmpl['DateMonth']=function anonymous(it) {
var out='var month = date.getMonth();\nvar monthStrings = [\n  \''+(it.monthStrings['1'])+'\',\n  \''+(it.monthStrings['2'])+'\',\n  \''+(it.monthStrings['3'])+'\',\n  \''+(it.monthStrings['4'])+'\',\n  \''+(it.monthStrings['5'])+'\',\n  \''+(it.monthStrings['6'])+'\',\n  \''+(it.monthStrings['7'])+'\',\n  \''+(it.monthStrings['8'])+'\',\n  \''+(it.monthStrings['9'])+'\',\n  \''+(it.monthStrings['10'])+'\',\n  \''+(it.monthStrings['11'])+'\',\n  \''+(it.monthStrings['12'])+'\'\n];\ndateString += monthStrings[month];';return out;
};
  tmpl['DatePadding']=function anonymous(it) {
var out='while('+(it.variableName)+'.length < '+(it.minimum)+') {\n  '+(it.variableName)+' = \'0\' + '+(it.variableName)+';\n}';return out;
};
  tmpl['DatePeriod']=function anonymous(it) {
var out='if(date.getHours() < 12) {\n  dateString += \''+(it.period.am)+'\';\n}\nelse {\n  dateString += \''+(it.period.pm)+'\';\n}';return out;
};
  tmpl['DateQuarter']=function anonymous(it) {
var out='var quarter = Math.floor(date.getMonth() / 3);\nvar quarterStrings = [\n  \''+(it.Q1)+'\',\n  \''+(it.Q2)+'\',\n  \''+(it.Q3)+'\',\n  \''+(it.Q4)+'\'\n];\ndateString += quarterStrings[quarter];';return out;
};
  tmpl['DateRegularTimezone']=function anonymous(it) {
var out='';if(it.format === 1){out+='dateString += getTimezoneOffset(timezoneOffset, { colon: false });\n';}else if(it.format === 2){out+='dateString += getLongLocalizedGMT(this.__timezones[it.'+(it.variableName)+'.timezone].GMTFormat, timezoneOffset);\n';}else{out+='dateString += getTimezoneOffset(timezoneOffset);\n';}return out;
};
  tmpl['DateSecond']=function anonymous(it) {
var out='var seconds = date.getSeconds();';if(it.padding){out+='\nif(seconds < 10) {\n  seconds = \'0\' + seconds;\n}';}out+='\ndateString += seconds;';return out;
};
  tmpl['DateSentence']=function anonymous(it) {
var out='dateString += \''+(it.sentence)+'\';';return out;
};
  tmpl['DateSpecificNonLocationTimezone']=function anonymous(it) {
var out='';if(it.format === 1){out+='if(timezoneOffsetType === \'s\') {\n  if(this.__timezones[it.'+(it.variableName)+'.timezone].name.short.standard) {\n    dateString += this.__timezones[it.'+(it.variableName)+'.timezone].name.short.standard;\n  }\n  else {\n    dateString += this.__timezones[it.'+(it.variableName)+'.timezone].GMTFormat.replace(\'{0}\', getTimezoneOffset(timezoneOffset, { zeroPaddingHours: false, minutes: false, colon: false }));\n  }\n}\nelse {\n  if(this.__timezones[it.'+(it.variableName)+'.timezone].name.short.daylight) {\n    dateString += this.__timezones[it.'+(it.variableName)+'.timezone].name.short.daylight;\n  }\n  else {\n    dateString += this.__timezones[it.'+(it.variableName)+'.timezone].GMTFormat.replace(\'{0}\', getTimezoneOffset(timezoneOffset, { zeroPaddingHours: false, minutes: false, colon: false }));\n  }\n}';}else{out+='if(timezoneOffsetType === \'s\') {\n  if(this.__timezones[it.'+(it.variableName)+'.timezone].name.long.standard) {\n    dateString += this.__timezones[it.'+(it.variableName)+'.timezone].name.long.standard;\n  }\n  else {\n    dateString += getLongLocalizedGMT(this.__timezones[it.'+(it.variableName)+'.timezone].GMTFormat, timezoneOffset);\n  }\n}\nelse {\n  if(this.__timezones[it.'+(it.variableName)+'.timezone].name.long.daylight) {\n    dateString += this.__timezones[it.'+(it.variableName)+'.timezone].name.long.daylight;\n  }\n  else {\n    dateString += getLongLocalizedGMT(this.__timezones[it.'+(it.variableName)+'.timezone].GMTFormat, timezoneOffset);\n  }\n}';}out+='\n';return out;
};
  tmpl['DateTimeZones']=function anonymous(it) {
var out='var timezones = '+(it.timezones)+';';return out;
};
  tmpl['DateWeekBasedYear']=function anonymous(it) {
var out='var calendarYear = date.getFullYear();\nvar date_ = date.getDate();\nvar month = date.getMonth();\nvar year;\n';if(it.startOfWeek === 0){out+='if(month === 0 && date_ < 4 || month === 11 && date_ > 28) {\n  if(date_ < 4) {\n    var startOfWeekBasedYearDate;\n    var startOfThisCalendarYearDay = new Date(calendarYear + \'-01-01\').getDay();\n    if(startOfThisCalendarYearDay === 0) {\n      startOfThisCalendarYearDay = 7;\n    }\n    if(startOfThisCalendarYearDay <= 4) {\n      startOfWeekBasedYearDate = 1;\n    }\n    else {\n      startOfWeekBasedYearDate = 1 + 7 - startOfThisCalendarYearDay + 1;\n    }\n    if(date_ >= startOfWeekBasedYearDate) {\n      year = calendarYear;\n    }\n    else {\n      year = calendarYear - 1;\n    }\n  }\n  else {\n    var endOfThisWeekBasedYearDate;\n    var endOfThisCalendarYearDay = new Date(calendarYear + \'-12-31\').getDay();\n    if(endOfThisCalendarYearDay === 0) {\n      endOfThisCalendarYearDay = 7;\n    }\n    if(endOfThisCalendarYearDay >= 4) {\n      endOfThisWeekBasedYearDate = 31;\n    }\n    else {\n      endOfThisWeekBasedYearDate = 31 - endOfThisCalendarYearDay;\n    }\n    if(date_ <= endOfThisWeekBasedYearDate) {\n      year = calendarYear;\n    }\n    else {\n      year = calendarYear + 1;\n    }\n  }\n}\nelse {\n  year = calendarYear;\n}\nyear = year + \'\';';}else{out+='if(month === 0 && date_ < 4 || month === 11 && date_ > 28) {\n  if(date_ < 4) {\n    var startOfWeekBasedYearDate;\n    var startOfThisCalendarYearDay = new Date(calendarYear + \'-01-01\').getDay();\n    if(startOfThisCalendarYearDay <= 3) {\n      startOfWeekBasedYearDate = 1;\n    }\n    else {\n      startOfWeekBasedYearDate = 1 + 7 - startOfThisCalendarYearDay + 1;\n    }\n    if(date_ >= startOfWeekBasedYearDate) {\n      year = calendarYear;\n    }\n    else {\n      year = calendarYear - 1;\n    }\n  }\n  else {\n    var endOfThisWeekBasedYearDate;\n    var endOfThisCalendarYearDay = new Date(calendarYear + \'-12-31\').getDay();\n    if(endOfThisCalendarYearDay >= 3) {\n      endOfThisWeekBasedYearDate = 31;\n    }\n    else {\n      endOfThisWeekBasedYearDate = 31 - endOfThisCalendarYearDay - 1;\n    }\n    if(date_ <= endOfThisWeekBasedYearDate) {\n      year = calendarYear;\n    }\n    else {\n      year = calendarYear + 1;\n    }\n  }\n}\nelse {\n  year = calendarYear;\n}\nyear = year + \'\';';}return out;
};
  tmpl['DateWeekOfMonth']=function anonymous(it) {
var out='';if(it.startOfWeek === 0){out+='var dateCopy = new Date(+date);\ndateCopy.setHours(0,0,0);\ndateCopy.setDate(dateCopy.getDate() + 4 - (dateCopy.getDay() || 7 ));\nvar monthStart = new Date(dateCopy.getFullYear(),dateCopy.getMonth(), 1);\nvar week = Math.ceil((((dateCopy - monthStart) / 86400000) + 1)/7);\ndateString += week;';}else{out+='var dateCopy = new Date(+date);\ndateCopy.setHours(0,0,0);\ndateCopy.setDate(dateCopy.getDate() + 3 - dateCopy.getDay());\nvar monthStart = new Date(dateCopy.getFullYear(),dateCopy.getMonth(), 1);\nvar week = Math.ceil((((dateCopy - monthStart) / 86400000) + 1)/7);\ndateString += week;';}return out;
};
  tmpl['DateWeekOfYear']=function anonymous(it) {
var out='';if(it.startOfWeek === 0){out+='var dateCopy = new Date(+date);\ndateCopy.setHours(0,0,0);\ndateCopy.setDate(dateCopy.getDate()+4-(dateCopy.getDay()||7));\nvar week = Math.ceil((((dateCopy-new Date(dateCopy.getFullYear(),0,1))/8.64e7)+1)/7) + \'\';';if(it.padding){out+='\nif(week.length === 1) {\n  week = \'0\' + week;\n}';}out+='\ndateString += week;';}else{out+='var dateCopy = new Date(+date);\ndateCopy.setHours(0,0,0);\ndateCopy.setDate(dateCopy.getDate()+3-dateCopy.getDay());\nvar week = Math.ceil((((dateCopy-new Date(dateCopy.getFullYear(),0,1))/8.64e7)+1)/7) + \'\';';if(it.padding){out+='\nif(week.length === 1) {\n  week = \'0\' + week;\n}';}out+='\ndateString += week;\n';}return out;
};
  tmpl['FormatYear']=function anonymous(it) {
var out='var yearString = \'\';\n';if(it.length != 2){out+='if(year.length >= '+(it.length)+') {\n  yearString = year;\n}\nelse {\n  var difference = '+(it.length)+' - year.length;\n  for(var i = 0; i < difference; i++) {\n    yearString += \'0\';\n  }\n  yearString += year;\n}';}else{out+='if(year.length < 2) {\n  yearString += \'0\' + year;\n}\nelse {\n  yearString += year.substring(year.length - 2, year.length);\n}';}out+='\ndateString += yearString;';return out;
};
  tmpl['SetDateBlock']=function anonymous(it) {
var out='var date;\nvar dateString = \'\';\nvar year;\nvar month;\nvar date_;\nvar hours;\nvar minutes;\nvar seconds;\nvar milliseconds;\nvar timezoneOffset;\nvar timezoneOffsetType;\nif(it.'+(it.variableName)+' instanceof Date) {\n  date = it.'+(it.variableName)+';\n  timezoneOffset = date.getTimezoneOffset();\n}\nelse {\n  if(!this.__timezones) {\n    throw new TypeError(\'You must define your timezones in your configuration file l10ns.json and compile again. http://l10ns.org/docs.html#dateformat\');\n  }\n\n  if(typeof it.'+(it.variableName)+'.timezone === \'undefined\') {\n    throw new TypeError(\'You must define a \\\'timezone\\\' property for '+(it.variableName)+'\');\n  }\n\n  if(!(it.'+(it.variableName)+'.timezone in timezones)) {\n    throw new TypeError(\'Timezone \\\'\' + it.'+(it.variableName)+'.timezone + \'\\\' is not defined. Please define it in your l10ns.json file.\');\n  }\n\n  if(typeof it.'+(it.variableName)+'.time === \'undefined\') {\n    throw new TypeError(\'You must define a time property for '+(it.variableName)+'\');\n  }\n\n  if(!(it.'+(it.variableName)+'.time instanceof Date)) {\n    throw new TypeError(\'Property time must be of type Date.\');\n  }\n\n  date = new Date(it.'+(it.variableName)+'.time.getTime());\n  var currentMinutes = date.getMinutes();\n  var currentTimezoneOffset = -(date.getTimezoneOffset());\n  var timezoneInfo = timezones[it.'+(it.variableName)+'.timezone];\n  var unixTime = date.getTime();\n  var index;\n  if(unixTime > timezoneInfo.untils[timezoneInfo.untils.length - 1] || unixTime < timezoneInfo.untils[0]) {\n    timezoneOffset = -1 * timezoneInfo.offsets.reduce(function (previous, current) {\n      return (Math.abs(current - 0) < Math.abs(previous - 0) ? current : previous);\n    });\n    timezoneOffsetType = timezoneInfo.types[0];\n  }\n  else {\n    for(var index = 0; index < timezoneInfo.untils.length; index++) {\n      if(unixTime < timezoneInfo.untils[index]) {\n        index = index - 1;\n        break;\n      }\n    }\n    timezoneOffset = -(timezoneInfo.offsets[index]);\n    timezoneOffsetType = timezoneInfo.types[index];\n  }\n  date.setMinutes(currentMinutes + (timezoneOffset - currentTimezoneOffset));\n}';return out;
};
  tmpl['SetYear']=function anonymous(it) {
var out='var year = date.getFullYear() + \'\';';return out;
};
  tmpl['FirstRangeCondition']=function anonymous(it) {
var out='if(isNaN(parseFloat(it.'+(it.variableName)+')) || it.'+(it.variableName)+' '+(it.type)+' '+(it.lowestLimit)+' || it.'+(it.variableName)+' '+(it.limits.lower.type)+' '+(it.limits.lower.value)+' && it.'+(it.variableName)+' '+(it.limits.upper.type)+' '+(it.limits.upper.value)+') {\n'+(it.body)+'\n}';return out;
};
  tmpl['FormatCurrency']=function anonymous(it) {
var out='formatNumber({\n  number: it.'+(it.variableName)+'.amount,\n  type: \''+(it.type)+'\',\n  roundTo: '+(it.roundTo)+',\n  prefix: \''+(it.prefix)+'\',\n  suffix: \''+(it.suffix)+'\',\n  percentage: '+(it.percentage)+',\n  permille: '+(it.permille)+',';if(it.currency === 'symbol'){out+='\n  currency: {\n    symbol: unit\n  },';}else{out+='\n  currency: null,';}if(it.groupSize){out+='\n  groupSize: {\n    primary: '+(it.groupSize.primary)+',\n    secondary: '+(it.groupSize.secondary)+'\n  },';}else{out+='\n  groupSize: null,';}if(it.exponent){out+='\n  exponent: {\n    digits: '+(it.exponent.digits)+',\n    plusSign: '+(it.exponent.plusSign)+'\n  },';}else{out+='\n  exponent: null,';}out+='\n  minimumIntegerDigits: '+(it.minimumIntegerDigits)+',\n  maximumIntegerDigits: '+(it.maximumIntegerDigits)+',\n  minimumFractionDigits: '+(it.minimumFractionDigits)+',\n  maximumFractionDigits: '+(it.maximumFractionDigits)+',\n  minimumSignificantDigits: '+(it.minimumSignificantDigits)+',\n  maximumSignificantDigits: '+(it.maximumSignificantDigits)+',\n  symbols: this.__numberSymbols[\''+(it.numberSystem)+'\'],';if(it.paddingCharacter){out+='\n  paddingCharacter: \''+(it.paddingCharacter)+'\',';}else{out+='\n  paddingCharacter: null,';}out+='\n  patternLength: '+(it.patternLength)+'\n});';return out;
};
  tmpl['FormatCurrencyCondition']=function anonymous(it) {
var out='if(it.'+(it.variableName)+'.amount >= 0) {\n'+(it.positive)+'\n}\nelse {\n'+(it.negative)+'\n}';return out;
};
  tmpl['FormatCurrencyTextCondition']=function anonymous(it) {
var out='var number;\nif(it.'+(it.variableName)+'.amount >= 0) {\n  number =\n'+(it.positive)+'\n}\nelse {\n  number =\n'+(it.negative)+'\n}\ncurrencyString += this.__currencyUnitPattern[pluralKeyword].replace(\'{0}\', number).replace(\'{1}\', unit);';return out;
};
  tmpl['FormatNumber']=function anonymous(it) {
var out='formatNumber({';if(it.currency){out+='\n  number: it.'+(it.variableName)+'.amount,';}else{out+='\n  number: it.'+(it.variableName)+',';}out+='\n  type: \''+(it.type)+'\',\n  roundTo: '+(it.roundTo)+',\n  prefix: \''+(it.prefix)+'\',\n  suffix: \''+(it.suffix)+'\',\n  percentage: '+(it.percentage)+',\n  permille: '+(it.permille)+',';if(it.currency){out+='\n  currency: {\n    symbol: unit\n  },';}else{out+='\n  currency: null,';}if(it.groupSize){out+='\n  groupSize: {\n    primary: '+(it.groupSize.primary)+',\n    secondary: '+(it.groupSize.secondary)+'\n  },';}else{out+='\n  groupSize: null,';}if(it.exponent){out+='\n  exponent: {\n    digits: '+(it.exponent.digits)+',\n    plusSign: '+(it.exponent.plusSign)+'\n  },';}else{out+='\n  exponent: null,';}out+='\n  minimumIntegerDigits: '+(it.minimumIntegerDigits)+',\n  maximumIntegerDigits: '+(it.maximumIntegerDigits)+',\n  minimumFractionDigits: '+(it.minimumFractionDigits)+',\n  maximumFractionDigits: '+(it.maximumFractionDigits)+',\n  minimumSignificantDigits: '+(it.minimumSignificantDigits)+',\n  maximumSignificantDigits: '+(it.maximumSignificantDigits)+',\n  symbols: this.__numberSymbols[\''+(it.numberSystem)+'\'],';if(it.paddingCharacter){out+='\n  paddingCharacter: \''+(it.paddingCharacter)+'\',';}else{out+='\n  paddingCharacter: null,';}out+='\n  patternLength: '+(it.patternLength)+'\n});';return out;
};
  tmpl['FormatNumberCondition']=function anonymous(it) {
var out='if(it.'+(it.variableName)+' >= 0) {\n'+(it.positive)+'\n}\nelse {\n'+(it.negative)+'\n}';return out;
};
  tmpl['FormatNumberFunction']=function anonymous(it) {
var out='function toSignficantDigits(number, minimumSignificantDigits, maximumSignificantDigits) {\n  var multiple = Math.pow(10, maximumSignificantDigits - Math.floor(Math.log(number) / Math.LN10) - 1);\n  number = Math.round(number * multiple) / multiple + \'\';\n  var difference = maximumSignificantDigits - minimumSignificantDigits;\n  if(difference > 0 && /\\./.test(difference)) {\n    number = number.replace(new RegExp(\'0{1,\' + difference + \'}$\'), \'\');\n  }\n  var subtract = 0;\n  if(/^0\\./.test(number)) {\n    subtract = 2;\n  }\n  else if(/\\./.test(number)) {\n    subtract = 1;\n  }\n  while(number.length - subtract < minimumSignificantDigits) {\n    number += \'0\';\n  }\n\n  return number;\n}\n\nfunction toExponentDigits(number, it) {\n  var minimumMantissaIntegerDigits = 1\n    , maximumMantissaIntegerDigits = Infinity\n    , exponentGrouping = 1\n    , minimumMantissaSignificantDigits\n    , maximumMantissaSignificantDigits\n    , exponentNumber = 0;\n\n  if(it.type === \'floating\') {\n    if(it.maximumIntegerDigits === it.minimumIntegerDigits) {\n      minimumMantissaIntegerDigits = maximumMantissaIntegerDigits = it.minimumIntegerDigits;\n    }\n    else {\n      maximumMantissaIntegerDigits = it.maximumIntegerDigits;\n      exponentGrouping = it.maximumIntegerDigits;\n    }\n\n    minimumMantissaSignificantDigits = 1;\n    maximumMantissaSignificantDigits = it.minimumIntegerDigits + it.maximumFractionDigits;\n  }\n  else {\n    minimumMantissaIntegerDigits = maximumMantissaIntegerDigits = 1;\n    minimumMantissaSignificantDigits = it.minimumSignificantDigits;\n    maximumMantissaSignificantDigits = it.maximumSignificantDigits\n  }\n\n  if(number >= 1) {\n    var divider = Math.pow(10, exponentGrouping)\n      , integerLength = (number + \'\').replace(/\\.\\d+/, \'\').length;\n    while((integerLength < minimumMantissaIntegerDigits || integerLength > maximumMantissaIntegerDigits) &&\n          (exponentNumber + \'\').length === it.exponent.digits) {\n      number = number / divider;\n      exponentNumber += exponentGrouping;\n      integerLength = (number + \'\').replace(/\\.\\d+/, \'\').length;\n    }\n    if((exponentNumber + \'\').length !== it.exponent.digits) {\n      exponentNumber--;\n      number = number * divider;\n    }\n  }\n  else {\n    var multiplier = Math.pow(10, exponentGrouping)\n      , integerLength = (number + \'\').replace(/^0\\.\\d+/, \'\').replace(/\\.\\d+/, \'\').length;\n    while((integerLength < minimumMantissaIntegerDigits || integerLength > maximumMantissaIntegerDigits) &&\n          (Math.abs(exponentNumber) + \'\').length === it.exponent.digits) {\n      number = number * multiplier;\n      exponentNumber -= exponentGrouping;\n      integerLength = (number + \'\').replace(/^0\\.\\d+/, \'\').replace(/\\.\\d+/, \'\').length;\n    }\n    if((Math.abs(exponentNumber) + \'\').length !== it.exponent.digits) {\n      exponentNumber++;\n      number = number / multiplier;\n    }\n  }\n\n  var mantissa = toSignficantDigits(number, minimumMantissaSignificantDigits, maximumMantissaSignificantDigits)\n    , mantissa = mantissa.split(\'.\')\n    , exponent = it.symbols.exponential;\n  if(it.exponent.plusSign && exponentNumber > 0) {\n    exponent += it.symbols.plusSign;\n  }\n  exponent += exponentNumber;\n\n  if(it.type === \'floating\') {\n    if(it.minimumFractionDigits > 0) {\n      if(typeof mantissa[1] === \'undefined\') {\n        mantissa[1] = \'\';\n      }\n      while(mantissa[1].length < it.minimumFractionDigits) {\n        mantissa[1] += \'0\';\n      }\n    }\n  }\n\n  return {\n    integer: mantissa[0],\n    fraction: mantissa[1],\n    exponent: exponent\n  };\n};\n\nfunction formatNumber(it) {\n  if(typeof it.number !== \'number\') {\n    return it.symbols.nan;\n  }\n  if(it.number === Infinity) {\n    return it.symbols.plusSign + it.symbols.infinity;\n  }\n  if(it.number === -Infinity) {\n    return it.symbols.minusSign + it.symbols.infinity;\n  }\n\n  var number = Math.abs(it.number)\n    , prefix = it.prefix\n    , suffix = it.suffix\n    , currencySymbol =\n      \'([\\\\u0024\\\\u00A2-\\\\u00A5\\\\u058F\\\\u060B\\\\u09F2\\\\u09F3\\\\u09FB\\\\u0AF1\\\\\\\n         \\\\u0BF9\\\\u0E3F\\\\u17DB\\\\u20A0-\\\\u20BD\\\\uA838\\\\uFDFC\\\\uFE69\\\\uFF04\\\\\\\n         \\\\uFFE0\\\\uFFE1\\\\uFFE5\\\\uFFE6])\'\n    , startsWithCurrencySymbolSyntax = new RegExp(\'^\' + currencySymbol)\n    , endsWithCurrencySymbolSyntax = new RegExp(currencySymbol + \'$\');\n\n  if(it.percentage) {\n    prefix = prefix.replace(\'%\', it.symbols.percentSign);\n    suffix = suffix.replace(\'%\', it.symbols.percentSign);\n    number = number * 100;\n  }\n  else if(it.permille) {\n    prefix = prefix.replace(\'‰\', it.symbols.perMille);\n    suffix = suffix.replace(\'‰\', it.symbols.perMille);\n    number = number * 1000;\n  }\n\n  if(it.exponent) {\n    var exponent = toExponentDigits(number, it);\n    integerDigits = exponent.integer;\n    fractionDigits = exponent.fraction || \'\';\n    exponent = exponent.exponent;\n  }\n  else if(it.type === \'significant\') {\n    number = toSignficantDigits(number, it.minimumSignificantDigits, it.maximumSignificantDigits);\n  }\n  else {\n    number = roundTo(number, it.roundTo);\n  }\n\n  if(!it.exponent) {\n    var numberSplit = (number + \'\').split(\'.\')\n      , integerDigits = numberSplit[0]\n      , integerDigitsLength = integerDigits.length\n      , fractionDigits = numberSplit[1] || \'\'\n      , fractionDigitsLength = fractionDigits.length;\n\n    if(it.type === \'floating\' && integerDigitsLength < it.minimumIntegerDigits) {\n      var missingIntegerDigits = it.minimumIntegerDigits - integerDigitsLength;\n      for(var index = 0; index < missingIntegerDigits; index++) {\n        integerDigits = \'0\' + integerDigits;\n      }\n      integerDigitsLength = it.minimumIntegerDigits;\n    }\n    if(it.groupSize) {\n      var newIntegerDigits = \'\';\n      for(var index = integerDigitsLength - 1; index >= 0; index--) {\n        var primaryIndex = integerDigitsLength - it.groupSize.primary - 1;\n        if(index === primaryIndex) {\n          newIntegerDigits += it.symbols.group;\n        }\n        else if(index < primaryIndex && (primaryIndex - index) % it.groupSize.secondary === 0) {\n          newIntegerDigits += it.symbols.group;\n        }\n\n        newIntegerDigits += integerDigits.charAt(index);\n      }\n      integerDigits = newIntegerDigits.split(\'\').reverse().join(\'\');\n    }\n\n    if(it.type === \'floating\') {\n      if(fractionDigitsLength > it.maximumFractionDigits) {\n        fractionDigits = fractionDigits.substring(0, it.maximumFractionDigits);\n      }\n      else if(fractionDigitsLength < it.minimumFractionDigits) {\n        var missingFractionDigits = it.minimumFractionDigits - fractionDigitsLength;\n        for(var index = 0; index < missingFractionDigits; index++) {\n          fractionDigits += \'0\';\n        }\n      }\n\n      if(fractionDigits.length > it.minimumFractionDigits) {\n        fractionDigits = fractionDigits.replace(/[0]+$/, \'\');\n      }\n    }\n  }\n\n  if(it.currency) {\n    if(!endsWithCurrencySymbolSyntax.test(it.currency.symbol)) {\n      prefix = prefix + \' \';\n    }\n    if(!startsWithCurrencySymbolSyntax.test(it.currency.symbol)) {\n      suffix = \' \' + suffix;\n    }\n    prefix = prefix.replace(/¤+/, it.currency.symbol);\n    suffix = suffix.replace(/¤+/, it.currency.symbol);\n  }\n\n  var result = \'\';\n  result += prefix;\n  result += integerDigits;\n  if(fractionDigits.length > 0) {\n    result += it.symbols.decimal + fractionDigits;\n  }\n  if(exponent) {\n    result += exponent;\n  }\n  result += suffix;\n\n  if(it.paddingCharacter) {\n    var resultLength = result.length - 2;\n    result = result.replace(new RegExp(\'\\\\*\\\\\' + it.paddingCharacter), function(match) {\n      var replacement = \'\';\n      while(resultLength < it.patternLength) {\n        replacement += it.paddingCharacter;\n        resultLength++;\n      }\n\n      return replacement;\n    });\n  }\n\n  return result;\n}';return out;
};
  tmpl['Function']=function anonymous(it) {
var out='function(it) {\n  var string = \'\';\n'+(it.functionBody)+'\n  return string;\n}';return out;
};
  tmpl['GetPluralKeyword']=function anonymous(it) {
var out='function(cardinal) {\n';if(it.functionBody !== '  return \'other\';'){out+='  var cardinal = cardinal + \'\'\n    , n = cardinal\n    , i = parseInt(cardinal, 10)\n    , v = 0\n    , w = 0\n    , f = 0\n    , t = 0;\n\n  var hasFractionalDigitsSyntax = /\\.(\\d+)/;\n\n  if(hasFractionalDigitsSyntax.test(cardinal)) {\n    f = hasFractionalDigitsSyntax.exec(cardinal)[1];\n    v = f.length;\n    t = cardinal.replace(/0+$/, \'\');\n    t = hasFractionalDigitsSyntax.exec(t)[1];\n    w = t.length;\n  }';}out+=(it.functionBody)+'\n},';return out;
};
  tmpl['JavascriptWrapper']=function anonymous(it) {
var out=';(function() {';if(it.hasTimezone){out+='\n'+(it.timezones)+'\n';}out+='\n'+(it.getTimezoneOffsetFunction)+'\n\n'+(it.getLongLocalizedGMTFunction)+'\n\n'+(it.roundUpFunction)+'\n\n'+(it.formatNumberFunction)+'\n\n'+(it.localizationMap)+'\n\n'+(it.functionBlock)+'\n\n'+(it.moduleExportBlock)+'\n})();\n';return out;
};
  tmpl['LocalizationGetter']=function anonymous(it) {
var out='function l(key) {\n  if(!(key in localizations[\''+(it.language)+'\'])) {\n    throw new TypeError(\'Key `\' + key + \'` not in '+(it.language)+' localizations\');\n  }\n  return localizations[\''+(it.language)+'\'][key].call(localizations[\''+(it.language)+'\'], arguments[1]);\n}';return out;
};
  tmpl['LocalizationKeyValue']=function anonymous(it) {
var out='\''+(it.key)+'\': '+(it.value);return out;
};
  tmpl['LocalizationMap']=function anonymous(it) {
var out='\''+(it.language)+'\': {\n'+(it.map)+'\n}';return out;
};
  tmpl['LocalizationsMap']=function anonymous(it) {
var out='var localizations = {\n'+(it.localizations)+'\n};';return out;
};
  tmpl['ModuleExportBlock']=function anonymous(it) {
var out='if(typeof require === "function" && typeof exports === \'object\' && typeof module === \'object\') {\n  module.exports = '+(it.variableName)+';\n}\nelse if (typeof define === "function" && define.amd) {\n  define(function() {\n    return '+(it.variableName)+';\n  });\n}\nelse {\n  window.'+(it.variableName)+' = '+(it.variableName)+';\n}';return out;
};
  tmpl['NumberComparison']=function anonymous(it) {
var out=''+(it.variableName);if(it.modulus){out+=' % '+(it.modulus);}out+=' '+(it.comparator)+' '+(it.value);return out;
};
  tmpl['OrdinalSwitchStatement']=function anonymous(it) {
var out='var _case;\n'+(it.setCaseStatement)+'\nswitch(_case) {\n'+(it.switchBody)+'\n}';return out;
};
  tmpl['OtherCase']=function anonymous(it) {
var out='default:\n'+(it.caseBody)+'\n  break;';return out;
};
  tmpl['PluralSwitchStatement']=function anonymous(it) {
var out='var _case;\n'+(it.setCaseStatement)+'\nswitch(_case) {\n'+(it.switchBody)+'\n}';return out;
};
  tmpl['RangeCondition']=function anonymous(it) {
var out='else if(it.'+(it.variableName)+' '+(it.limits.lower.type)+' '+(it.limits.lower.value)+' && it.'+(it.variableName)+' '+(it.limits.upper.type)+' '+(it.limits.upper.value)+') {\n'+(it.body)+'\n}';return out;
};
  tmpl['RangeNumberComparison']=function anonymous(it) {
var out='('+(it.from)+' >= '+(it.variableName)+' && '+(it.variableName)+' <= '+(it.to)+')';return out;
};
  tmpl['Remaining']=function anonymous(it) {
var out='string += formatNumber({\n  number: it.'+(it.variableName)+' - '+(it.offset)+',\n  roundTo: '+(it.roundTo)+',\n  prefix: \''+(it.prefix)+'\',\n  suffix: \''+(it.suffix)+'\',\n  percentage: '+(it.percentage)+',\n  permille: '+(it.permille)+',';if(it.currency){out+='\n  currency: {\n    type: \''+(it.currency.type)+'\',\n    context: \''+(it.currency.symbol)+'\'\n  },';}else{out+='\n  currency: null,';}if(it.groupSize){out+='\n  groupSize: {\n    primary: '+(it.groupSize.primary)+',\n    secondary: '+(it.groupSize.secondary)+'\n  },';}else{out+='\n  groupSize: null,';}out+='\n  minimumIntegerDigits: '+(it.minimumIntegerDigits)+',\n  minimumFractionDigits: '+(it.minimumFractionDigits)+',\n  maximumFractionDigits: '+(it.maximumFractionDigits)+',\n  symbols: this.__numberSymbols[\''+(it.numberSystem)+'\']\n});';return out;
};
  tmpl['ReplaceDigitBlock']=function anonymous(it) {
var out=''+(it.variableName)+' = '+(it.variableName)+'\n  .replace(/1/g, \''+(it.digits['1'])+'\')\n  .replace(/2/g, \''+(it.digits['2'])+'\')\n  .replace(/3/g, \''+(it.digits['3'])+'\')\n  .replace(/4/g, \''+(it.digits['4'])+'\')\n  .replace(/5/g, \''+(it.digits['5'])+'\')\n  .replace(/6/g, \''+(it.digits['6'])+'\')\n  .replace(/7/g, \''+(it.digits['7'])+'\')\n  .replace(/8/g, \''+(it.digits['8'])+'\')\n  .replace(/9/g, \''+(it.digits['9'])+'\')\n  .replace(/0/g, \''+(it.digits['0'])+'\');';return out;
};
  tmpl['RequireLocalizations']=function anonymous(it) {
var out='function requireLocalizations(language) {\n  return (function(language) {\n    return function l(key) {\n      if(!(language in localizations)) {\n        return \'LANGUAGE_NOT_IN_LOCALIZATIONS: \' + language;\n      }\n      if(!(key in localizations[language])) {\n        return \'KEY_NOT_IN_LOCALIZATIONS: \' + key;\n      }\n      return localizations[language][key].call(localizations[language], arguments[1]);\n    };\n  })(language);\n};';return out;
};
  tmpl['ReturnOtherStringStatement']=function anonymous(it) {
var out='return \'other\';';return out;
};
  tmpl['RoundToFunction']=function anonymous(it) {
var out='function roundTo(number, to) {\n  return Math.round(number / to) * to;\n}';return out;
};
  tmpl['SelectSwitchStatement']=function anonymous(it) {
var out='switch(it.'+(it.variableName)+') {\n'+(it.switchBody)+'\n}';return out;
};
  tmpl['Sentence']=function anonymous(it) {
var out='string += \''+(it.sentence)+'\';';return out;
};
  tmpl['SetCurrencyUnitBlock']=function anonymous(it) {
var out='if(!this.__currencies) {\n  throw new TypeError(\'You must define your currencies in your configuration file l10ns.json. http://l10ns.org/docs.html#currencyformat\');\n}\nvar unit;\nif(it.'+(it.variableName)+'.amount && it.'+(it.variableName)+'.code) {\n  if(!this.__currencies[it.'+(it.variableName)+'.code]) {\n    throw new TypeError(\'Currency code \' + it.'+(it.variableName)+'.code + \' is not defined. Please define it on your l10ns.json file.\');\n  }';if(it.currency.type === 'text'){out+='\n  var pluralKeyword = this.__getPluralKeyword(it.'+(it.variableName)+'.amount);';if(it.currency.context === 'local'){out+='\n  if(this.__currencies[it.'+(it.variableName)+'.code][\'text\'][\'local\']) {\n    unit = this.__currencies[it.'+(it.variableName)+'.code][\'text\'][\'local\'][pluralKeyword];\n  }\n  else {\n    unit = this.__currencies[it.'+(it.variableName)+'.code][\'text\'][\'global\'][pluralKeyword];\n  }';}else{out+='\n  unit = this.__currencies[it.'+(it.variableName)+'.code][\'text\'][\'global\'][pluralKeyword];';}}else{out+='\n  unit = this.__currencies[it.'+(it.variableName)+'.code][\''+(it.currency.type)+'\'][\''+(it.currency.context)+'\'];';}out+='\n}\nelse {\n  throw TypeError(\'`'+(it.variableName)+'` must be an object that has properties amount and code.\');\n}';return out;
};
  tmpl['SetOrdinalCase']=function anonymous(it) {
var out='_case = this.__getOrdinalKeyword(it.'+(it.variableName)+');';return out;
};
  tmpl['SetOrdinalConditionCase']=function anonymous(it) {
var out=''+(it.statementType)+'(it.'+(it.variableName)+' === '+(it.value)+') {\n  _case = \'=\' + '+(it.value)+';\n}';return out;
};
  tmpl['SetOrdinalElseCase']=function anonymous(it) {
var out='else {\n  _case = this.__getOrdinalKeyword(it.'+(it.variableName)+');\n}';return out;
};
  tmpl['SetPluralCase']=function anonymous(it) {
var out='_case = this.__getPluralKeyword(it.'+(it.variableName)+');';return out;
};
  tmpl['SetPluralConditionCase']=function anonymous(it) {
var out=''+(it.statementType)+'(it.'+(it.variableName)+' === '+(it.value)+') {\n  _case = \'=\' + ('+(it.value)+');\n}';return out;
};
  tmpl['SetPluralElseCase']=function anonymous(it) {
var out='else {\n  _case = this.__getPluralKeyword(it.'+(it.variableName)+');\n}';return out;
};
  tmpl['Start']=function anonymous(it) {
var out='var string = \'\';';return out;
};
  tmpl['Variable']=function anonymous(it) {
var out='string += it.'+(it.variableName)+';';return out;
};
module.exports = tmpl;