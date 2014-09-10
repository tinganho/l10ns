
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}
if(inServer) {
  var file = require('../../../libraries/file');
}

define(function(require) {
  var Backbone = require('backbone')
    , Model = inServer ? require('../../libraries/Model'): require('Model')
    , Collection = inServer ? require('../../libraries/Collection'): require('Collection')
    , _ = require('underscore');

  if(inClient) {
    var request = require('request')
  }
  else {
    var MessageFormat = require('../../../libraries/MessageFormat');
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
        message: 'Use <a>message format</a> to localize your string above. Click on the help buttons on the toolbar to get help on different formats.',
        save: 'Save',
        variables: 'VARIABLES:',
        successFullyUpdated: 'Successfully updated!'
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
        .put('/api/' + app.locale + '/l/' + id)
        .send(json)
        .end(function(error, response) {
          if(!error && response.status === 200) {
            app.models.localizations.get(json.id).set(json);
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
        this._parse(JSON.parse($json.html()));
        $json.remove();
        options.success();
        return;
      }
      request
        .get('/api/' + app.locale + '/l/' + id)
        .end(function(err, res) {
          var localization = res.body;
          _this._parse(localization);
          app.document.set('title', app.locale + ' | ' + localization.key);
          app.document.set('description', 'Edit ' + localization.key + ' in locale ' + app.locale);
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
          localizations = file.localizationMapToArray(localizations)[requestData.param('locale')];
          var localization = _.findWhere(localizations, { id: requestData.param('id') });
          if(localization) {
            _this._parse(localization);
            var messageFormat = new MessageFormat(requestData.param('locale'));
            _this.set('pluralRules', messageFormat.pluralRules);
            _this.set('ordinalRules', messageFormat.ordinalRules);
            _this.setPageTitle(requestData.param('locale') + ' | ' + localization.key);
            _this.setPageDescription('Edit ' + localization.key + ' in locale ' + requestData.param('locale'));
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

      return json;
    }
  });

  return Constructor;
});
