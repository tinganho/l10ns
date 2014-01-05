
/**
 * Module dependencies
 */

var sinon        = require('sinon')
  , _            = require('underscore')
  , path         = require('path')
  , expect       = require('chai').expect
  , proxyquire   = require('proxyquire')
  , jsonFixtures = require('./fixtures/json')
  , fixtures     = require('./fixtures/update');

var Syntax = require('../lib/syntax').Syntax;