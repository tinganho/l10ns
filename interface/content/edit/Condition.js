
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var Model = require('Model')
    , Operand = require('./Operand')
    , OperandView = require('./OperandView');

  return Model.extend({

    /**
     * Initializer.
     *
     * @param {Object}
     * @return {void}
     * @api public
     */

    initialize : function(json) {
      this.set(json);
      this.bindComponents();
    },

    /**
     * Initialize components and bind them.
     *
     * @return {this}
     * @api public
     */

    bindComponents : function() {
      this.operand1 = new Operand({ value : this.get('operand1'), row : this.get('row'), order : 'first' });
      this.operand1View = new OperandView(this.operand1);

      return this;
    }
  });
});
