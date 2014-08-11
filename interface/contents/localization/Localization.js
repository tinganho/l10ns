
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}
if(inServer) {
  var file = require('../../../libraries/file');
}

define(function(require) {
  var Backbone = require('backbone')
    , Model = inServer ? require('../../libraries/Model'): require('Model')
    , Collection = inServer ? require('../../libraries/Collection'): require('Collection')
    , _ = require('underscore')
    , ValueGroup = require('./ValueGroup')
    , Else = ValueGroup.prototype.Else
    , Input = ValueGroup.prototype.Input
    , Condition = ValueGroup.prototype.Condition;

  if(inClient) {
    var request = require('request')
  }
  else {
    Backbone = require('backbone-relational');
  }

  var ValueGroups = Collection.extend({
    model: ValueGroup,
    comparator: 'index'
  });

  var Constructor = Model.extend({

    /**
     * Relations
     *
     * @type {Object}
     */

    relations: [
      {
        type: 'HasMany',
        key: 'valueGroups',
        relatedModel: ValueGroup,
        collectionType: ValueGroups,
        reverseRelation: {
          key: 'localization',
          includeInJSON: 'id'
        }
      }
    ],

    /**
     * Parse values(conditions and inputs)
     *
     * @param {Array.<value>} values
     * @return {void}
     * @api private
     */

    _parseValues: function(values, vars) {
      var valueGroup, index = 0;
      if(values.length <= 1) {
        valueGroup = new ValueGroup({
          localization: this,
          index: index
        });

        return new Input({
          value: values.length ? values[0] : '',
          row: 0,
          valueGroup: valueGroup
        });
      }
      var row = 0;
      for(var i = 0; i<values.length; i++) {
        if(values[i].length > 2) {
          var y = 0;

          valueGroup = new ValueGroup({
            localization: this,
            index: index
          });

          index++;

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
              valueGroup: valueGroup
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
              valueGroup: valueGroup
            });

            valueGroup = new ValueGroup({
              localization: this,
              index: index
            });

            row = 0;

            index++;

            y += 5;

            row++;
          }
        }
        else {
          valueGroup = new ValueGroup({
            localization: this,
            index: index
          });

          row = 0;

          new Else({
            row: row,
            valueGroup: valueGroup
          });

          new Input({
            value: values[i][1],
            row: row + 1,
            valueGroup: valueGroup
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

  return Constructor;
});
