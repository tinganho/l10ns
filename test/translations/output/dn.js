if( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}
define(function() {
  var t = {
    "It can have an if and else statement": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have an if and else statement";
    },
    "It can have an if and else if and else statements": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have an if and else if and else statements";
    },
    "It can have only one string": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have only one string";
    },
    "It can take && in if statement": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can take && in if statement";
    },
    "It can take || in if statement": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can take || in if statement";
    },
    "It can take several && in if statement": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can take several && in if statement";
    },
    "It can take several || in if statement": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can take several || in if statement";
    },
    "It can have html <p></p><h1></h1>": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have html <p></p><h1></h1>";
    }
  };
  return function(translationKey) {
    if(!(translationKey in t)) {
      console.log("You have used an undefined translation key:" + translationKey);
      return false;
    }
    delete arguments[0];
    if("1" in arguments) {
      arguments[0] = arguments[1];
    }
    delete arguments[1];
    return t[translationKey].apply(undefined, arguments);
  };
});
