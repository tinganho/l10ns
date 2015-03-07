# Changelog

## v2.0.14

* Adds install report analytics.

## v2.0.13

* Changes to the new favicon.

## v2.0.12

* Fixes CLDR data path issues.

## v2.0.11

* Fixes issues with localization key getter not getting keys inside a function call.

## v2.0.10

* Fixes error message for selectordinal format parsing. Thanks to [Naman Goel].
* Fix version of CLDR data.

## v2.0.9

* Fixes autoroute issues, that causes problem with node v0.12.

## v2.0.8

* Fixes bug with example numbers not showing decimal example whenever there is no integer example

## v2.0.1 - v2.0.7

* Changes locale reference to language

## v2.0

* Adds Dateformat
* Adds cldrjs and cldr-data
* Adds compile button on interface
* Fixes bug with setting a localization through CLI `set` method
* Adds BCP47 compliancy
* Adds lazy caching to message parsing
* etc.

Deprecates the settings `project.locales` and `project.defaultLocale` in favor of `project.languages` and `project.defaultLanguage`. `Locales` and `language` or `language tags` have different meanings. Here is an excerpt from w3c:

> A major difference between language tags and locale identifiers is the meaning of the region code. In both language tags and locales, the region code indicates variation in language (as with regional dialects) or presentation and format (such as number or date formats). In a locale, the region code is also sometimes used to indicate the physical location, market, legal, or other governing policies for the user.

Because L10ns uses the BCP47 standard and they refer to `language tags` or just `language` and not `locale`. L10ns should not refer `locales` either.

Here is the example changes marked for a project:
```
{
  "projects": {
    "test": {
      "programmingLanguage": "javascript",
      "locales": { // Use languages instead
        "en-US": "English (US)"
      },
      "quiet" : false,
      "defaultLocale": "en-US", // Use defaultLanguage instead
      "currencies": [
        "USD"
      ],
      "store": "example/javascript/localizations",
      "output": "example/javascript/output",
      "source": ["example/javascript/index.js"],
      "interface" : {
        "autoOpen": false,
        "port": 3004
      }
    }
  },
  "defaultProject": "javascript"
}
```

[Naman Goel]: https://github.com/nmn
