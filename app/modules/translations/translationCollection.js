

define([

  'backbone',
  'backbone.paginator',
  'jquery.url',
  'jquery',
  'TranslationModel'

], function(

  Backbone,
  BackbonePaginator,
  jQueryUrl,
  $,
  Translation

) {

  var Translations = Backbone.Paginator.requestPager.extend({

    initialize : function() {
      this._meta = {};
    },

    model : Translation,

    meta : function(prop, value) {
        if (value === undefined) {
            return this._meta[prop];
        } else {
            this._meta[prop] = value;
        }
    },

    paginator_core: {
      // the type of the request (GET by default)
      type: 'GET',

      // the type of reply (jsonp by default)
      dataType: 'json',

      // the URL (or base URL) for the service
      // if you want to have a more dynamic URL, you can make this a function
      // that returns a string
      url: '/translations'

    },

    paginator_ui: {
      // the lowest page index your API allows to be accessed
      firstPage: 0,

      // which page should the paginator start from
      // (also, the actual page the paginator is on)
      currentPage: 0,

      // how many items per page should be shown
      perPage: 20,

      // a default number of total pages to query in case the API or
      // service you are using does not support providing the total
      // number of pages for us.
      // 10 as a default in case your service doesn't return the total
      totalPages: 10
    },

    server_api: {
      // the query field in the request
      filter: '',

      // number of items to return per request/page
      top: function() { return this.perPage; },

      // how many results the request should skip ahead to
      // page * number of results per page was necessary.
      skip: function() { return this.currentPage * this.perPage; },

      // field to sort by
      orderby: 'timestamp',

      // what format would you like to request results in?
      format: 'json',

      locale: $.url().param('l')

    },

    parse: function (res) {
      return res;
    }

  });

  return Translations;

});
