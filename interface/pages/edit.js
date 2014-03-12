
module.exports = function(page) {
  page('/t/:id')
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
      },
      edit : {
        model : 'content/edit/Edit',
        view : 'content/edit/EditView'
      }
    })
    .fail(function(err) {});
};
