
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}
if(inServer) {
  var file = require('../../../libraries/file');
}

define(function(require) {
  var Backbone
    , Model = inServer ? require('../../libraries/Model'): require('Model')
    , Collection = inServer ? require('../../libraries/Collection'): require('Collection')
    , _ = require('underscore')
    , Condition = require('./Condition')
    , Input = require('./Input')
    , Else = require('./Else');

  if(inClient) {
    Backbone = require('backbone');
    var request = require('request')
  }
  else {
    Backbone = require('backbone-relational');
  }

  var Conditions = Collection.extend({
    model: Condition,
    comparator: 'row'
  });

  var Inputs = Collection.extend({
    model: Input,
    comparator: 'row'
  });

  var Constructor = Model.extend({

    /**
     * Relations
     *
     * @type {Object}
     */

    relations: [{
      type: 'HasMany',
      key: 'conditions',
      relatedModel: Condition,
      collectionType: Conditions,
      reverseRelation: {
        key: 'localization',
        includeInJSON: 'id'
      }
    },
    {
      type: 'HasOne',
      key: 'else',
      relatedModel: Else,
      reverseRelation: {
        key: 'localization',
        includeInJSON: 'id'
      }
    },
    {
      type: 'HasMany',
      key: 'inputs',
      relatedModel: Input,
      collectionType: Inputs,
      reverseRelation: {
        key: 'localization',
        includeInJSON: 'id'
      }
    }],

    /**
     * Parse values(conditions and inputs)
     *
     * @param {Array.<value>} values
     * @return {void}
     * @api private
     */

    _parseValues: function(values, vars) {
      if(values.length <= 1) {
        return new Input({
          value: values.length ? values[0]: '',
          row: 0,
          localization: this
        });
      }
      var row = 0;
      for(var i = 0; i<values.length; i++) {
        if(values[i].length > 2) {
          var y = 0;
          while(typeof values[i][y] !== 'undefined') {
            new Condition({
              statement: values[i][y],
              firstOperand: values[i][y + 1],
              operator: values[i][y + 2],
              operators: cf.OPERATORS,
              lastOperand: values[i][y + 3],
              additionalCompairOperators: cf.ADDITIONAL_COMPAIR_OPERATORS,
              vars: vars,
              row: row,
              localization: this
            });

            row++;

            // Continue condition statement
            if(values[i][y + 4] === '&&'
            || values[i][y + 4] === '||') {
              y += 4;
              continue;
            }

            // Initialize input
            new Input({
              value: values[i][y + 4],
              row: row,
              localization: this
            });

            y += 5;

            row++;
          }
        }
        else {
          new Else({
            row: row,
            localization: this
          });

          new Input({
            value: values[i][1],
            row: row + 1,
            localization: this
          });
        }
      }
    },

    /**
     * Parse raw data
     *
     * @param {JSON} json
     * @return {void}
     * @api private
     */

    _parse: function(json) {
      this._parseValues(json.values, json.vars);

      // Delete relations while parsing. Otherwise it will
      // cause some nested relations during parsing.
      delete json.conditions;
      delete json.inputs;
      delete json.else;
      delete json.firstOperand;
      delete json.lastOperand;

      this.set(json);

      return this;
    },

    /**
     * Default values
     *
     * @type {Object}
     */

    defaults: {
      key: null,
      values: [],
      vars: [],
      text: '',
      timestamp: null,
      _new: false,

      i18n_variables: 'VARIABLES',
      i18n_value: 'VALUE',
      i18n_none: 'None',
      i18n_save: 'Save',
      i18n_addCondition: 'Add condition',
      variables: null
    },

    /**
     * Sync
     *
     * @delegate
     */

    sync: function(method, model, options, req) {
      var _this = this, id;

      if(inClient) {
        id = window.location.pathname.split('/')[3];
      }

      if(method === 'read') {
        if(inServer) {
          file.readLocalizations()
            .then(function(localizations) {
              localizations = file.localizationMapToArray(localizations)[req.param('locale')];
              var localization = _.findWhere(localizations, { id: req.param('id') });
              _this._parse(localization);
              _this.setPageTitle(localization.key);
              _this.setPageDescription('Edit: ' + localization.key);
              options.success();
            })
            .fail(function(error) {
              console.log(error.stack)
              options.error(error);
            });
        }
        else {
          var $json = $('.js-json-localization');
          if($json.length) {
            this._parse(JSON.parse($json.html()));
            $json.remove();
            options.success();
            return;
          }
          var localization = app.models.localizations.get(id);
          if(localization) {
            localization = localization.toJSON();
            this._parse(localization);
            app.document.set('title', localization.key);
            app.document.set('description', 'Edit: ' + localization.key);
            options.success();
            return;
          }
          request
            .get('/api/' + app.locale + '/l/' + id)
            .end(function(err, res) {
              var localization = res.body;
              _this._parse(localization);
              app.document.set('title', localization.key);
              app.document.set('description', 'Edit: ' + localization.key);
              options.success();
            });
        }
      }
      else if(method === 'update') {
        var json = this.toGTStandardJSON();
        request
          .put('/api/' + app.locale + '/l/' + id)
          .send(json)
          .end(function(error, response) {
            if(!error) {
              app.models.localizations.get(json.id).set(json);
              if(typeof options.success === 'function') {
                options.success();
              }
            }
            else {
              options.error(error);
            }
          });
      }
    },

    /**
     * On history push to `/`. We want to change the `revealed` property
     * to true.
     *
     * @delegate
     */

    onHistoryChange: function(path) {
      if(/^[a-z]{2}\-[A-Z]{2}\/t\//.test(path)) {
        this.setMeta('revealed', true);
        this.setPageTitle('Localization')
        this.setPageDescription('Edit localization');
      }
      else {
        this.setMeta('revealed', false);
      }
    },

    /**
     * We will ovverride the default implementation of `toJSON` method
     * because the relations is not mapped according to the server
     * implementation. Relations `Conditions`, `Inputs`, `Else` need to
     * under the property `values`
     *
     * @override
     */

    toGTStandardJSON: function() {
      var json = Model.prototype.toJSON.call(this);

      // First step: We store an array representation of the objects.
      // We also order them according to the `row` property.
      var firstValues = [];
      this.get('inputs').forEach(function(input) {
        firstValues[input.get('row')] = [input.get('value')];
      });
      this.get('conditions').forEach(function(condition) {
        firstValues[condition.get('row')] = [
          condition.get('statement'),
          condition.get('firstOperand').get('value'),
          condition.get('operator'),
          condition.get('lastOperand').get('value')
        ];
      });
      var _else = this.get('else');
      if(_else) {
        firstValues[_else.get('row')] = ['else'];
      }

      // Second step: We concatinate the arrays that have two or more
      // conditions in a row.
      var secondValues = [], currentValue = [], lastWasInput = false;
      firstValues.forEach(function(value) {
        // Check if condition. Condition have a length bigger than zero
        // because it consist of an array [STATEMENT, FIRST_OPERAND,...]
        if(value.length > 1) {
          if(!lastWasInput) {
            currentValue = currentValue.concat(value);
          }
          else {
            currentValue = value;
          }

          lastWasInput = false;
        }
        else if(value[0] === 'else') {
          currentValue = value;
          lastWasInput = false;
        }
        else {
          currentValue = currentValue.concat(value)
          secondValues.push(currentValue);
          lastWasInput = true;
        }
      });

      // We want [[value]] to be just [value]
      if(secondValues.length === 1 && secondValues[0].length === 1) {
        secondValues = [secondValues[0][0]];
        json.text = secondValues[0];
      }
      else {
        var values = secondValues.map(function(value) {
          return _.last(value);
        });
        json.text = values.join('\n');
      }

      json.values = secondValues;

      // Delete translation. It is unnecessary that these travels
      // through the network and they also don't represent properties
      // of the GT Standard
      delete json.i18n_addCondition;
      delete json.i18n_none;
      delete json.i18n_save;
      delete json.i18n_value;
      delete json.i18n_variables;
      delete json.conditions;
      delete json.inputs;
      delete json.else;

      // Override current values
      json.values = secondValues;

      return json;
    }
  });

  /**
   * Constructor used for checking if an instance is Condition
   *
   * @type {Condition}
   */

  Constructor.prototype.Condition = Condition;


  /**
   * Constructor used for checking if an instance is Input
   *
   * @type {Condition}
   */

  Constructor.prototype.Input = Input;

  /**
   * Constructor used for checking if an instance is Else
   *
   * @type {Condition}
   */

  Constructor.prototype.Else = Else;


  return Constructor;
});
