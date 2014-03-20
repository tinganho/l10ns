
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var isArray = require('../lib/isArray')
    , _ = require('underscore');

  return function(url) {
    var props = {
      '/' : {
        title : 'Translations',
        description : 'Latest translations',
        locale : 'en',
        styles : [
          '/public/styles/documents/default.css',
          '/public/styles/content/app.css'
        ],
        main : '/documents/mains/app',
        templates : '/public/templates/content/app.js'
      },
      '/t/:id' : {
        title : null,
        description : null,
        locale : 'en',
        styles : [
          '/public/styles/documents/default.css',
          '/public/styles/content/app.css'
        ],
        main : '/documents/mains/app',
        templates : '/public/templates/content/app.js',
        noScroll : true
      }
    };

    if(typeof url === 'string') {
      // Check
      if(typeof props[url] === 'undefined') {
        throw new TypeError('no resouce for url: ' + url);
      }
      return props[url];
    }
    else if(isArray(url)) {
      return _.pick(props, url)
    }
  };
});
