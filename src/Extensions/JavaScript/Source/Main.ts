
import net = require('net');
import fs = require('fs');

function sendFinishStatus() {
    fs.createWriteStream('', { fd: 4 }).write('1');
}

const server = net.createServer((client) => {
    client.setEncoding('utf8');
    client.on('data', (data) => {
        const json = JSON.parse(data.toString());

        client.write(JSON.stringify({
            id: json.id,
            jsonrpc: '2.0',
            result: 'some',
        }));
    });
    client.pipe(client);
});

process.on('SIGTERM', () => {
    server.close(() => {
        fs.stat('/tmp/l10ns.sock', (err) => {
            if (!err) {
                fs.unlinkSync('/tmp/l10ns.sock');
            }
        });
    });
});

server.listen('/tmp/l10ns.sock', () => {
    sendFinishStatus();
});
