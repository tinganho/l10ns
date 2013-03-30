if( typeof define !== 'function' ) {
  var define = require( 'amdefine' )( module );
}

define(function() {
  var E = {};

  // Functions
  E.NotAFunctionError = function(message) {
    this.name = 'NotAFunctionError';
    this.message = (message || 'You need to provide a function');
  };
  E.NotAFunctionError.prototype = Error.prototype;

  E.AbscentOfParameterError = function(message) {
    this.name = 'AbscentOfParameterError';
    this.message = (message || 'No parameter in constructor');
  };
  E.AbscentOfParameterError.prototype = Error.prototype;

  E.WrongTypeInParameterError = function(expectedType, gotType) {
    this.name = 'WrongTypeInParameterError';
    this.message = 'Expected type: ' + expectedType + ' Got: ' + typeof expectedType;
  };
  E.WrongTypeInParameterError.prototype = Error.prototype;


  // JSON
  E.WrongJSONFormatError = function(message) {
    this.name = 'WrongJSONFormatError';
    this.message = (message || 'Wrong syntax in your JSON');
  };
  E.WrongJSONFormatError.prototype = Error.prototype;

  E.WronJSONResponseError = function(message) {
    this.name = 'WrongJSONResponseError';
    this.message = (message || 'Your JSON response have some abscent properties');
  };
  E.WronJSONResponseError.prototype = Error.prototype;

  // Object
  E.NotAnObjectLiteralError = function(message) {
    this.name = 'NotAnObjectLiteralError';
    this.message = (message || 'Your solution doesn\'t contain an object literal');
  };
  E.NotAnObjectLiteralError.prototype = Error.prototype;

  E.SetPropertyError = function(message) {
    this.name = 'SetPropertyError';
    this.message = (message || 'You can not set this property');
  };
  E.SetPropertyError.prototype = Error.prototype;


  // HTTP
  E.HTTPResponseError = function(res) {
    this.name = 'HTTPResponseError';
    this.message = 'HTTP response error: ' + res;
  };
  E.HTTPResponseError.prototype = Error.prototype;

  return E;
});
