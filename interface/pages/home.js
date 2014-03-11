
module.exports = function(page) {
  page('/')
    .document('default')
    .layout('app')
    .content({
      search : {
        model : 'search/Search',
        view : 'search/SearchView'
      },
      translations : {
        model : 'translations/Translations',
        view : 'translations/TranslationsView'
      }
    })
    .fail(function(err) {});
};
