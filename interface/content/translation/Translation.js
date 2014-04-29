
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}
if(inServer) {
  var file = require('../../../lib/file');
}

define(function(require) {
  var Backbone
    , Model = inServer ? require('../../lib/Model') : require('Model')
    , Collection = inServer ? require('../../lib/Collection') : require('Collection')
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
    model : Condition
  });

  var Inputs = Collection.extend({
    model : Input
  });

  var Constructor = Model.extend({

    /**
     * Relations
     *
     * @type {Object}
     */

    relations : [{
      type: 'HasMany',
      key: 'conditions',
      relatedModel: Condition,
      collectionType: Conditions,
      reverseRelation: {
        key: 'translation',
        includeInJSON: 'id'
      }
    },
    {
      type: 'HasOne',
      key: 'else',
      relatedModel: Else,
      reverseRelation: {
        key: 'parent', // Bug can't set `translation`
        includeInJSON: 'id'
      }
    },
    {
      type: 'HasMany',
      key: 'inputs',
      relatedModel: Input,
      collectionType: Inputs,
      reverseRelation: {
        key: 'translation',
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

    _parseValues : function(values, vars) {
      if(values.length <= 1) {
        return new Input({
          value : values.length ? values[0] : '',
          row : 0,
          translation : this
        });
      }
      for(var i = 0; i<values.length; i++) {
        if(values[i].length > 2) {
          var y = 0, row = 0;
          while(typeof values[i][y] !== 'undefined') {
            new Condition({
              statement : values[i][y],
              firstOperand : values[i][y + 1],
              operator : values[i][y + 2],
              operators : cf.OPERATORS,
              lastOperand : values[i][y + 3],
              additionalCompairOperators : cf.ADDITIONAL_COMPAIR_OPERATORS,
              vars : vars,
              row : row,
              translation : this
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
              value : values[i][y + 4],
              row : row,
              translation : this
            });

            y += 5;

            row++;
          }
        }
        else {
          new Else({
            row : row,
            parent : this
          });

          new Input({
            value : values[i][1],
            row : row + 1,
            translation : this
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

    _parse : function(json) {
      this._parseValues(json.values, json.vars);
      this.set(json);

      return this;
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

      i18n_variables : 'VARIABLES',
      i18n_translation : 'TRANSLATION',
      i18n_none : 'None',
      i18n_save : 'Save',
      i18n_addCondition : 'Add condition',
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
          this._parse(translation);
          this.setPageTitle(translation.key);
          this.setPageDescription('Edit: ' + translation.key);
          return opts.success();
        }
        else {
          // Parse bootstrapped data
          var $json = $('.js-json-translation');
          if($json.length) {
            this._parse(JSON.parse($json.html()));
            $json.remove();
            opts.success();
            return;
          }
          var id = window.location.pathname.split('/')[2];
          var translation = app.models.translations.get(id);
          if(translation) {
            translation = translation.toJSON();
            this._parse(translation);
            app.document.set('title', translation.key);
            app.document.set('description', 'Edit: ' + translation.key);
            opts.success();
            return;
          }
          request
            .get('/translations/' + id)
            .end(function(err, res) {
              var translation = res.body;
              _this._parse(translation);
              app.document.set('title', translation.key);
              app.document.set('description', 'Edit: ' + translation.key);
              opts.success();
            });
        }
      }
    },

    /**
     * On history push to `/`. We want to change the `revealed` property
     * to true.
     *
     * @delegate
     */

    onHistoryChange : function(path) {
      if(/^\/t\//.test(path)) {
        this.setMeta('revealed', true);
        this.setPageTitle('Translations')
        this.setPageDescription('Edit translations');
      }
      else {
        this.setMeta('revealed', false);
      }
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
