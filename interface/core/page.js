
/**
 * Module dependencies
 */

var _ = require('underscore')
  , fs = require('fs')
  , path = require('path')
  , _Model = requirejs('lib/Model')
  , _Collection = requirejs('lib/Collection')
  , glob = require('glob')
  , isArray = require('../lib/isArray');

/**
 * Add terminal colors
 */

require('terminal-colors');

/**
 * The Page object builds up the whole html for your website.
 * You can specify document, layout, module and components to
 * customize the html you want.
 *
 * @constructor Page
 * @return {Page}
 */

function Page(url) {
  if(typeof url !== 'string'
  && !isArray(url)) {
    throw new TypeError('first parameter must be a string or array of strings');
  }

  this._url = url;
  this._documentTmpls = documentTmpls;
  this._layoutTmpls = layoutTmpls;

  _.bindAll(this, '_next');

  return this;
}

/**
 * Set document
 *
 * @param {String} name
 * @param {Object} opts
 * @return {Page}
 * @api public
 */

Page.prototype.document = function(name, props) {
  if(typeof this._documentTmpls[name] === 'undefined') {
    throw new TypeError('document ' + name + ' does not exist');
  }

  this._documentTmpl = this._documentTmpls[name];

  this._documentProps = requirejs('documents/' + name + 'Props')(this._url);

  return this;
};

/**
 * Set layout
 *
 * @param {String} name
 * @return {Page}
 * @api public
 */

Page.prototype.layout = function(name) {
  if(typeof this._layoutTmpls[name] === 'undefined') {
    throw new TypeError(name + ' layout doesn\'t exists');
  }

  this._layoutTmpl = this._layoutTmpls[name];

  return this;
};

/**
 * Define (modules) views and models
 *
 * @param {Object} modules
 * @return {void}
 * @api public
 */

Page.prototype.content = function(content) {
  this.content = content;
  this._serve();
  return this;
};

/**
 * Get content
 *
 * @param {Function} callback
 * @return {void}
 * @api private
 */

Page.prototype._getContent = function(callback, req) {
  var n = 0, content = {}, _this = this, size = _.size(this.content)
    , jsonScripts = '';

  for(var name in this.content) {
    if(!this.content[name].model) {
      throw new TypeError('name `' + name + '` doesn\'t have a model');
    }
    if(!this.content[name].view) {
      throw new TypeError('name `' + name + '` doesn\'t have a view');
    }

    var Model = require('../content/' + this.content[name].model)
      , View = require('../content/' + this.content[name].view);

    if(!Model.prototype.fetch) {
      throw new TypeError(this.content[name].model + ' is not an instance of Model or Collection');
    }

    if(!View.prototype.template) {
      throw new TypeError(this.content[name].view + ' have no template');
    }

    var model = new Model;

    var view = new View;
    if(!view.template) {
      throw new TypeError(this.content[name].view + ' have no template');
    }

    model.sync = function(method, model, opts) {
      Model.prototype.sync.call(this, method, model, opts, req);
    };

    try {
      model.fetch({
        success : function() {
          var data = {};
          var json = model.toJSON();
          data[name] = json;
          // If collection we need add meta data to the template
          if(typeof model.metas !== 'undefined' && _.size(model.metas) !== 0) {
            data[name].metas = model.metas;
          }
          content[name] = view.template(data[name]);

          if(typeof model.page.title === 'string' && model.page.title.length > 0) {
            _this._documentProps.title = model.page.title;
          }
          console.log(typeof model.page.description)
          if(typeof model.page.description === 'string' && model.page.description.length > 0) {
            console.log('hej')
            _this._documentProps.description = model.page.description;
          }

          // Push json scripts
          jsonScripts += coreTmpls.jsonScript({
            name : name,
            json : JSON.stringify(json)
          });

          n++;
          if(n === size) {
            callback(content, jsonScripts);
          }
        },
        error : this.fail
      });
    }
    catch(err) {
      if(err.message === 'A "url" property or function must be specified') {
        content[name] = view.template(model.toJSON());
        n++;
        if(n === size) {
          callback(content, jsonScripts);
        }
      }
      else {
        console.log(err);
      }
    }

  }
};

/**
 * If something fails it will be forwarded to this callback
 *
 * @callback
 */

Page.prototype.fail = function(callback) {
  this.fail = callback;
};

/**
 * Serve the page
 *
 * @return {void}
 * @api private
 */

Page.prototype._serve = function() {
  var _this = this;

  console.log('page:', this._url);
  app.get(this._url, _this._next);
};

/**
 * Next callback
 */

Page.prototype._next = function(req, res) {
  var _this = this;

  if(this._documentProps.outputRouter && typeof this._documentProps.outputRouter === 'string') {
    this._outputRouter = this._documentProps.outputRouter;
    if(GLOBAL._outputRouters
    && isArray(GLOBAL._outputRouters)) {
      if(GLOBAL._outputRouters.indexOf(opts.outputRouter) !== -1) {
        GLOBAL._outputRouters.push(opts.outputRouter);
      }
    }
    else {
      GLOBAL._outputRouters = [opts.outputRouter];
    }
  }

  this._getContent(function(content, jsonScripts) {
    var html = _this._documentTmpl({
      title : _this._documentProps.title,
      description : _this._documentProps.description,
      locale : _this._documentProps.locale,
      styles : _this._documentProps.styles,
      main : _this._documentProps.main,
      jsonScripts : jsonScripts,
      layout : _this._layoutTmpl(content),
      modernizr : cf.MODERNIZR,
      requirejs : cf.REQUIREJS
    });

    res.send(html);
  }, req);
};

/**
 * Export constructor
 */

module.exports = function(url) {
  return new Page(url);
};

/**
 * Read template
 *
 * @exit if built files doesn't exist
 * @return {void}
 */

module.exports.readTmpls = function() {
  if(!fs.existsSync(path.join(__dirname, '../', cf.DOCUMENT_TEMPLATES + '.js'))) {
    console.log('[:(]'.red + ' Have you built your document templates yet?');
    process.exit();
  }
  if(!fs.existsSync(path.join(__dirname, '../', cf.LAYOUT_TEMPLATES + '.js'))) {
    console.log('[:(]'.red + ' Have you built your layout templates yet?');
    process.exit();
  }

  GLOBAL.documentTmpls = requirejs(cf.DOCUMENT_TEMPLATES);
  GLOBAL.layoutTmpls = requirejs(cf.LAYOUT_TEMPLATES);
  GLOBAL.coreTmpls = requirejs(cf.CORE_TEMPLATES);
};

/**
 * Write router files
 *
 * @return {void}
 */

module.exports.writeRouters = function() {
};
