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
      return "wefefewf";
    },
    "It can take several && in if statement": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can take several && in if statement";
    },
    "It can take several || in if statement": function anonymous(it) {
      return "HASH_NOT_TRANSLATED: It can take several || in if statement";
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
    },
    "TEST_LABEL_THING": function anonymous(it) {
      return "ew";
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
