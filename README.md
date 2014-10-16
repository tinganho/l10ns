
#l10ns 
[![Build Status](http://img.shields.io/travis/tinganho/l10ns.svg?style=flat-square)](https://travis-ci.org/tinganho/l10ns)
[![Version](https://img.shields.io/npm/v/l10ns.svg?style=flat-square)](https://www.npmjs.org/package/l10ns)

==============
Effective translation workflow.

* Updated translation keys from source.
* Intuitive web translation interface.
* Translate every translation problem you can think of.
* CLI tool for updating and translating.
* Support for multiple programming languages.

----

## Today's translation problems
There is a lot of problem involved with translating an application today. Regardless of which languague it is written in. The main problems are maintenance, inefficent workflow and inability to translate complex translations.

Examples:

* A key got deleted from source. You have to yourself delete the key in all your localization files.
* If a translation key got added to source. You have to youself add the key to all you localization files.
* Translators often need to contact developers for translation.
* Trouble to translate gender context. E.g. `You gave him 5 coins`
* Trouble to translate multiple translation forms. Some languages don't just have singular and plural they have more than 2 plural forms.
* Check this slides for more problems: https://docs.google.com/presentation/d/1ZyN8-0VXmod5hbHveq-M1AeQ61Ga3BmVuahZjbmbBxo/pub?start=false&loop=false&delayms=3000#slide=id.g1bc43a82_2_14

## Getting started

Install l10ns `npm install l10ns -g`

Create a new project folder `test` and initialize a new translation project. The initialization guide will guide you through creating a project.
```
$ mkdir test
$ cd test
$ l10ns init
```
Now, create a source file `test.js` with (at least) the following code:
``` javascript
var firstnameLabel = l('FIRSTNAME')
  , lastnameLabel = l('LASTNAME')
  // Pass in variables
  , age = 7
  , yourAgeIsLabel = l('YOUR_AGE_IS', { age : age });
  // Pass in multiple variables
  , cats = 2
  , dogs = 3
  , catsAndDogsLabel = l('YOU_HAVE_NUMBER_OF_CATS_AND_DOGS', { cats : cats, dogs : dogs});
```
Now, lets update translation keys from source:
```
$ l10ns update
```
Lets check which translation keys have been added:
```
$ l10ns log
@1 FIRSTNAME | NO TRANSLATION
@2 LASTNAME | NO TRANSLATION
@3 YOUR_AGE | NO TRANSLATION
@4 YOU_HAVE_NUMBER_OF_CATS_AND_DOGS | NO TRANSLATION
```
Edit the last translation using `log reference`:
```
$ l10ns set @1 "Firstname" # using default langague
$ l10ns set @1 --locale=zh "名" # using chinese
```
Translation are now saved to a localization file. To compile to your source programming language:
```
$ l10ns compile
```
Lets set up a web interface for translator to use:
```
$ l10ns interface
```

## License
Copyright (c) 2014 Tingan Ho
Licensed under the MIT license.
