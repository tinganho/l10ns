
var

/**
 * Get localization string function name. Plugins might use this configuration
 * to alter the behavior of updating keys and compiling.
 *
 * @value {String}
 */

GET_LOCALIZATION_STRING_FUNCTION_NAME = project.function.name || 'l',

/**
 * Get localization string using variables function name. Plugins might use this
 * configuration to alter the behavior of updating keys and compiling.
 *
 * @value {String}
 */

GET_LOCALIZATION_STRING_USING_VARIABLES_FUNCTION_NAME = project.function.nameUsingData || 'l';

module.exports = {

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

  GET_LOCALIZATION_INNER_FUNCTION_CALL_SYNTAX: new RegExp('(\\w+\\(.*?\\))', 'g'),

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

  GET_LOCALIZATION_FUNCTION_CALL_SYNTAX: new RegExp('\\{{2,3}\\s((' + GET_LOCALIZATION_STRING_FUNCTION_NAME +
    '|' +
    GET_LOCALIZATION_STRING_USING_VARIABLES_FUNCTION_NAME + ')(.*))\\s\\}{2,3}', 'g'),

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

  LOCALIZATION_KEY_SYNTAX: new RegExp('\\{{2,3}\\s(' + GET_LOCALIZATION_STRING_FUNCTION_NAME +
    '|' +
    GET_LOCALIZATION_STRING_USING_VARIABLES_FUNCTION_NAME + ')\\s(\'|")(\\w+)?\\2.*\\}{2,3}'),

  /**
   * Translation variables regex should capture a match
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

  LOCALIZATION_VARIABLES_SYNTAX: /(\w+\=.*?)\s\}{2,3}/g,

  /**
   * Translation variable name syntax. Captures the name
   * of a variable. Given that the map key string is only
   * provided.
   *
   * Example match (double hard brackets mean match):
   *
   * l('SOME_TRANSLATION_KEY', {
   *   'plural [[test]]': 'test'
   * });
   *
   * @value {RegExp}
   */

  LOCALIZATION_VARIABLE_NAME_SYNTAX: /(\w+)("|')?\=$/g,

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

  LOCALIZATION_VARIABLE_SYNTAX: /\s*('|")?\w+\1?\s*\=/g,

  /**
   * Imports of local variables
   */

  GET_LOCALIZATION_STRING_FUNCTION_NAME: GET_LOCALIZATION_STRING_FUNCTION_NAME,
  GET_LOCALIZATION_STRING_USING_VARIABLES_FUNCTION_NAME: GET_LOCALIZATION_STRING_USING_VARIABLES_FUNCTION_NAME
};
