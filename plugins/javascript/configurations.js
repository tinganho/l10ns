
module.exports = {

  /**
   * Get localization string function name. Plugins might use this configuration
   * to alter the behavior of updating keys and compiling.
   *
   * @value {String}
   */

  GET_LOCALIZATION_STRING_FUNCTION_NAME: 'l',

  /**
   * Get localization string using variables function name. Plugins might use this
   * configuration to alter the behavior of updating keys and compiling.
   *
   * @value {String}
   */

  GET_LOCALIZATION_STRING_USING_VARIABLES_FUNCTION_NAME: 'l',

  /**
   * Translation inner function call regex should match
   * any inner function of gt(). Innner functions can be
   * used in setting some translation vars. We need to
   * remove these function calls, because they will cause
   * issues with parsing the translation function calls.
   *
   * Example match (double hard brackets mean match):
   *
   * gt('SOME_TRANSLATION_KEY', {
   *   'test': [[test()]]
   * });
   *
   * @value {RegExp}
   */

  GET_LOCALIZATION_INNER_FUNCTION_CALL_SYNTAX: /\s+(?!l)[.|\w]+?\((.*?\s*?)*?\)/g,

  /** Translation vars regex should capture a match
   * of the whole translation var object literal in
   * the first index of the whole translation function
   * call string.
   *
   * Example match (double hard brackets mean match):
   *
   * [[l('SOME_TRANSLATION_KEY', {
   *   'test': 'test'
   * });]]
   *
   * @value {RegExp}
   */

  GET_LOCALIZATION_FUNCTION_CALL_SYNTAX: /\s+l\(['|"](.*?)['|"]\s*(\,\s*\{\s*((.*?)|(\s*?))+?\s*\})??\s*\)/g,

  /**
   * Translation key regex should capture a match
   * of the translation key in the second index
   * of the whole translation function call string.
   *
   * Example match (double hard brackets mean match):
   *
   * l([['SOME_TRANSLATION_KEY']], {
   *   'test': 'test'
   * });
   *
   * @value {RegExp}
   */

  LOCALIZATION_KEY_SYNTAX: /\s+l\((['|"])(.*?)\1/,

  /**
   * Translation vars regex should capture a match
   * of the whole translation var object literal in
   * the first index of the whole translation function
   * call string. It should also match multiline
   * variable map.
   *
   * Example match (double hard brackets mean match):
   *
   * l('SOME_TRANSLATION_KEY', [[{
   *   'test': 'test'
   * }]]);
   *
   * @value {RegExp}
   */

  LOCALIZATION_VARIABLES_SYNTAX: /(\{(.|\s)*?\})/g,

  /**
   * Translation var regex should capture a match
   * of one line of the translation var key including
   * colon sign of the whole translation vars string.
   *
   * Example match (double hard brackets mean match):
   *
   * {
   *   [['test1':]] 'test',
   *   [['test2':]] 'test',
   * };
   *
   * @value {RegExp}
   */

  LOCALIZATION_VARIABLE_SYNTAX: /\s*(['|"])?\w+\1?\s*\:/g
};
