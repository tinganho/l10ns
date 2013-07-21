define([

  'backbone'

],function(
  
  Backbone

) {

  var SearchRouter = Backbone.Router.extend({

    routes: {
      'search/:q' :                 'showResult'
    },

    showResult : function(q) {

    }

  });

  return SearchRouter;
});