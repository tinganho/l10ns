var GruntTranslate = {};


GruntTranslate.update = function(opt){
  require('./modules/update')(opt);
};
GruntTranslate.compile = function(opt){
  require('./modules/compile')(opt);
};
GruntTranslate.log = function(opt, silent){
  return require('./modules/log')(opt, silent);
};
GruntTranslate.search = function(opt, q) {
  var search = new (require('./modules/search'))(opt);
  search.query(q);
};
GruntTranslate.interface = function(){
  require('../app/server').server();
};
module.exports = GruntTranslate;

