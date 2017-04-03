
import jayson = require('jayson');
import fs = require('fs');

function sendFinishStatus() {
    fs.createWriteStream('', { fd: 4 }).write('1');
}

const server = jayson.server({
    sync: (params: any, callback: Function) => {
        callback(null, "Hello " + params['name']);
    }
});

server.http().listen(8383, () => {
    sendFinishStatus();
});