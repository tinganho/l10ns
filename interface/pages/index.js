
module.exports = function(page) {
  page('/')
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
          model : 'content/search/Search',
          view : 'content/search/SearchView'
        },
        body : {
          model : 'content/translations/Translations',
          view : 'content/translations/TranslationsView'
        }
      })
    .handleErrorsUsing(function(err) {});
};
