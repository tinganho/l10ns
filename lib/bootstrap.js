var GruntTranslate = {};
GruntTranslate.update = function(options){
  require('./bootstrap/update')(options);
};
GruntTranslate.compile = function(options){
  require('./bootstrap/compile')(options);
};
GruntTranslate.log = function(options, silent){
  return require('./bootstrap/log')(options, silent);
};
GruntTranslate.search = function(options){
  require('./bootstrap/search')(options);
};
GruntTranslate.interface = function(){
  require('../app/server').server();
};
module.exports = GruntTranslate;

