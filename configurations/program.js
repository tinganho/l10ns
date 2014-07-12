
/**
 * Add terminal colors
 */

require('terminal-colors');

/**
 * Program configs
 */

module.exports = {

  // Folders
  LOCALES_FOLDER: 'locales',

  // Files
  DELETE_LOG_FILE    : '/delete.log',
  LATEST_SEARCH_CACHE: '/cache/latestSearch.json',

  // Gt log length
  LOG_LENGTH: 10,

  // Default values
  DEFAULT_TRANSLATION_FUNCTION: 'gt',
  DEFAULT_REQUIREJS: true,
  DEFAULT_FOLDER: 'translations',
  DEFAULT_OUTPUT: 'output',
  DEFAULT_POR: 3001,
  DEFAULT_AUTO_OPEN: true,
  DEFAULT_QUIET: false,

  NO_TRANSLATION: 'NO TRANSLATION',

  TRANSLATION_ID_HASH_SECRET: 'gt',
  TRANSLATION_ID_CHAR_LENGTH: 8,

  DEFAULT_PROGAMMING_LANGUAGE: 'javascript',

  // Syntaxes
  SYNTAX_OPERAND: /^(it\.)?\w+$/,
  SYNTAX_VARIABLE: /^[a-zA-Z][a-zA-Z0-9]+$/,
  SYNTAX_VARIABLE_MARKUP: /\$\{[a-zA-Z0-9]+\}/g,

  // conditions
  CONDITIONS: ['if', 'else', 'else if'],
  CONDITION_IF    : 'if',
  CONDITION_ELSE  : 'else',
  CONDITION_ELSEIF: 'else if',

  ADDITIONAL_CONDITIONS: ['&&', '||'],
  ADDITIONAL_CONDITION_AND: '&&',
  ADDITIONAL_CONDITION_OR : '||',

  OPERATORS: ['<', '<=', '==', '===', '>', '>=', 'lni'],

  INIT_INTRO:
  'This utility will walk you through creating a get-transltion project.\n' +
  'It only covers the most common items, and tries to guess sane defaults.\n' +
  '\n' +
  'Press ^C at any time to quit.\n\n',

  LOCALES_DESCRIPTION:
  'Please add at least one locale to your project.\n' +
  'The syntax should be a comma separated list of ' + 'LOCALE_CODE:LOCALE_NAME'.yellow + '\nformated strings.\n' +
  '\n' +
  '  Example:\n' +
  '\n' +
  '    en-US:English,zh-CN:Chinese\n\n',

  LOCALES_WRONG_ANSWER: '\nUnrecognized string. Please add your locales again.'.red + '\n\n',

  LOCALES_SYNTAX: /([\w\-]+:[\(\)\w\-\s]+,?)+/,

  DEFAULT_LOCALE_CODE: 'en-US',
  DEFAULT_LOCALE_NAME: 'English (US)',

  DEFAULT_LOCALE_QUESTION: '\nPlease choose your default locale:\n',

  DEFAULT_LOCALE_WRONG_ANSWER: '\nYour option didn\'t match any of the locales you provided.\n'.red,

  PROGRAMMING_LANGUAGUES: ['javascript'],

  CHOOSE_PROGRAMMING_LANGUAGE_PROMPT: 'Choose one of the following programming languagues:\n',
  CHOOSE_PROGRAMMING_LANGUAGE_WRONG_ANSWER: '\nUnrecognized programming language. Please try again.'.red + '\n\n',

  PROGRAMMING_LANGUAGUE_TO_DEFAULT_SRC_MAP: {
    'javascript': []
  },

  DEFAULT_CONFIGS: {
    interface: {
      autoOpen: true,
      port: 3001
    }
  },

  DEFAULT_OUTPUT_FOLDER_PROMPT:
  '\nAll translations will be compiled to a single folder.\n' +
  'Please specify which folder you want them to be compiled to.\n\n',

  DEFAULT_OUTPUT_FOLDER: 'localizations/',

  DEFAULT_OUTPUT_FOLDER_WRONG_ANSWER: '\nFailed to resolve path. Please try again.\n',

  PROJECT_ALREADY_INITIATED: 'Project already initiated'
};
