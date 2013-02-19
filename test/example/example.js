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

  // Special chars
  gt('It can have <>');
  gt('It can have ..');
  gt('It can have ,,');
  gt('It can have ’’');
  gt('It can have __');
  gt('It can have &&');
  gt('It can have %%');
  gt('It can have $$');
  gt('It can have €€');
  gt('It can have ##');
  gt('It can have ??');
  gt('It can have !!');

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
  gt('It can have \"');


}
