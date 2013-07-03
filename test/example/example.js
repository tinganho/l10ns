function test() {

  'use strict';

  gt('It can have an if and else statement', { number: 2 });
  gt('It can have an if and else if and else statements', { number: 3 });
  gt('It can have only one string', { world: 'world'});

  gt('It can take && in if statement', {
    firstname: 'Tingan',
    lastname: 'Ho'
  });
  gt('It can take || in if statement', {
    firstname: 'Tingan',
    lastname: 'Ho'
  });
  gt('It can take several && in if statement', {
    firstname: 'Tingan',
    lastname: 'Ho'
  });
  gt('It can take several || in if statement', {
    firstname: 'Tingan',
    lastname: 'Ho'
  });

  var owner = {
    name : 'fullname'
  };

  gt('It can have dot notation in object', {
    fullname : iueh.iuhef[efkuh.kwehf].iuewgy
  });

  invitationUrl : '/invitation/' + invitationToken,

  // Labels
  i18n_shareInfo : gt('share_page_info', {
    fullname: fullname
  }),
  i18n_join      : gt('share_page_join')

  // Special chars
  gt("It can have <>");
  gt('It can have ..');
  gt('It can have ,,');
  gt('It can have ::');
  gt('It can have ;;');
  gt('It can have ’’');
  gt('It can have __');
  gt('It can have &&');
  gt('It can have %%');
  gt('It can have $$');
  gt('It can have €€');
  gt('It can have ##');
  gt('It can have ??');
  gt('It can have !!');
  gt('It can have ()');
  gt('It can have @@');

  gt('It can have ^^');
  gt('It can have ´´');
  gt('It can have ``');

  // Math
  gt('It can have ==');
  gt('It can have ++'); // aoiwdjwd, iwefjfew
  gt('It can have --');
  gt('It can have **');
  gt('It can have //');

  // Quotation
  gt('It can have \'');
  gt('It can have "');

  // Edit translation
  gt('Edit me');
  gt('TEST_LABEL_THING');

}
