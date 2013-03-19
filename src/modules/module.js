

var path        = require('path'),
    fs          = require('fs'),
    OPERATORS   = require('../lib/operators'),
    E           = require('../lib/errors');

/**
 * @name Module
 * @class Module
 * @constructor
 */
var Module = function() {
  this.fs = fs;
  this.path = path;
};

/**
 * Get operator
 * @name Module#getOperator
 * @function
 *
 * @param {String} op
 */
Module.prototype.getOperator = function(op){
  return OPERATORS[op];
};

/**
 * Throw error
 * @name Module#throwError
 * @function
 *
 * @param {String} err
 */
Module.prototype.throwError = function(err){
  return new E[err].apply(this, arguments);
};

module.exports = Module;
