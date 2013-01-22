if( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}
define(function() {
  var t = {
    "grunt-translate can take more then two conditions": function anonymous(property1,property2) {
      if( property1 > 1 && property1 === 2 ) {
        return "Hello people!";
      }
      else {
        return "Hello " + property2 + "!";
      }
    },
    "grunt-translate can have an if and else if and alse statements": function anonymous(property1,property2) {
      if( property1 > "constant" && property2 === property1 ) {
        return "Hello " + property1 + " " + property2 + "";
      }
      else if( property2 > "iuhgu" ) {
        return "Hello " + property2 + "";
      }
      else {
        return "Hello " + property1 + "";
      }
    },
    "grunt-translate can take more then ": function anonymous(property1,property2) {
      if( property1 > "constant" && property2 === property1 ) {
        return "Hello " + property1 + " " + property2 + "";
      }
      else if( property2 > "iuhgu" ) {
        return "Hello " + property2 + "";
      }
      else {
        return "Hello " + property1 + "";
      }
    },
    "grunt-translate can take more then two ": function anonymous(property1,property2) {
      if( property1 > "constant" && property2 === property1 ) {
        return "Hello " + property1 + " " + property2 + "";
      }
      else if( property2 > "iuhgu" ) {
        return "Hello " + property2 + "";
      }
      else {
        return "Hello " + property1 + "";
      }
    },
    "you are so hansome": function anonymous(name,property2) {
      if( name > property2 ) {
        return "You are so handsome";
      }

    },
    "you are not so hansome": function anonymous(name,property2) {
      return "You are not so handsome";
    }
  };
  return function(hashkey) {
    delete arguments[0];
    for(var i in arguments) {
      if(arguments.hasOwnProperty(i)){
        arguments[i - 1] = arguments[i];
      }
    }
    return t[hashkey].apply(undefined, arguments);
  };
});
