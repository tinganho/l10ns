
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var Model = inServer ? require('../../libraries/Model') : require('Model');

  return Model.extend({

    /**
     * Sync
     *
     * @delegate
     */

    sync : function(method, model, options, request) {
      if(method === 'read') {
        if(inServer) {
          this.set('locale', request.param('locale'));
        }

        options.success();
      }
    }
  });
});
