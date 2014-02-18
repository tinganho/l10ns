window.cf = (function() { var configs = {
  "NAMESPACE": "cf",
  "MIN_PAGE_LOAD_TIME": 500,
  "MOBILE_WIDTH": 500,
  "TOUCH_OUT_OF_RANGE": 10,
  "AJAX_TIMEOUT": 10000,
  "X_REQUESTED_BY": "1"
};for(var key in configs) { if(/REGEX/.test(key)) { configs[key] = new RegExp(configs[key]); } }return configs; })();