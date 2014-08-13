
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var Model = inServer ? require('../../libraries/Model') : require('Model');

  return Model.extend({

    /**
     * To l10ns JSON
     *
     * @extends toJSON
     * @return {Array}
     *
     *   Example:
     *
     *     ['if', '${variable1}', '===', '1']
     *
     * @api public
     */

    toL10nsJSON: function() {
     var json = Model.prototype.toJSON.call(this);
     return [json.value];
    }
  });
});
