
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
    var request = require('request');
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
        if(this.bootstrapped) {
          var $json = $('.js-json-edit');
          this.set(JSON.parse($json.html()));
          this.bootstrapped = true;
          $json.remove();
        }
      }
    },

    /**
     * Default values
     *
     * @type {Object}
     */

    defaults : {
      key : null,
      value : [],
      vars : [],
      text : '',
      timestamp : null,
      _new : false,

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
          opts.success();
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
