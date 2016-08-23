"use strict";
const net = require('net');
const socketPath = '/tmp/mysocket';
const client = net.createConnection('/tmp/l10ns.sock');
client.setEncoding('utf8');
client.on('connect', () => {
    client.write('he');
});
client.on('data', (data) => {
    console.log(data);
});
//# sourceMappingURL=LocalizationServer.js.map