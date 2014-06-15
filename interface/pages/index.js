
module.exports = function(page) {
  page('/:locale/translations')
    .hasDocument('default')
      .withProperties({
        title : 'Translations',
        description : 'Latest translations',
        configurations : ['default'],
        locale : 'en',
        styles : [
          '/public/styles/documents/default.css',
          '/public/styles/content/app.css'
        ],
        main : '/documents/mains/app',
        templates : '/public/templates/content/app.js'
      })
    .hasLayout('app')
      .withRegions({
        search : {
          model : 'contents/search/Search',
          view : 'contents/search/SearchView'
        },
        locales: {
          model: 'contents/locales/Locales',
          view: 'contents/locales/LocalesView'
        },
        body : {
          model : 'contents/translations/Translations',
          view : 'contents/translations/TranslationsView'
        }
      })
    .handleErrorsUsing(function(err) {});
};
