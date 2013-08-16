var Hashids = require("hashids"),
    hashids = new Hashids('wewfeewewffepojefpwjefipewj', 8);

var hash = hashids.encrypt('12345');
console.log(hash);