
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var Model = inServer ? require('../../libraries/Model') : require('Model');

  return Model.extend({
    defaults : {
      key : null,
      value : [],
      vars : [],
      text : '',
      timestamp : null,
      _new : false
    }
  });
});
