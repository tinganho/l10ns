
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var Model = require('./Model');

  return Model.extend({
    initialize : function() {
      this.set('title', document.querySelector('title').innerHMTL);
      this.set('description', document.querySelector('meta[name=description]').getAttribute('content'));
    }
  });
});
