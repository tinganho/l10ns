# grunt-trinity

Translate dynamic text

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-trinity`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-translate');
```


Goal
====

Translator should be able to translate both static and dynamic text without requiring to know a single thing about programming. The translation solution should be scalable to all languages. A developer should be able to access the translates through a grunt command. There should be grunt command for update hashes from source and compile translation.
Problems
========
This can not be done today. The most popular translation standard is the gettext standard. It can deal with singular and plurals, but it gets more complicated on dynamic texts. It usually require a `printf` function, that inserts string into the translated text. `Printf` solution is not optimal since it is not part of Gettext. Also you can not update the hashes with the variables directly from source. With no variables available in the translation interface. It is quite hard to translate without contacting the developer.

Solution For Translators
=================================

A translator translates in Trinity by:

* (1) Search a hash string in a Translation Interface
* (2) Translate it and hit save

Solution For Developers
=================================
The translation function:
```javascript
gt(TRANSLATION_HASH, JAVASCRIPT_OBJECT);
```

A developers workflow using Trinity:

* (1) Use function `gt()` with a unique hash
* (2) Update translation hashes from source
* (3) Translates on the default language
* (4) Compiles all the translations till ready to use in `gt()`

Storage files
=================================
en.json:
```javascript
{
  'trin_hello_world': {
      vars : ['$property1', '$property2']
      translations: ['if', '$property1', '>', 'constant', 'Hello ${property1}'], ['elseif', '$property2', '>', 'Hello ${property1}'], ['else', 'Hello ${property1}']
  }
  ...
}

```
languages.json
```javascript
{
  'en': 'english',
  'fr': 'french',
  ...
}
```



[grunt]: http://gruntjs.com/
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md

## Documentation
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Tingan Ho
Licensed under the MIT license.
