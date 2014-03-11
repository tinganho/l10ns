
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var Model = inServer ? require('../../lib/Model') : require('lib/Model')
    , template = inServer ? content_appTmpls : require('contentTmpls')
    , _ = require('underscore');

  if(inServer) {
    var file = require('../../../lib/file');
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
      if(method === 'read') {
        var translations = file.readTranslations(cf.DEFAULT_LOCALE, { returnType : 'array' }).slice(0, cf.TRANSLATION_ITEMS_PER_PAGE);

        var translation = _.findWhere(translations, { id : req.param('id') });

        this.set(translation);

        this.setPageTitle(translation.key);
        this.setPageDescription('Edit ' + translation.key);

        opts.success();
      }
    }
  });
});
