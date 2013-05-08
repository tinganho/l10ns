if( typeof define !== "function" ) {
  var define = require( "amdefine" )( module );
}
define(function() {
  var t = {
    "It can have an if and else statement": function anonymous(it) {
      if( it.number > 1 ) {
        return "Number is " + it.number + "";
      }
      else {
        return "Number is smaller than 2";
      }
    },
    "It can have an if and else if and else statements": function anonymous(it) {
      if( it.number === 3 ) {
        return "Number is exactly 3";
      }
      else if( it.number > 1 ) {
        return "Number is <p>" + it.number + "</p>";
      }
      else {
        return "Number is smaller than 2";
      }
    },
    "It can have only one string": function anonymous(it) {
      return "Hello " + it.world + "!";
    },
    "It can take && in if statement": function anonymous(it) {
      if( it.firstname === "Tingan" && it.lastname === "Ho" ) {
        return "Hello " + it.firstname + " " + it.lastname + "!";
      }
      else {
        return "Firstname and last is not Tingan Ho";
      }
    },
    "It can take || in if statement": function anonymous(it) {
      if( it.firstname === "Tingan" || it.lastname === "Ho" ) {
        return "Hello " + it.firstname + " " + it.lastname + "!";
      }
      else {
        return "Firstname and last is not Tingan Ho";
      }
    },
    "It can take several && in if statement": function anonymous(it) {
      if( it.firstname === "Tingan" && it.lastname === "Ho" && it.lastname === "Ho" ) {
        return "Hello " + it.firstname + " " + it.lastname + "!";
      }
      else {
        return "Firstname and last is not Tingan Ho";
      }
    },
    "It can take several || in if statement": function anonymous(it) {
      if( it.firstname === "Tingan" || it.lastname === "Ho" || it.lastname === "Ho" ) {
        return "Hello " + it.firstname + " " + it.lastname + "!";
      }
      else {
        return "Firstname and last is not Tingan Ho";
      }
    },
    "It can have <>": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have <>";
    },
    "It can have ..": function anonymous(it) {
      return "oiuner";
    },
    "It can have ,,": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have ,,";
    },
    "It can have ::": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have ::";
    },
    "It can have ;;": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have ;;";
    },
    "It can have ’’": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have ’’";
    },
    "It can have __": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have __";
    },
    "It can have &&": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have &&";
    },
    "It can have %%": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have %%";
    },
    "It can have $$": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have $$";
    },
    "It can have €€": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have €€";
    },
    "It can have ##": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have ##";
    },
    "It can have ??": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have ??";
    },
    "It can have !!": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have !!";
    },
    "It can have ()": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have ()";
    },
    "It can have @@": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have @@";
    },
    "It can have ^^": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have ^^";
    },
    "It can have ´´": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have ´´";
    },
    "It can have ``": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have ``";
    },
    "It can have ==": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have ==";
    },
    "It can have ++": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have ++";
    },
    "It can have --": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have --";
    },
    "It can have **": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have **";
    },
    "It can have //": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have //";
    },
    "It can have '": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have '";
    },
    "It can have \"": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have \"";
    },
    "Edit me": function anonymous(it) {
      return "Helloworld";
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
