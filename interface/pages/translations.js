
module.exports = function(page) {
  page('/')
    .document('default')
    .layout('app')
    .content({
      search : {
        model : 'content/search/Search',
        view : 'content/search/SearchView'
      },
      body : {
        model : 'content/translations/Translations',
        view : 'content/translations/TranslationsView'
      }
    })
    .fail(function(err) {});
};
