
/**
 * Module dependencies.
 */

var Log = require('./log').Constructor
  , log = require('./_log')
  , init = require('./init')
  , set = require('./set')
  , Search = require('./search')
  , update = require('./update')
  , findup = require('findup-sync')
  , _ = require('underscore')
  , path = require('path')
  , glob = require('glob')
  , utilities = require('../libraries/utilities')
  , fs = require('fs')
  , defer = require('q').defer;

/**
 * Initialize a new `GetTranslation`
 *
 * @constructor
 */

var CLI = function() {}

/**
 * Initialize CLI
 *
 * @return {Promise}
 * @resolve {void}
 * @api public
 */

CLI.prototype.initialize = function() {
  var _this = this, deferred = defer();

  this.requireProject()
    .then(function(project) {
      return _this._setDefaultProjectProperties(project);
    })
    .then(function(project) {
      global.project = project;
      global.language = require('../plugins/' + project.programmingLanguage + '/configurations');
      _this.compiler = new (require('../plugins/' + project.programmingLanguage + '/compiler').Constructor);
      _this.makeCacheDirectory();
      deferred.resolve();
    })
    .fail(function(error) {
      deferred.reject(error);
    });

  return deferred.promise;
};

/**
 * Require project configurations
 *
 * @return {Promise}
 * @resolves
 * @api public
 */

CLI.prototype.requireProject = function() {
  var deferred = defer()
    , l10nsPath = findup('l10ns.json')
    , configurations = require(l10nsPath)
    , projects = configurations.projects
    , defaultProject = configurations.defaultProject;

  _.defer(function() {
    if(commands.project) {
      if(typeof projects[commands.project] === 'undefined') {
        return deferred.reject(new TypeError('project ' + commands.project.yellow + ' is not defined.'));
      }

      deferred.resolve(projects[commands.project]);
    }
    else {
      if(typeof projects[defaultProject] === 'undefined') {
        return deferred.reject(new TypeError('Your default project is not defined.'));
      }

      deferred.resolve(projects[defaultProject]);
    }
  });

  return deferred.promise;
};

/**
 * Require project configurations
 *
 * @param {Object} project
 * @return {Promise}
 * @resolves
 * @api public
 */

CLI.prototype._setDefaultProjectProperties = function(project) {
  var root, deferred = defer()
    , l10nsPath = findup('l10ns.json');

  if(l10nsPath) {
    root = path.dirname(l10nsPath);
  }
  else {
    root = process.cwd();
  }

  var defaults = {
    port: program.DEFAULT_PORT,
    autoOpen: program.DEFAULT_AUTO_OPEN,
    root: root,
    cache: {
      folder: root + '/.l10ns',
      search: root + '/.l10ns/search.json'
    },
    function: {}
  };

  // Merge with programm configs
  project = _.defaults(project, defaults);

  if(typeof project.store === 'undefined') {
    project.store = path.join(project.root, program.DEFAULT_STORAGE_FOLDER);
  }
  else if(!/^\//.test(project.store) && !/^\w\:/.test(project.store)) {
    project.store = path.join(project.root, project.store);
  }
  if(process.argv.length >= 2 && process.argv[2] !== 'init' && process.argv[2] !== '--help' &&  process.argv[2] !== '-h') {
    project = this._setProjectSource(project);
  }

  deferred.resolve(project);

  return deferred.promise;
};

/**
 * Set project source
 *
 * @param {Object} project
 * @return {Object} project with source file property
 * @api private
 */

CLI.prototype._setProjectSource = function(project) {
  var source = [], _files, adds, removes;

  if(!project.source) {
    throw new TypeError('You must define your source files using a glob pattern in your l10ns.json file.');
  }

  for(var i = 0; i < project.source.length; i++) {
    if(project.source[i].substr(0, 1) !== '!') {
      adds = glob.sync(project.source[i], { cwd: project.root });
      source = source.concat(adds);
    } else {
      removes = glob.sync(project.source[i], { cwd: project.root });
      source = source.filter(function(file) {
        return removes.indexOf(file) === -1;
      });
    }
  }
  if(!source.length) {
    console.log('No files found. \n(Have you updated your l10ns.json to include your source file and ran `l10ns update` yet?)');
  }

  project.source = source;

  return project
};

/**
 * Make cache directory if it does not exists
 *
 * @return {void}
 * @api private
 */

CLI.prototype.makeCacheDirectory = function() {
  if(!fs.existsSync(project.cache.folder)) {
    fs.mkdirSync(project.cache.folder);
  }
}

/**
 * Initialize project
 *
 * @return {void}
 * @api public
 */

CLI.prototype.init = function() {
  init.run();
};

/**
 * Edit current translations
 *
 * @param {String} key
 * @param {String} value
 * @param {String} locale
 * @return {void}
 * @api public
 */

CLI.prototype.set = function(key, value, locale) {
  set.run(key, value, locale);
};

/**
 * Update source keys
 *
 * @return {void}
 * @api public
 */

CLI.prototype.update = function() {
  update.run();
};

/**
 * Get new Search object
 *
 * @return {void}
 * @api public
 */

CLI.prototype.log = function(locale, type) {
  var log = new Log();
  return log.run(locale, type);
};

/**
 * Get new Search object
 *
 * @return {void}
 * @api public
 */

CLI.prototype.search = function(q) {
  var search = new Search();
  search.readLocalizations()
    .then(function() {
      search.queryOutput(q);
    })
    .fail(function(error) {
      if(commands.stack && error) {
        console.log(error.stack);
      }

      log.error('Could not search');
    });
};

/**
 * Compile language
 *
 * @return {void}
 * @api public
 */

CLI.prototype.compile = function() {
  this.compiler.run();
};

/**
 * Export gt instance
 */

module.exports = new CLI;
