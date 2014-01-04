
module.exports = {

  // Translation inner function call regex should match
  // any inner function of gt(). Innner functions can be
  // used in setting some translation vars. We need to
  // remove these function calls, because they will cause
  // issues with parsing the translation function calls.
  //
  // Example match (double hard brackets mean match):
  //
  // gt('SOME_TRANSLATION_KEY', {
  //   'test' : [[test()]]
  // });
  //
  TRANSLATION_INNER_FUNCTION_CALL_REGEX : /\s+(?!gt)[.|\w]+?\((.*?\s*?)*?\)/g,

  // Translation vars regex should capture a match
  // of the whole translation var object literal in
  // the first index of the whole translation function
  // call string.
  //
  // Example match (double hard brackets mean match):
  //
  // [[gt('SOME_TRANSLATION_KEY', {
  //   'test' : 'test'
  // });]]
  //
  TRANSLATION_FUNCTION_CALL_REGEX : /gt\(['|"](.*)['|"]\s*(\,\s*\{\s*((.*?)|(\s*?))+?\s*\})??\s*\)/g,

  // Translation key regex should capture a match
  // of the translation key in the second index
  // of the whole translation function call string.
  //
  // Example match (double hard brackets mean match):
  //
  // gt([['SOME_TRANSLATION_KEY']], {
  //   'test' : 'test'
  // });
  //
  TRANSLATION_KEY : /gt\((['|"])(.*?)\1/,

  // Translation vars regex should capture a match
  // of the whole translation var object literal in
  // the first index of the whole translation function
  // call string. It should also match multiline
  // variable map.
  //
  // Example match (double hard brackets mean match):
  //
  // gt('SOME_TRANSLATION_KEY', [[{
  //   'test' : 'test'
  // }]]);
  //
  TRANSLATION_VARS : /(\{(.|\s)*?\})/g,

  // Translation var regex should capture a match
  // of one line of the translation var key including
  // colon sign of the whole translation vars string.
  //
  // Example match (double hard brackets mean match):
  //
  // {
  //   [['test' :]] 'test'
  // };
  //
  TRANSLATION_VAR : /\s*(\w+)\s*\:/g
};
