
/**
 * Program configurations
 */

module.exports = {

  /**
   * Specify name of this tool
   *
   * @value {String}
   */

  NAME: 'l10ns',

  /**
   * Default output folder
   *
   * @value {String} The output folder could either be absolute or relative to
   * the project root path.
   */

  DEFAULT_OUTPUT_FOLDER: 'output',

  /**
   * Default port used for the translation interface.
   *
   * @value {Number}
   */

  DEFAULT_PORT: 3001,

  /**
   * Default behavior for the translation interface. Specify if it should auto
   * open from your terminal or not.
   *
   * @value {Boolean}
   */

  DEFAULT_AUTO_OPEN: true,

  /**
   * Default locale code for uninitialized projects.
   *
   * @value {String}
   */

  DEFAULT_LOCALE_CODE: 'en-US',

  /**
   * Default locale name for uninitialized projects.
   *
   * @value {String}
   */

  DEFAULT_LOCALE_NAME: 'English (US)',

  /**
   * Default programming language for uninitialized projects.
   *
   * @value {String}
   */

  DEFAULT_PROGAMMING_LANGUAGE: 'javascript',

  /**
   * Specify default storage folder for uninitialized projects.
   *
   * @value {String}
   */

  DEFAULT_STORAGE_FOLDER: 'localizations/',

  /**
   * Default configurations for uninitialized projects.
   *
   * @value {String} Set the value as an JSON docoument specified in l10ns
   */

  DEFAULT_CONFIGURATIONS: {
    interface: {
      autoOpen: true,
      port: 3001
    }
  },

  /**
   * Specify default quiet behavior.
   *
   * @value {Boolean}
   */

  DEFAULT_QUIET: false,

  /**
   * Default source map for every programming language.
   *
   * @value {Object} a map with key a programming language
   * and value an array of glob file patterns
   */

  DEFAULT_SOURCE_MAP: {
    'javascript': []
  },

  /**
   * Hash secret used for each localization's ID.
   *
   * @value {String}
   */

  LOCALIZATION_ID_HASH_SECRET: 'l10ns',

  /**
   * Character length used for each localization's ID.
   *
   * @value {String}
   */

  LOCALIZATION_ID_CHARACTER_LENGTH: 8,

  /**
   * Define variable markup should be used. Variable markup is a markup defined
   * in the value string.
   *
   * @value {RegExp}
   */

  SYNTAX_VARIABLE_MARKUP: /\$\{[a-zA-Z0-9]+\}/g,

  /**
   * Specify string used for `if` statement.
   *
   * @value {String}
   */

  CONDITION_IF: 'if',

  /**
   * Specify string used for `else if` statement.
   *
   * @value {String}
   */

  CONDITION_ELSEIF: 'else if',

  /**
   * Specify string used for `else` statement.
   *
   * @value {String}
   */

  CONDITION_ELSE: 'else',

  /**
   * Specify string used for `and` operator.
   *
   * @value {String}
   */

  ADDITIONAL_CONDITION_AND: '&&',

  /**
   * Specify string used for `or` operator.
   *
   * @value {String}
   */

  ADDITIONAL_CONDITION_OR : '||',

  /**
   * Specify operators used in l10ns.
   *
   * @value {Array}
   */

  OPERATORS: ['<', '<=', '==', '===', '>', '>=', 'lci'],

  /**
   * Specify supported programming languages
   *
   * @value {Array} programming languages
   */

  PROGRAMMING_LANGUAGUES: ['javascript'],

  /**
   * Specify locales syntax. This configuration is used by Init class.
   * To check if a certain given option is valid or not.
   *
   * @value {Array} programming languages
   */

  LOCALES_SYNTAX: /([\w\-]+:[\(\)\w\-\s]+,?)+/,

  /**
   * Default log length for logs outputted in the terminal.
   *
   * @value {Number}
   */

  DEFAULT_LOG_LENGTH: 10,

  /**
   * Project name syntax
   *
   * @value {RegExp}
   */

  PROJECT_NAME_SYNTAX: /^[\w+-\.\/\\\?]+$/
};
