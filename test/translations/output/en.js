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
      if( it.number < 2 ) {
        return "Number is " + it.number + "";
      }
      else if( it.number < 1 ) {
        return "Number is " + it.number + "";
      }
      else {
        return "Yes it can";
      }
    },
    "It can have only one string": function anonymous(it) {
      return "Yes it can";
    },
    "It can take && in if statement": function anonymous(it) {
      if( it.firstname > it.lastname ) {
        return "Hello " + it.firstname + " " + it.lastname + "!";
      }
      else {
        return "Number is smaller than 2";
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
    "It can have dot notation in object": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have dot notation in object";
    },
    "share_page_info": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: share_page_info";
    },
    "share_page_join": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: share_page_join";
    },
    "register": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: register";
    },
    "friend_invited_you": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: friend_invited_you";
    },
    "invite_text1": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: invite_text1";
    },
    "It can have <>": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have <>";
    },
    "It can have ..": function anonymous(it) {
      return "cewdeweew";
    },
    "It can have ,,": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have ,,";
    },
    "It can have ::": function anonymous(it) {
      return "w4rfrfrferr";
    },
    "It can have ;;": function anonymous(it) {
      return "feewefwfeew";
    },
    "It can have ’’": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have ’’";
    },
    "It can have __": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have __";
    },
    "It can have &&": function anonymous(it) {
      return "weefe";
    },
    "It can have %%": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have %%";
    },
    "It can have $$": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have $$";
    },
    "It can have €€": function anonymous(it) {
      return "e";
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
      return "ew";
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
      return "poik";
    },
    "It can have '": function anonymous(it) {
      return "owjfjiojefiwjef";
    },
    "It can have \"": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can have \"";
    },
    "Edit me": function anonymous(it) {
      return "Helloworld";
    },
    "TEST_LABEL_THING": function anonymous(it) {
      return "ijfijoijk";
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
