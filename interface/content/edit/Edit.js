
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
      i18n_else : 'ELSE',
      variables : null
    },

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
