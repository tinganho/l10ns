
/**
 * Expose config
 */

module.exports = conf;

/**
 * Program configs
 */

var conf = {

  // Folders
  LOCALES_FOLDER : '/locales',

  // Files
  DELETE_LOG_FILE : '/delete.log',
  LATEST_SEARCH_CACHE_FILE : '/cache/latestSearch.json',

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

  OPERATORS : ['<', '>', '===', '>==', '<==', '==', '>=', '<='],

  NO_TRANSLATION : 'NO TRANSLATION'

};



