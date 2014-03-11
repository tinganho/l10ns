
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../lib/View') : require('/lib/View')
    , template = inServer ? content_appTmpls : require('contentTmpls');

  return View.extend({
    template : template.translations
  });
});
