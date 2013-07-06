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

  // Test of translation vars
  test1 : gt('Translation vars can be in one object literal'),
  test2 : gt('Translation vars can be in one object literal'),

  gt('Translation vars can have one line object literal', { fullname : inviter.fullname }),
  gt('Translation vars can have multi-line', {
    fullname: fullname
  });
  gt('Translation vars have dot notation', {
    fullname : iueh.iuhef[efkuh.kwehf].iuewgy
  });

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
  gt('It can have ++');
  gt('It can have --');
  gt('It can have **');
  gt('It can have //');

  // Quotation
  gt('It can have \'');
  gt('It can have "');

  // Edit translation
  gt('Edit me');
  gt('TEST_LABEL_THING');

  // Comments
  gt('Grunt-translate can have tailing comments');  // test1, test2
  gt('Grunt-translate can have tailing comments with translation vars', { test : 'test' });  // test1, test2
  gt('Grunt-translate can have tailing comments with multi-line translation vars', {
    test : 'test'
  });  // test1, test2
  gt('Grunt-translate can have tailing comments with multi-line translation vars', {
    test : 'test'
  });  // test1, test2

}
