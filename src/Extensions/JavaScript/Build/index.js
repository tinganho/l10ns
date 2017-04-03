"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jayson = require("jayson");
const fs = require("fs");
function sendFinishStatus() {
    fs.createWriteStream('', { fd: 4 }).write('1');
}
const server = jayson.server({
    sync: (params, callback) => {
        callback(null, "Hello " + params['name']);
    }
});
server.http().listen(8383, () => {
    sendFinishStatus();
});
