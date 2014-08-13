
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var Model = inServer ? require('../../libraries/Model') : require('Model');

  return Model.extend({
    defaults: {
      key: null,
      value: [],
      variables: [],
      text: '',
      timestamp: null,
      new: false
    }
  });
});
