
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var Model = inServer ? require('../../lib/Model') : require('Model');

  return Model.extend({

  });
});
