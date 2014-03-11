
module.exports = function(page) {
  page('/t/:id')
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
      },
      edit : {
        model : 'edit/Edit',
        view : 'edit/EditView'
      }
    })
    .fail(function(err) {});
};
