
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
      this._bindComponents()
      this._bindModels();
    },

    /**
     * Initialize components and bind them.
     *
     * @return {void}
     * @api private
     */

    _bindComponents : function() {
      this.firstOperand = new Operand({ value : this.get('firstOperand'), vars : this.get('vars'), row : this.get('row'), order : 'first' });
      this.firstOperandView = new OperandView(this.firstOperand);
      this.lastOperand = new Operand({ value : this.get('lastOperand'), vars : this.get('vars'), row : this.get('row'), order : 'last' });
      this.lastOperandView = new OperandView(this.lastOperand);
    },

    /**
     * Bind models
     *
     * @return {void}
     * @api private
     */

    _bindModels : function() {
      var _this = this;

      this.firstOperand.on('change:value', function() {
        _this.set('firstOperand', _this.firstOperand.get('value'));
      });

      this.lastOperand.on('change:value', function() {
        _this.set('lastOperand', _this.lastOperand.get('value'));
      });
    }
  });
});
