
/**
 * Module dependencies
 */

var _ = require('underscore')
  , fs = require('fs')
  , path = require('path')
  , _Model = requirejs('lib/Model')
  , _Collection = requirejs('lib/Collection')
  , glob = require('glob')
  , isArray = require('../lib/isArray')
  , importNames = []
  , imports = []
  , pages = [];

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

  this._layout = name;

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

    var Model = require('../' + this.content[name].model)
      , View = require('../' + this.content[name].view);

    if(!Model.prototype.fetch) {
      throw new TypeError(this.content[name].model + ' is not an instance of Model or Collection');
    }

    var model = new Model
      , view = new View(model);

    model.sync = function(method, model, opts) {
      Model.prototype.sync.call(this, method, model, opts, req);
    };

    try {
      model.fetch({
        success : function() {
          view = new View(model)
          content[name] = view.render();

          if(typeof model.page.title === 'string' && model.page.title.length > 0) {
            _this._documentProps.title = model.page.title;
          }
          if(typeof model.page.description === 'string' && model.page.description.length > 0) {
            _this._documentProps.description = model.page.description;
          }

          // Push json scripts
          jsonScripts += coreTmpls.jsonScript({
            name : _this.content[name].model.split('/')[2].toLowerCase(),
            json : JSON.stringify(model.toJSON())
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
        content[name] = view.render();
        n++;
        if(n === size) {
          callback(content, jsonScripts);
        }
      }
      else {
        throw err;
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
  this._addContent();
  this._addPages();
  app.get(this._url, _this._next);
};

/**
 * Next callback
 */

Page.prototype._next = function(req, res) {
  var _this = this;

  this._getContent(function(content, jsonScripts) {
    var html = _this._documentTmpl({
      title : _this._documentProps.title,
      description : _this._documentProps.description,
      noScroll : _this._documentProps.noScroll,
      locale : _this._documentProps.locale,
      styles : _this._documentProps.styles,
      main : _this._documentProps.main,
      jsonScripts : jsonScripts,
      layout : _this._layoutTmpl(content),
      modernizr : cf.MODERNIZR,
      requirejs : cf.REQUIREJS,
      cf : cf.CLIENT_CONF_BUILD + '/cf.js'
    });

    res.send(html);
  }, req);
};

/**
 * Get content name
 *
 * @param {String} path
 * @api private
 */

Page.prototype._getConstructorName = function(path) {
  return _.last(path.split('/'));
};

/**
 * We want to add content to the content varaiable, to compile
 * the composite routers.
 *
 * @param {Object} content
 * @api private
 */

Page.prototype._addContent = function() {
  for(var i in this.content) {
    var content = this.content[i];
    var name = this._getConstructorName(content.model);

    // If content have been stored continue the loop
    if(importNames.indexOf(name) !== -1) {
      continue;
    }

    var _import = {
      model : {
        name : name,
        path : content.model
      },
      view : {
        name : this._getConstructorName(content.view),
        path : content.view
      }
    }
    imports.push(_import);
    importNames.push(name);
  }
};

/**
 * We want to add pages to the pages variable, to compile
 * the composite routers.
 *
 * @param {Object} content
 * @api private
 */

Page.prototype._addPages = function() {
  var path = this._url.substr(1);
  var page = {
    path : path,
    layout : this._layout
  };
  var contents = [], views = [];
  for(var region in this.content) {
    var map = {};
    var model = this._getConstructorName(this.content[region].model);
    map['model'] = model;
    map['view'] = this._getConstructorName(this.content[region].view);
    map['region'] = region;
    map['path'] = path;
    views.push(model.toLowerCase());
    contents.push(map);
  }
  page.contentScript = coreTmpls['contentScript'](contents);
  page.renderScript = coreTmpls['renderScript'](contents);
  page.mapScript = coreTmpls['mapScript'](contents);
  page.noViewsScript = coreTmpls['noViewsScript'](views);
  pages.push(page);
};

/**
 * Export constructor
 */

module.exports = function(url) {
  return new Page(url);
};


module.exports.createCompositeRouter = function() {
  var router = coreTmpls['compositeRouter']({ pages : pages, imports : imports });
  fs.writeFileSync(cf.ROOT_FOLDER + cf.COMPOSITE_ROUTER_PATH, router);
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
