if( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}
define(function() {
  var t = {
    "hello_world": function anonymous(property1,property2) {
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
    return t[hashkey].apply(undefined, arguments);
  };
});
