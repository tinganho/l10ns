
/**
 * Add terminal colors
 */

require('terminal-colors');

/**
 * Text configurations
 */

module.exports = {

  /**
   * Specify CLI's init's introduction text.
   *
   * @value {String}
   */

  INIT_INTRODUCTION:
  'This utility will walk you through creating a get-transltion project.\n' +
  'It only covers the most common items, and tries to guess sane defaults.\n' +
  '\n' +
  'Press ^C at any time to quit.\n\n',

  /**
   * Specify text that is being outputted whenever a storage folder is invalid
   * in CLI's init command.
   *
   * @value {String}
   */

  DEFAULT_STORAGE_FOLDER_WRONG_ANSWER: '\nFailed to resolve path. Please try again.\n',

  /**
   * Specify text for storage folder question in CLI's init command.
   *
   * @value {String}
   */

  DEFAULT_STORAGE_FOLDER_QUESTION:
  '\nAll translations will be compiled to a single folder.\n' +
  'Please specify which folder you want them to be compiled to.\n\n',

  /**
   * Specify text to be outputted for projects that has already
   * been initialized.
   *
   * @value {String}
   */

  PROJECT_ALREADY_INITIATED: 'Project already initiated',

  /**
   * Specify text for default locale question in CLI's init command.
   *
   * @value {String}
   */

  DEFAULT_LOCALE_QUESTION: '\nPlease choose your default locale:\n',

  /**
   * Specify text for wrong option in default locale question
   * in CLI's init command.
   *
   * @value {String}
   */

  DEFAULT_LOCALE_WRONG_ANSWER: '\nYour option didn\'t match any of the locales you provided.\n'.red,

  /**
   * Specify text for choosing programming language question in CLI's
   * init command.
   *
   * @value {String}
   */

  CHOOSE_PROGRAMMING_LANGUAGE_QUESTION: 'Choose one of the following programming languagues:\n',

  /**
   * Specify text for wrong option in choosing programming language
   * question in CLI's init command.
   *
   * @value {String}
   */

  CHOOSE_PROGRAMMING_LANGUAGE_WRONG_ANSWER: '\nUnrecognized programming language. Please try again.'.red + '\n\n',

  /**
   * Specify text for locales question in CLI's init command.
   *
   * @value {String}
   */

  LOCALES_DESCRIPTION:
  'Please add at least one locale to your project.\n' +
  'The syntax should be a comma separated list of ' + 'LOCALE_CODE:LOCALE_NAME'.yellow + '\nformated strings.\n' +
  '\n' +
  '  Example:\n' +
  '\n' +
  '    en-US:English,zh-CN:Chinese\n\n',

  /**
   * Specify text  for wrong option in locales question in CLI's init command.
   *
   * @value {String}
   */

  LOCALES_WRONG_ANSWER: '\nUnrecognized string. Please add your locales again.'.red + '\n\n',

  /**
   * Specify text for empty localization values.
   *
   * @value {String}
   */

  NO_TRANSLATION: 'NO TRANSLATION'
}
