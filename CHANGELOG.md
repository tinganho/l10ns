# Changelog

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
