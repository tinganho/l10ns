
module.exports = function(page) {
  page('/:locale/localizations')
    .hasDocument('default')
      .withProperties({
        title: null,
        description: null,
        configurations: ['default'],
        locale: 'en',
        styles: [
          '/public/styles/documents/default.css',
          '/public/styles/content/app.css'
        ],
        main: '/documents/mains/app',
        templates: '/public/templates/content/app.js'
      })
    .hasLayout('app')
      .withRegions({
        leftHeader: {
          model: 'contents/LeftMenu/LeftMenu',
          view: 'contents/LeftMenu/LeftMenuView'
        },
        search: {
          model: 'contents/search/Search',
          view: 'contents/search/SearchView'
        },
        locales: {
          model: 'contents/locales/Locales',
          view: 'contents/locales/LocalesView'
        },
        body: {
          model: 'contents/localizations/Localizations',
          view: 'contents/localizations/LocalizationsView'
        }
      })
    .handleErrorsUsing(function(error) {
    });
};
