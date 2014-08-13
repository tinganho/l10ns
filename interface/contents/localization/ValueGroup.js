
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var Model = inServer ? require('../../libraries/Model') : require('Model')
    , Collection = inServer ? require('../../libraries/Collection') : require('Collection')
    , Input = require('./Input')
    , Else = require('./Else')
    , Condition = require('./Condition');

  var Conditions = Collection.extend({
    model: Condition,
    comparator: 'row'
  });

  var Constructor = Model.extend({

    /**
     * Relations
     *
     * @type {Array}
     */

    relations: [
      {
        type: 'HasMany',
        key: 'conditions',
        relatedModel: Condition,
        collectionType: Conditions,
        reverseRelation: {
          key: 'valueGroup',
          includeInJSON: 'id'
        }
      },
      {
        type: 'HasOne',
        key: 'input',
        relatedModel: Input,
        reverseRelation: {
          key: 'valueGroup',
          includeInJSON: 'id'
        }
      },
      {
        type: 'HasOne',
        key: 'else',
        relatedModel: Else,
        reverseRelation: {
          key: 'valueGroup',
          includeInJSON: 'id'
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
      var value = [];

      this.get('conditions').forEach(function(condition) {
        value = value.concat(condition.toL10nsJSON());
      });

      var _else = this.get('else');
      if(_else) {
        value = value.concat(['else']);
      }

      value = value.concat(this.get('input').toL10nsJSON());

      return value;
    }
  });

  /**
   * Constructors
   */

  Constructor.prototype.Condition = Condition;
  Constructor.prototype.Input = Input;
  Constructor.prototype.Else = Else;

  return Constructor;
});
