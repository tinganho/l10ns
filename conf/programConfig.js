
/**
 * Expose config
 */

module.exports = conf;

/**
 * Program configs
 */

var conf = {

  LOCALES_FOLDER : '/locales',
  
  DELETE_LOG : '/delete.log',

  LATEST_SEARCH_CACHE : '/cache/latestSearch.json',

  // Gt log length
  LOG_LENGTH : 10,

  // Default values
  DEFAULT_SRC                  : ['**/*'],
  DEFAULT_TRANSLATION_FUNCTION : 'gt',
  DEFAULT_REQUIREJS            : true,
  DEFAULT_FOLDER               : './translations',
  DEFAULT_OUTPUT               : '/output',
  DEFAULT_PORT                 : 3001,
  DEFAULT_AUTO_OPEN            : true,

  OPERATORS : ['<', '>', '===', '>==', '<==', '==', '>=', '<=']

};



