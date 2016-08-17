
import net = require('net');
import fs = require('fs');

const socketPath = '/tmp/mysocket';
const client = net.createConnection('/tmp/l10ns.sock');

client.setEncoding('utf8');
client.on('connect', () => {
	client.write('he');
});

client.on('data', (data: any) => {
	console.log(data);
});
