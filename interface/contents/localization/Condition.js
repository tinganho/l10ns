
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var Model = inServer ? require('../../libraries/Model') : require('Model')
    , Operand = require('./ConditionOperand')
    , OperandView = require('./ConditionOperandView')
    , FirstOperand = Operand.extend()
    , LastOperand = Operand.extend();

  return Model.extend({

    /**
     * Initializer.
     *
     * @param {Object}
     * @return {void}
     * @api public
     */

    initialize : function(json) {
      this._parse(json);
    },

    /**
     * Parse raw data
     *
     * @returns {void}
     * @api private
     */

    _parse : function(json) {
      this.set('firstOperand', new FirstOperand({
        value : json.firstOperand,
        vars : json.vars,
        order : 'first',
        condition : this
      }));
      this.set('lastOperand', new LastOperand({
        value : json.lastOperand,
        vars : json.vars,
        order : 'last',
        condition : this
      }));
    },

    /**
     * Relations
     *
     * @type {Object}
     */

    relations : [{
      type: 'HasOne',
      key: 'firstOperand',
      relatedModel: FirstOperand,
      reverseRelation: {
        key: 'condition',
        includeInJSON: 'value'
      }
    },
    {
      type: 'HasOne',
      key: 'lastOperand',
      relatedModel: LastOperand,
      reverseRelation: {
        key: 'condition',
        includeInJSON: 'value'
      }
    }]
  });
});
