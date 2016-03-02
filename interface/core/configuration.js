
/**
 * Module dependencies
 */

var fs = require('fs')
  , path = require('path')
  , glob = require('glob');

/**
 * Config
 *
 * @constructor
 */

function Config() {
  if(!ENV) {
    throw new TypeError('global variable ENV is not set');
  }

  this.env = ENV;
  this.envPrefixRegExp = /^DEV__|^STAG__|^PROD__/;
  this.envRegExp = /^([A-Z]{3,4})__/;
}

/**
 * Format configs. Formatting removes DEV__, DIST__ and PROD__
 * prefixes.
 *
 * @param {Object} configs
 * @return {Object}
 * @api public
 */

Config.prototype.formatConfigurations = function(configs) {
  if(typeof configs !== 'object') {
    throw new TypeError('first parameter must be of type object');
  }
  for(var key in configs) {
    if(this.envPrefixRegExp.test(key)) {
      var env = this.envRegExp.exec(key)[1]
        , _key = key.replace(this.envRegExp, '');
      if(env === this.env) {
        configs[_key] = configs[key];
      }
      delete configs[key];
    }
  }

  return configs;
};

/**
 * Merge external configs from a JSON file defined
 * in environmental variable GLOBAL_CORE_CONF
 *
 * @param {Object} configs
 * @return {Object}
 * @api public
 */

Config.prototype.mergeExternalConfigurations = function(configurations) {
  if(typeof configurations !== 'object') {
    throw new TypeError('first parameter must be of type object');
  }
  if(fs.existsSync(process.env.EXTERNAL_CORE_CONFIGURATIONS)) {
    var globalConfig = require(process.env.EXTERNAL_CORE_CONFIGURATIONS);
    for(var key in globalConfig) {
      delete configurations[key];
      configurations[key] = globalConfig[key];
    }
  }

  return configurations;
};

/**
 * User sets configurations in their page manifests. They use names instead of aliases
 * to set the configurations. We need a way to map the names to aliases.
 *
 * @return {void}
 * @api public
 */

Config.prototype.setClientConfigurationMappings = function() {
  var files = glob.sync(cf.CLIENT_CONFIGURATIONS_GLOB, { cwd : cf.ROOT_FOLDER });
  for(var i = 0; i < files.length; i++) {
    var configurations = require(cf.ROOT_FOLDER + files[i])
      , name = path.basename(files[i], '.js');
     // Set name to alias mapping
    cf.CLIENT_CONFIGURATIONS_MAP[name] = configurations.NAME_SPACE;
  }
};

/**
 * We write the configurations from a folder that has configuration files
 * written in Node to a public folder, so your client can access these
 * configurations.
 *
 * @return {void}
 * @api public
 */

Config.prototype.writeClientConfigurations = function() {
  var configurationPath = cf.ROOT_FOLDER + cf.CLIENT_CONFIGURATIONS_BUILD;
  if(!fs.existsSync(path.dirname(configurationPath))) {
    fs.mkdirSync(path.dirname(configurationPath));
  }
  var files = glob.sync(cf.CLIENT_CONFIGURATIONS_BUILD + '/*.js', { cwd : cf.ROOT_FOLDER });
  files.forEach(function(file) {
    fs.unlinkSync(cf.ROOT_FOLDER + file);
  });

  glob(cf.CLIENT_CONFIGURATIONS_GLOB, { cwd : cf.ROOT_FOLDER }, function(err, matches) {
    for(var i = 0; i < matches.length; i++) {
      var configurations = require(cf.ROOT_FOLDER + matches[i]);

      var startWrap  = 'window.' + configurations.NAME_SPACE + ' = (function() { var configs = '
        , body       = JSON.stringify(configurations, null, 2) + ';'
        , makeRegExp = 'for(var key in configs) { if(/REGEX/.test(key)) { configs[key] = new RegExp(configs[key]); } }'
        , endWrap    = 'return configs; })();';

      var str = startWrap + body + makeRegExp + endWrap;
      var clientConfigurationFile = cf.ROOT_FOLDER + cf.CLIENT_CONFIGURATIONS_BUILD + '/' + configurations.NAME_SPACE + '.js';
      if (!fs.existsSync(path.dirname(clientConfigurationFile))) {
        fs.mkdirSync(path.dirname(clientConfigurationFile));
      }
      fs.writeFileSync(clientConfigurationFile, str);
    }
  });
};

/**
 * Export `config` instance
 */

module.exports = new Config;
