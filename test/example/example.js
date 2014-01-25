
gt('It can have an if and else statement', { test: 2 });
gt('It can have an if and else if and else statements', { test: 3 });
gt('It can have only one string', { test: 'test1'});

gt('It can take && in if statement', {
  test1: 'test1',
  test2: 'test2'
});
gt('It can take || in if statement', {
  test1: 'test1',
  test2: 'test2'
});
gt('It can take several && in if statement', {
  test1: 'test1',
  test2: 'test2',
  test3: 'test2'
});
gt('It can take several || in if statement', {
  test1: 'test1',
  test2: 'test2',
  test3: 'test3'
});

// Test of translation vars
test1 : gt('Translation vars can be in one object literal'),
test2 : gt('Translation vars can be in one object literal'),

gt('Translation vars can have one line object literal', { test : 'test' }),
gt('Translation vars can have multi-line object literal', {
  test: 'test'
});
gt('Translation vars have dot notation', {
  fullname : test1.test2[test3.test4].test5
});
gt('Translation vars can have single function call', {
  test : test()
});
gt('Translation vars can have multiple function calls', {
  test1 : test1(),
  test2 : test2()
});
gt('Translation vars can have single method call', {
  test : test.test()
});
gt('Translation vars can have multiple method calls', {
  test1 : test.test1(),
  test2 : test.test2()
});
gt('Translation vars can have single function call with a single object literal as a parameter', {
  test1 : test.test1({ test: 'test'})
});
gt('Translation vars can have multiple function call with a single object literal as a parameter', {
  test1 : test1.test({ test: 'test'}),
  test2 : test2.test({ test: 'test'})
});
gt('Translation vars can have single function call with a multiple object literal as a parameter', {
  test : test1.test({ test1: 'test'}, {test2 : 'test'})
});
gt('Translation vars can have multiple function call with a multiple object literal as a parameter', {
  test1 : test1.test({ test1: 'test'}, {test2 : 'test'}),
  test2 : test2.test({ test1: 'test'}, {test2 : 'test'})
});
test({
  test : gt('Translation function can be inside function calls')
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
gt('It can have double and single quote in translation');

// Edit translation
gt('Edit me');

// Comments
gt('Grunt-translate can have tailing comments');  // test1, test2
gt('Grunt-translate can have tailing comments with translation vars', { test : 'test' });  // test1, test2
gt('Grunt-translate can have tailing comments with multi-line translation vars', {
  test : 'test'
});  // test1, test2

gt('testbewfaxjgwdefoijiguswefggwgwegexfdwewfwfeefsfefddfweddfwwddwdeedxxd')
gt('teswfefewwetbafewewjswdewgweeefewfwwefxfwddswdewewddv1234')
