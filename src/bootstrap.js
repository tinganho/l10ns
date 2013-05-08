var GruntTranslate = {};


GruntTranslate.update = function(opt){
  require('./modules/update')(opt);
};
GruntTranslate.compile = function(opt){
  require('./modules/compile')(opt);
};
GruntTranslate.log = function(opt, silent, loc){
  return require('./modules/log')(opt, silent, loc);
};
GruntTranslate.search = function(opt, q) {
  var search = new (require('./modules/search'))(opt);
  search.query(q);
};
GruntTranslate.interface = function(){
  require('../app/server').server();
};
GruntTranslate.edit = function(opt, hash, lang, value){
  require('./modules/edit')(opt, hash, lang, value);
};
module.exports = GruntTranslate;

