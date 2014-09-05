
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../libraries/View') : require('View')
    , template = inServer ? content_appTemplates : require('contentTemplates')
    , _ = require('underscore');

  if(inClient) {
    var minTimer = require('minTimer');
  }

  return View.extend({

    /**
     * Initializer
     *
     * @return {void}
     * @api public
     */

    initialize: function(model) {
      this.model = model;
      if(inClient) {
        this._bindMethods();
      }
    },

    /**
     * Bind model
     *
     * @return {void}
     * @api public
     */

    bindModel: function() {
    },

    /**
     * Bind view
     *
     * @return {void}
     * @api private
     */

    bindDOM: function() {
      this._setElements();
      this._addMouseInteractions();
    },

    /**
     * Bind methods
     *
     * @return {void}
     * @api private
     */

    _bindMethods: function() {
      _.bindAll(
        this,
        '_save',
        '_delayedResize',
        '_resizeTextArea',
        '_addPluralFormatedText',
        '_addSelectFormatedText',
        '_addChoiceFormatedText'
      );
    },

    /**
     * Resize textarea
     *
     * @api private
     * @handler
     */

    _resizeTextArea: function(event) {
      if(typeof event !== 'undefined' && event.keyCode === 8) {
        this.$textAreaMirror.val('');
      }
      else if(typeof event !== 'undefined' && event.keyCode === 13) {
        this.$textAreaMirror.val(this.$textArea.val() + '\nsuffix');
      }
      else {
        this.$textAreaMirror.val(this.$textArea.val() + 'suffix');
      }
      var height = this.$textAreaMirror[0].scrollHeight -
        parseInt(this.$textAreaMirror.css('padding-top').replace('px', ''), 10) -
        parseInt(this.$textAreaMirror.css('padding-bottom').replace('px', ''), 10);
      this.$textArea.css('height', height + 'px');
    },

    /**
     * Delay resize
     *
     * @api private
     * @handler
     */

    _delayedResize: function() {
      _.defer(this._resizeTextArea);
    },

    /**
     * Add desktop listeners
     *
     * @return {void}
     * @api private
     */

    _addMouseInteractions: function() {
      this.$('[disabled]').removeAttr('disabled');
      this.$el.on('click', '.save', this._save);
      this.$textArea.on('change', this._resizeTextArea);
      this.$textArea.on('cut', this._resizeTextArea);
      this.$textArea.on('paste', this._resizeTextArea);
      this.$textArea.on('drop', this._resizeTextArea);
      this.$textArea.on('keydown', this._resizeTextArea);
      this.$addPluralButton.on('mousedown', this._addPluralFormatedText);
      this.$addSelectButton.on('mousedown', this._addSelectFormatedText);
      this.$addChoiceButton.on('mousedown', this._addChoiceFormatedText);
      this._resizeTextArea();
    },

    /**
     * Replace selected text in textarea with text
     *
     * @param {String} text
     * @return {void}
     * @api private
     */

    _replaceTextSelectionWithText: function(text) {
      var _this = this
        , string = this.$textArea.val()
        , start = this.$textArea[0].selectionStart
        , end = this.$textArea[0].selectionEnd
        , startString = string.substring(0, start)
        , endString = string.substring(end, string.length);

      this.$textArea.val(startString + text + endString);
      this._resizeTextArea();

      setTimeout(function() {
        if(_this.$textArea[0].createTextRange) {
          var range = _this.$textArea[0].createTextRange();
          range.move('character', end);
          range.select();
        }
        else {
          if(_this.$textArea[0].selectionStart) {
            _this.$textArea[0].focus();
            _this.$textArea[0].setSelectionRange(start, text.length + end);
          }
          else {
            _this.$textArea[0].focus();
          }
        }
      }, 0);
    },

    /**
     * Add plural formated text to textarea
     *
     * @return {void}
     * @api private
     */

    _addPluralFormatedText: function() {
      var text = '{variable, plural, ';
      var keywords =  Object.keys(this.model.get('pluralRules'));
      for(var index = 0; index < keywords.length; index++) {
        text +=  ' ' + keywords[index] + ' {message-' + keywords[index] + '}';
      }
      text += '}';
      this._replaceTextSelectionWithText(text);
    },

    /**
     * Add select formated text to textarea
     *
     * @return {void}
     * @api private
     */

    _addSelectFormatedText: function() {
      var text = '{variable, select, other {message-other}}';
      this._replaceTextSelectionWithText(text);
    },

    /**
     * Add select formated text to textarea
     *
     * @return {void}
     * @api private
     */

    _addChoiceFormatedText: function() {
      var text = '{variable, choice, 1<message1|5#message2}';
      this._replaceTextSelectionWithText(text);
    },

    /**
     * Set elements
     *
     * @return {void}
     * @api private
     */

    _setElements: function() {
      this.$region = $('[data-region=localization]');
      this.$textArea = this.$('.localization-textarea-real');
      this.$textAreaMirror = this.$('.localization-textarea-mirror');
      this.$textAreaHeightHelper = this.$('.localization-textarea-height-helper');
      this.$addPluralButton = this.$('.localization-action-plural');
      this.$addSelectButton = this.$('.localization-action-select');
      this.$addChoiceButton = this.$('.localization-action-choice');
      this.$addSelectordinalButton = this.$('.localization-action-selectordinal');
      this.$addNumberButton = this.$('.localization-action-number');
      this.$addDateButton = this.$('.localization-action-date');
    },

    /**
     * Save
     *
     * @delegate
     */

    _save: function(event) {
      var _this = this;

      event.preventDefault();
      this.$saveSpinner.show();
      this.$saveButtonContainer.removeClass('is-waiting').addClass('is-loading');
      minTimer.start(1000);
      this.model.save(null, {
        success: function(model, response, options) {
          minTimer.end(function() {
            _this.$saveButtonContainer.removeClass('is-loading').addClass('is-waiting');
            setTimeout(function() {
              _this.$saveSpinner.hide();
            }, 300);
          });
        },
        error: function() {
          minTimer.end(function() {
            _this.$saveButtonContainer.removeClass('is-loading').addClass('is-waiting');
            setTimeout(function() {
              _this.$saveSpinner.hide();
              alert('Couldn\'t save your localization, please try again later.');
            }, 300);
          });
        }
      });
    },

    /**
     * To HTML
     *
     * @return {void}
     * @api public
     */

    toHTML: function() {
      var _this = this
        , html = ''
        , values = ''
        , json = this.model.toJSON();

      json.values = values;

      html += template['Localization'](json);

      return html;
    },

    /**
     * Determine whether to render or not
     *
     * @return {String}
     * @api public
     * @autocalled
     */

    should: function(path) {
      return 'update';
    }
  });
});
