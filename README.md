get-translation [![Build Status](https://travis-ci.org/tinganho/get-translation.png)](https://travis-ci.org/tinganho/get-translation)
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
* Translators need to learn complex language syntax to solve complex translations. E.g. ICU.
* Check this slides for more problems: https://docs.google.com/presentation/d/1ZyN8-0VXmod5hbHveq-M1AeQ61Ga3BmVuahZjbmbBxo/pub?start=false&loop=false&delayms=3000#slide=id.g1bc43a82_2_14

## Getting started

Install get-translation `npm install get-translation -g`

Create a new project folder `test` and initialize a new translation project. The initialization guide will guide you through creating a project.
```
$ mkdir test
$ cd test
$ gt init
```
Now, create a source file `test.js` with (at least) the following code:
``` javascript
var firstnameLabel = gt('FIRSTNAME')
  , lastnameLabel = gt('LASTNAME')
  // Pass in variables
  , age = 7
  , yourAgeIsLabel = gt('YOUR_AGE_IS', { age : age });
  // Pass in multiple variables
  , cats = 2
  , dogs = 3
  , catsAndDogsLabel = gt('YOU_HAVE_NUMBER_OF_CATS_AND_DOGS', { cats : cats, dogs : dogs});
```
Now, lets update translation keys from source:
```
$ gt update
```
Lets check which translation keys have been added:
```
$ gt log
%1 FIRSTNAME | NO TRANSLATION
%2 LASTNAME | NO TRANSLATION
%3 YOUR_AGE | NO TRANSLATION
%4 YOU_HAVE_NUMBER_OF_CATS_AND_DOGS | NO TRANSLATION
```
Edit the last translation using `log reference`:
```
$ gt edit %1 "Firstname" # using default langague
$ gt edit %1 --locale=zh "名" # using chinese
```
Translation are now saved to a localization file. To compile to your source programming language:
```
$ gt compile
```


## License
Copyright (c) 2014 Tingan Ho
Licensed under the MIT license.
