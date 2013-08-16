return function(translationKey) {
  if(!(translationKey in t)) {
    console.log('You have used an undefined translation key:' + translationKey);
    return false;
  }
  delete arguments[0];
  if('1' in arguments) {
    arguments[0] = arguments[1];
  }
  delete arguments[1];
  return t[translationKey].apply(undefined, arguments);
};
