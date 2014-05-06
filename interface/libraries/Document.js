
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var Model = require('backbone');

  return Model.Model.extend({

    /**
     * Default values
     *
     * @†ype {Object}
     */

    defaults : {
      title : document.querySelector('title').innerHMTL,
      description : document.querySelector('meta[name=description]').getAttribute('content'),
      noScroll : document.documentElement.classList.contains('no-scroll')
    }
  });
});
