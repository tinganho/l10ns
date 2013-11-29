
/**
 * Program configs
 */

module.exports = {

  // Folders
  LOCALES_FOLDER : 'locales',

  // Files
  DELETE_LOG_FILE     : '/delete.log',
  LATEST_SEARCH_CACHE : '/cache/latestSearch.json',

  // Gt log length
  LOG_LENGTH : 10,

  // Default values
  DEFAULT_SRC                  : ['**/*'],
  DEFAULT_TRANSLATION_FUNCTION : 'gt',
  DEFAULT_REQUIREJS            : true,
  DEFAULT_FOLDER               : 'translations',
  DEFAULT_OUTPUT               : '/output',
  DEFAULT_PORT                 : 3001,
  DEFAULT_AUTO_OPEN            : true,

  NO_TRANSLATION : 'NO TRANSLATION',

  TRANSLATION_ID_HASH_SECRET : 'gt',
  TRANSLATION_ID_CHAR_LENGTH : 8,

  DEFAULT_PROGAMMING_LANGAUGE : 'javascript',

  // Syntaxes
  SYNTAX_OPERAND  : /^\$?\w+$/,
  SYNTAX_VARIABLE : /^$[a-zA-Z0-9]+$/,

  // conditions
  CONDITIONS : ['if', 'else', 'elseif'],
  CONDITION_IF     : 'if',
  CONDITION_ELSE   : 'else',
  CONDITION_ELSEIF : 'elseif',

  ADDITIONAL_CONDITIONS : ['&&', '||'],
  ADDITIONAL_CONDITION_AND : '&&',
  ADDITIONAL_CONDITION_OR  : '||',

  OPERATORS : ['<', '<=', '==', '===', '>', '>=']


};


