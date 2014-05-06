
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../libraries/View') : require('View')
    , template = inServer ? content_appTemplates : require('contentTemplates')
    , _ = require('underscore');

  return View.extend({

    /**
     * Initializer
     *
     * @return {void}
     * @api public
     */

    initialize : function(model) {
      this.model = model;
      if(inClient) {
        this._bindMethods();
      }
    },

    /**
     * Bind methods
     *
     * @return {void}
     * @api public
     */

    _bindMethods : function() {
      _.bindAll(this,
        'render',
        '_updateRow'
      );
    },

    /**
     * Bind model
     *
     * @return {void}
     * @api private
     */

    bindModel : function() {
      this.model.on('change:row', this._updateRow);
    },

    /**
     * On operator change
     *
     * @delegate
     */

    _updateRow : function() {
      var row = this.model.get('row');
      this.el.dataset.row = row;
      $('[data-row="' + (row - 1) + '"]').after(this.$el);
    },

    /**
     * Render view
     *
     * @return {void}
     * @api public
     */

    render : function() {
      return this.template(this.model.toJSON());
    },

    /**
     * Template
     *
     * @type {String}
     */

    template : template['ConditionElse']
  });
});
