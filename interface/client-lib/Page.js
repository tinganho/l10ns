
define([

  'Model'

], function(

  Model

) {

  return Model.extend({
    initialize : function() {
      this.set('title', document.querySelector('title').innerText);
      this.set('description', document.querySelector('meta[name=description]').getAttribute('content'));
    }
  });

});
