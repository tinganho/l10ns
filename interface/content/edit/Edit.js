
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}
if(inServer) {
  var file = require('../../../lib/file');
}

define(function(require) {
  var Model = inServer ? require('../../lib/Model') : require('Model')
    , template = inServer ? content_appTmpls : require('contentTmpls')
    , _ = require('underscore');

  if(inClient) {
    var request = require('request')
     , Condition = require('./Condition')
     , ConditionView = require('./ConditionView')
     , Input = require('./Input')
     , InputView = require('./InputView');
  }

  return Model.extend({

    /**
     * Initializer
     *
     * @return {void}
     * @api public
     */

    initialize : function() {
      if(inClient) {
        this._bindMethods();
        // Parse bootstrapped data
        $json = $('.js-json-edit');
        if($json.length) {
          var $json = $('.js-json-edit');
          this.set(JSON.parse($json.html()));
          $json.remove();
          this.bindComponents();
        }
      }
    },

    /**
     * Bind methods
     *
     * @return {this}
     * @api private
     */

    _bindMethods : function() {
      _.bindAll(this, '_setValues');
    },

    /**
     * Initialize components and bind them.
     *
     * @param {Array} values
     * @return {this}
     * @api private
     */

    bindComponents : function() {
      var values = this.get('values')
        , objects = [];

      // If all object are already bind return
      if(this.get('_valueObjects')) {
        return;
      }

      if(values.length === 1) {
        return this.set('_valueObjects', []);
      }

      for(var i = 0; i<values.length; i++) {
        if(values[i].length > 2) {
          var y = 0, row = 0, vars = this.get('vars');
          while(typeof values[i][y] !== 'undefined') {
            var condition = new Condition({
              statement : values[i][y],
              firstOperand : values[i][y + 1],
              operator : values[i][y + 2],
              lastOperand : values[i][y + 3],
              vars : vars,
              row : row
            });
            new ConditionView(condition);

            // Listen to changes and set new values from
            // value objects, whenever changes occurs.
            condition.on('change', this._setValues);

            objects.push(condition);
            row++;

            // Continue condition statement
            if(values[i][y + 4] === '&&'
            || values[i][y + 4] === '||') {
              y += 4;
              continue;
            }

            // Initialize input
            var input = new Input({
              value : values[i][y + 4],
              row : row
            });
            new InputView(input);

            // Listen to changes and set new values from
            // value objects, whenever changes occurs.
            input.on('change', this._setValues);

            objects.push(input);

            y += 5;

            row++;
          }
        }
        else {
          // We indicate that this is the last value
          objects.push('else');

          // Initialize input
          var input = new Input({
            value : values[i][1],
            row : row
          });
          new InputView(input);

          // Listen to changes and set new values from
          // value objects, whenever changes occurs.
          input.on('change', this._setValues);

          objects.push(input);
        }
      }

      // store
      this.set('_valueObjects', objects);

      return this;
    },

    /**
     * Set values from `_valueObjects`
     *
     * @return {void}
     * @api private
     */

    _setValues : function(model) {
      // We don't handle row changes
      if(typeof model.changed.row !== 'undefined') {
        return;
      }
      var valueObjects = this.get('_valueObjects');
      var newValues = [];
      var lastType, lastConditionIndex = 0;
      valueObjects.every(function(value, index, array) {
        if(value instanceof Condition) {
          var condition = [
            value.get('statement'),
            value.get('firstOperand'),
            value.get('operator'),
            value.get('lastOperand')
          ];
          if(lastType === 'condition') {
            newValues[lastConditionIndex].concat(condition);
          }
          else {
            newValues.push(condition);
            lastConditionIndex = index;
          }
          lastType = 'condition';
        }
        else if(value instanceof Input) {
          newValues[lastConditionIndex].push(value.get('value'));
        }
        else if(value === 'else') {
          newValues.push(['else', array[index + 1].get('value')]);
          return false;
        }

        return true;
      });

      this.set('values', newValues);
    },

    /**
     * Default values
     *
     * @type {Object}
     */

    defaults : {
      key : null,
      values : [],
      vars : [],
      text : '',
      timestamp : null,
      _new : false,
      _compairs : null,

      i18n_variables : 'VARIABLES',
      i18n_translation : 'TRANSLATION',
      i18n_none : 'None',
      i18n_save : 'SAVE',
      i18n_addCondition : 'ADD CONDITION',
      variables : null
    },

    /**
     * Sync
     *
     * @delegate
     */

    sync : function(method, collection, opts, req) {
      var _this = this;

      if(method === 'read') {
        if(inServer) {
          var translations = file.readTranslations(cf.DEFAULT_LOCALE, { returnType : 'array' }).slice(0, cf.TRANSLATION_ITEMS_PER_PAGE);
          var translation = _.findWhere(translations, { id : req.param('id') });
          this.set(translation);
          this.setPageTitle(translation.key);
          this.setPageDescription('Edit: ' + translation.key);
          return opts.success();
        }
        else {
          var id = window.location.pathname.split('/')[2];
          var translation = app.models.translations.get(id);
          if(translation) {
            translation = translation.toJSON();
            this.set(translation);
            app.document.set('title', translation.key);
            app.document.set('description', 'Edit: ' + translation.key);
            opts.success();
            return;
          }
          request
            .get('/translations/' + id)
            .end(function(err, res) {
              var translation = res.body;
              _this.set(translation);
              app.document.set('title', translation.key);
              app.document.set('description', 'Edit: ' + translation.key);
              opts.success();
            });
        }
      }
    },

    /**
     * Add value object
     *
     * @return {void}
     * @api public
     */

    addValueObject : function(row, object) {
      var objects = this.get('_valueObjects');
      var length = objects.length;
      for(var i = length - 1; i > 0; i--) {
        if(i >= row) {
          if(typeof objects[i].set === 'function') {
            objects[i].set('row', i + 1);
          }
          objects[i + 1] = objects[i];
        }
        else {
          break;
        }
      }

      objects[row] = object;

      if(object instanceof Condition) {
        var view = new ConditionView(object);
      }
    },

    /**
     * Remove value object
     *
     * @return {void}
     * @api public
     */

    removeValueObject : function(row) {
      var objects = this.get('_valueObjects');
      objects.splice(row, 1);
      for(var i = 0; i < objects.length; i++) {
        if(typeof objects[i].set === 'function') {
          objects[i].set('row', i);
        }
      }
    }
  });
});
