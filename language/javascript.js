
module.exports = {
  FUNCTION_CALL_REGEX        : /gt\(['|"](.*)['|"]\s*(\,\s*\{\s*((.*?)|(\s*?))+?\s*\})??\s*\)/g,
  INNER_FUNCTION_CALL_REGEX  : /\s+(?!gt)[.|\w]+?\((.*?\s*?)*?\)/g
};