
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var Model = inServer ? require('../../libraries/Model') : require('Model')
    , Operand = require('./ConditionOperand')
    , FirstOperand = Operand.extend()
    , LastOperand = Operand.extend();

  var Constructor = Model.extend({

    /**
     * Relations
     *
     * @type {Object}
     */

    relations: [
      {
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
      }
    ],

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
     return [json.statement, json.firstOperand.value, json.operator, json.lastOperand.value];
    }
  });

  /**
   * Constructors
   */

  Constructor.prototype.FirstOperand = FirstOperand;
  Constructor.prototype.LastOperand = LastOperand;

  return Constructor;
});
