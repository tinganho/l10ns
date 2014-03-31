
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
     , ConditionView = require('./ConditionView');
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
     * Initialize components and bind them.
     *
     * @param {Array} values
     * @return {this}
     * @api private
     */

    bindComponents : function() {
      var values = this.get('values')
        , objects = [];

      if(values.length === 1) {
        return this.set('_valuesObjects', []);
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

            objects.push(condition);

            row++;

            if(values[i][y + 4] === '&&'
            || values[i][y + 4] === '||') {
              return y += 4;
            }

            y += 5;
          }
        }
        else {

        }
      }

      // store
      this.set('_valuesObjects', objects);

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
            _this.set(translation);
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
    }
  });
});
