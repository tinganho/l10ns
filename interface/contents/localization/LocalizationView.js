
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var View = inServer ? require('../../libraries/View') : require('View')
    , template = inServer ? content_appTemplates : require('contentTemplates')
    , _ = require('underscore');

  if(inClient) {
    var minTimer = require('minTimer')
      , SinusWave = require('../../libraries/client/SinusWave');
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
        this._lastSave = Date.now();
        this._bindMethods();
      }
    },

    /**
     * Bind view
     *
     * @return {void}
     * @api private
     */

    bindDOM: function() {
      this._setElements();
      this._addDesktopInteractions();
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
        '_syncValue',
        '_delayedResize',
        '_resizeTextArea',
        '_addPluralFormatedText',
        '_addSelectFormatedText',
        '_addSelectordinalFormatedText',
        '_addNumberFormatedText',
        '_addCurrencyFormatedText',
        '_addDateFormatedText',
        '_addVariableFormatedText'
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
     * Syn value with model
     *
     * @return {void}
     * @api private
     * @handler
     */

    _syncValue: function() {
      this.model.set('value', this.$textArea.val());
    },

    /**
     * Add desktop listeners
     *
     * @return {void}
     * @api private
     */

    _addDesktopInteractions: function() {
      this.$('[disabled]').removeAttr('disabled');
      this.$el.on('click', '.save', this._save);
      this.$textArea.on('change', this._resizeTextArea);
      this.$textArea.on('change', this._syncValue);
      this.$textArea.on('cut', this._resizeTextArea);
      this.$textArea.on('paste', this._resizeTextArea);
      this.$textArea.on('drop', this._resizeTextArea);
      this.$textArea.on('keydown', this._resizeTextArea);
      this.$addPluralButton.on('mousedown', this._addPluralFormatedText);
      this.$addSelectButton.on('mousedown', this._addSelectFormatedText);
      this.$addSelectordinalButton.on('mousedown', this._addSelectordinalFormatedText);
      this.$addNumberButton.on('mousedown', this._addNumberFormatedText);
      this.$addCurrencyButton.on('mousedown', this._addCurrencyFormatedText);
      this.$addDateButton.on('mousedown', this._addDateFormatedText);
      this.$variable.on('mousedown', this._addVariableFormatedText);
      this.$save.on('mouseup', this._save);
      this.$arrowLeft.on('mouseup', this._changeField);
      this.$arrowRight.on('mouseup', this._changeField);
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
      this._syncValue();
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
            _this.$textArea[0].setSelectionRange(start, text.length + start);
          }
          else {
            _this.$textArea[0].focus();
          }
        }
      }, 0);
    },

    /**
     * Add variable formated text to textarea
     *
     * @return {void}
     * @api private
     */

    _addVariableFormatedText: function(event) {
      var string = this.$textArea.val()
        , start = this.$textArea[0].selectionStart
        , end = this.$textArea[0].selectionEnd
        , startString = string.charAt(start - 1)
        , variable = event.currentTarget.getAttribute('data-value')
        , text;

      if(startString === '{') {
        text = event.currentTarget.getAttribute('data-value');
      }
      else {
        text = '{' + event.currentTarget.getAttribute('data-value') + '}';
      }

      this._replaceTextSelectionWithText(text);
      this.$messageText.removeClass('has-error').html(_this.model.get('message'));
    },

    /**
     * Add plural formated text to textarea
     *
     * @return {void}
     * @api private
     */

    _addPluralFormatedText: function() {
      var variable = 'variable';
      if(this.model.get('variables').length === 1) {
        variable = this.model.get('variables')[0];
      }
      var text = '{' + variable + ', plural,';
      var keywords =  Object.keys(this.model.get('pluralRules'));
      for(var index = 0; index < keywords.length; index++) {
        text +=  ' ' + keywords[index] + ' {message-' + keywords[index] + '}';
      }
      text += '}';
      this._replaceTextSelectionWithText(text);
      var exampleText = 'Example numbers of CLDR\'s plural forms:<br>';
      var pluralRules = this.model.get('pluralRules');
      for(var rule in pluralRules) {
        exampleText += '<b>' + rule + '</b>: ' + pluralRules[rule].example.slice(0, 4).join(', ') + ' ';
      }
      exampleText += '<br>';
      exampleText += 'For more info please checkout our <a href="http://l10ns.org/docs.html#pluralformat" target="_blank">docs</a>.';
      this.$messageText.removeClass('has-error').html(exampleText);
    },

    /**
     * Add select formated text to textarea
     *
     * @return {void}
     * @api private
     */

    _addSelectFormatedText: function() {
      var variable = 'variable';
      if(this.model.get('variables').length === 1) {
        variable = this.model.get('variables')[0];
      }
      var text = '{' + variable + ', select , other {message-other}}';
      this._replaceTextSelectionWithText(text);
      var exampleText = 'Please add the missing cases in your select format.';
      exampleText += '<br>';
      exampleText += 'For more info please checkout our <a href="http://l10ns.org/docs.html#selectformat" target="_blank">docs</a>.';
      this.$messageText.removeClass('has-error').html(exampleText);
    },

    /**
     * Add select ordinal formated text to textarea
     *
     * @return {void}
     * @api private
     */

    _addSelectordinalFormatedText: function() {
      var variable = 'variable';
      if(this.model.get('variables').length === 1) {
        variable = this.model.get('variables')[0];
      }
      var text = '{' + variable + ', selectordinal,';
      var keywords =  Object.keys(this.model.get('ordinalRules'));
      for(var index = 0; index < keywords.length; index++) {
        text +=  ' ' + keywords[index] + ' {message-' + keywords[index] + '}';
      }
      text += '}';
      this._replaceTextSelectionWithText(text);
      var exampleText = 'Example numbers of CLDR\'s ordinal forms:<br>';
      var ordinalRules = this.model.get('ordinalRules');
      for(var rule in ordinalRules) {
        exampleText += '<b>' + rule + '</b>: ' + ordinalRules[rule].example.slice(0, 4).join(', ') + ' ';
      }
      exampleText += '<br>';
      exampleText += 'For more info please checkout our <a href="http://l10ns.org/docs.html#selectordinalformat" target="_blank">docs</a>.';
      this.$messageText.removeClass('has-error').html(exampleText);
    },

    /**
     * Add number formated text to textarea
     *
     * @return {void}
     * @api private
     */

    _addNumberFormatedText: function() {
      var variable = 'variable';
      if(this.model.get('variables').length === 1) {
        variable = this.model.get('variables')[0];
      }
      var text = '{' + variable + ', number, integer}'
      this._replaceTextSelectionWithText(text);
      this.$messageText.removeClass('has-error').html(
        'You can provide integer, percentage, permille and a decimal pattern ' +
        'as an argument. For greater customization please use <a href="http://' +
        'l10ns.org/docs.html#decimalpattern" target="_blank">decimal pattern</a>.'
      );
    },

    /**
     * Add number formated text to textarea
     *
     * @return {void}
     * @api private
     */

    _addCurrencyFormatedText: function() {
      var variable = 'variable';
      if(this.model.get('variables').length === 1) {
        variable = this.model.get('variables')[0];
      }
      var text = '{' + variable + ', currency, local, symbol}'
      this._replaceTextSelectionWithText(text);
      this.$messageText.removeClass('has-error').html(
        'Arguments should be a <b>local</b>(context) <b>symbol</b>(type) for <b>$</b><br>' +
        'Arguments should be a <b>global</b>(context) <b>symbol</b>(type) for <b>US$</b><br>' +
        'Arguments should be a <b>local</b>(context) <b>text</b>(type) for <b>dollar</b><br>' +
        'Arguments should be a <b>global</b>(context) <b>text</b>(type) for <b>US dollar</b><br>' +
        'For more info please checkout our <a href="http://l10ns.org/docs.html#currencyformat" target="_blank">docs</a>.'
      );
    },

    /**
     * Add date formated text to textarea
     *
     * @return {void}
     * @api private
     */

    _addDateFormatedText: function() {
      var variable = 'variable';
      if(this.model.get('variables').length === 1) {
        variable = this.model.get('variables')[0];
      }
      var text = '{' + variable + ', date, yyyy-MM-dd HH:mm:ss}'
      this._replaceTextSelectionWithText(text);
      this.$messageText.removeClass('has-error').html(
        'Format date values with date identifiers. For more info please checkout our <a href="http://l10ns.org/docs.html#dateformat" target="_blank">docs</a>.'
      );
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
      this.$addSelectordinalButton = this.$('.localization-action-selectordinal');
      this.$addNumberButton = this.$('.localization-action-number');
      this.$addCurrencyButton = this.$('.localization-action-currency');
      this.$addDateButton = this.$('.localization-action-date');
      this.$messageText = this.$('.localization-message-text');
      this.$buttons = this.$('.localization-buttons');
      this.$save = this.$('.localization-save');
      this.$arrowLeft = $('.localization-arrow-left-link');
      this.$arrowRight = $('.localization-arrow-right-link');
      this.$loadingCanvas = this.$('.localization-loading-canvas');
      this.$variable = this.$('.localization-variable');
    },

    /**
     * Save
     *
     * @delegate
     */

    _save: function(event) {
      var _this = this;

      if(Date.now() - this._lastSave < 1000) {
        return;
      }

      this._lastSave = Date.now();

      var sinusWave = new SinusWave;
      sinusWave.setCanvas(this.$loadingCanvas[0]);
      sinusWave.start();
      minTimer.start(1000);
      this.$buttons.removeClass('is-revealed').addClass('is-hidden');

      event.preventDefault();
      this.model.save(null, {
        success: function(model, response, options) {
          minTimer.end(function() {
            sinusWave.stop();
            _this.$buttons.removeClass('is-hidden').addClass('is-revealed');
            _this.$messageText.removeClass('has-error').html(_this.model.get('l10ns').message);
          });
        },
        error: function(model, response, options) {
          minTimer.end(function() {
            sinusWave.stop();
            _this.$buttons.removeClass('is-hidden').addClass('is-revealed');
            _this.$messageText.addClass('has-error').html(response);
          });
        }
      });
    },

    _changeField: function (event) {
      var _this = this;
      var id = event.currentTarget.getAttribute('data-id');
      var key = encodeURI(event.currentTarget.getAttribute('data-key').replace(/\s/g, '-'));

      setTimeout(function() {
        app.navigate('/' + app.language + '/l/' + id + '/' + key);
      }, 400);
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
     * On finish rendering callback
     *
     * @return {void}
     * @handler
     * @api public
     */

    onFinishRendering: function() {
      var _this = this;

      this.$region.show();

      setTimeout(function() {
        _this.$region.removeClass('is-hidden').addClass('is-revealed');
      }, 400);
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
