
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}
if(inServer) {
  var file = require('../../../libraries/file');
  var MessageFormat = require('../../../libraries/MessageFormat');
}

define(function(require) {
  var Backbone = require('backbone')
    , Model = inServer ? require('../../libraries/Model') : require('Model')
    , Collection = inServer ? require('../../libraries/Collection') : require('Collection')
    , _ = require('underscore');

  if(inClient) {
    var request = require('request')
  }
  else {
    Backbone = require('backbone-relational');
  }

  var Constructor = Model.extend({

    /**
     * Parse raw data
     *
     * @param {JSON} json
     * @return {void}
     * @api private
     */

    _parse: function(json) {
      this.set(json);
    },

    /**
     * Default values
     *
     * @type {Object}
     */

    defaults: {
      key: null,
      variables: [],
      timestamp: null,
      new: false,

      l10ns: {
        message: 'Use <a href="http://l10ns.org/docs.html#messageformat" target="_blank">message format</a> to localize your string above. Click on the help buttons on the toolbar to get help on different formats.',
        save: 'Save',
        variables: 'VARIABLES:',
        inDefaultLocale: 'IN DEFAULT LOCALE:'
      }
    },

    /**
     * Sync
     *
     * @delegate
     */

    sync: function(method, model, options, requestData) {
      if(method === 'read') {
        if(inServer) {
          this._handleReadRequestFromServer(model, options, requestData);
        }
        else {
          this._handleReadRequestFromClient(model, options, requestData);
        }
      }
      else if(method === 'update') {
        if(inClient) {
          this._handleUpdateRequestFromClient(model, options, requestData);
        }
      }
    },

    /**
     * Handle update request from client
     *
     * @param {Model} model
     * @param {Object} options
     * @param {Request} requestData
     * @return {void}
     * @api private
     */

    _handleUpdateRequestFromClient: function(model, options, requestData) {
      var id = window.location.pathname.split('/')[3]
        , json = this.toL10nsJSON();

      request
        .put('/api/' + app.language + '/l/' + id)
        .send(json)
        .end(function(error, response) {
          if(!error && response.status === 200) {
            var localizationInList = app.models.localizations.get(json.id);
            if(localizationInList) {
              localizationInList.set(json);
            }

            if(typeof options.success === 'function') {
              options.success();
            }
          }
          else {
            options.error(response.text);
          }
        });
    },

    /**
     * Handle read request from client
     *
     * @param {Model} model
     * @param {Object} options
     * @param {Request} requestData
     * @return {void}
     * @api private
     */

    _handleReadRequestFromClient: function(model, options, requestData) {
      var _this = this
        , id = window.location.pathname.split('/')[3];

      var $json = $('.js-json-localization');
      if($json.length) {
        this._parse(JSON.parse(_.unescape($json.html())));
        $json.remove();
        options.success();
        return;
      }
      request
        .get('/api/' + app.language + '/l/' + id)
        .end(function(err, res) {
          var localization = res.body;
          _this._parse(localization);
          app.document.set('title', app.language + ' | ' + localization.key);
          app.document.set('description', 'Edit ' + localization.key + ' in locale ' + app.language);
          options.success();
        });
    },

    /**
     * Handle read request from server
     *
     * @param {Model} model
     * @param {Object} options
     * @param {Request} requestData
     * @return {void}
     * @api private
     */

    _handleReadRequestFromServer: function(model, options, requestData) {
      var _this = this;

      file.readLocalizations()
        .then(function(localizations) {
          var locale = requestData.param('locale')
            , id = requestData.param('id')
            , localizationsWithRequestedLocale = file.localizationMapToArray(localizations)[locale]
            , localizationWithRequestedLocale = _.findWhere(localizationsWithRequestedLocale, { id : id });

          if(localizationWithRequestedLocale) {
            _this._parse(localizationWithRequestedLocale);
            var messageFormat = new MessageFormat(locale);
            _this.set('pluralRules', messageFormat.pluralRules);
            _this.set('ordinalRules', messageFormat.ordinalRules);
            if(locale !== project.defaultLanguage) {
              var localizationsWithDefaultLocale = file.localizationMapToArray(localizations)[project.defaultLanguage]
                , localizationWithDefaultLocale = _.findWhere(localizationsWithDefaultLocale, { id : id });
              _this.set('message', 'In ' + project.defaultLanguage + ': ' + localizationWithDefaultLocale.value);
            }
            else {
              _this.set('message', _this.get('l10ns').message);
            }

            _this.setPageTitle(locale + ' | ' + localizationWithRequestedLocale.key);
            _this.setPageDescription('Edit ' + localizationWithRequestedLocale.key + ' in locale ' + locale);
            options.success();
          }
          else {
            options.error(new TypeError('localization with id:' + requestData.param('id') + ' not found'));
          }
        })
        .fail(function(error) {
          options.error(error);
        });
    },

    /**
     * On history push to `/`. We want to change the `revealed` property
     * to true.
     *
     * @delegate
     */

    onHistoryChange: function(path) {
      if(/^[a-z]{2}\-[A-Z]{2}\/t\//.test(path)) {
        this.setMeta('revealed', true);
        this.setPageTitle('Localization')
        this.setPageDescription('Edit localization');
      }
      else {
        this.setMeta('revealed', false);
      }
    },

    /**
     * We will ovverride the default implementation of `toJSON` method
     * because the relations is not mapped according to the server
     * implementation. Relations `Conditions`, `Inputs`, `Else` need to
     * under the property `values`
     *
     * @override
     */

    toL10nsJSON: function() {
      var json = Model.prototype.toJSON.call(this);

      json = this._removeJSONLocalizedStrings(json);

      return json;
    },

    /**
     * Remove JSON localizaed strings
     *
     * @param {JSON} json
     * @return {JSON}
     * @api private
     */

    _removeJSONLocalizedStrings: function(json) {
      delete json.l10ns;
      delete json.pluralRules;
      delete json.ordinalRules;
      delete json.message;

      return json;
    }
  });

  return Constructor;
});
