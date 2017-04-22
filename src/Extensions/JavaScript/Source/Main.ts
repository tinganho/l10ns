
import net = require('net');
import fs = require('fs');
import { extractKeysFromFile } from './KeyExtractor/Extractor';

function sendFinishStatus() {
    fs.createWriteStream('', { fd: 4 }).write('1');
}

interface SyncParams {
    files: string[];
    function_names: string[];
}

interface RPC {
    id: number;
    jsonrpc: '2.0';

}

interface RPCRequest extends RPC {
    method: 'sync' | 'compile';
    params: SyncParams;
}

interface RPCResponse extends RPC {
    result: any;
}

const server = net.createServer((client) => {
    client.setEncoding('utf8');
    client.on('data', (data) => {
        const rpc = JSON.parse(data.toString()) as RPCRequest;

        switch (rpc.method) {
            case 'sync':
                const callExpressionIdentifiers = rpc.params.function_names;
                for (const f of rpc.params.files) {
                    const keys = extractKeysFromFile(f, callExpressionIdentifiers);
                    console.log(keys);
                }
                write(rpc.id, 'some');
                break;
        }
    });
    client.pipe(client);

    function write(id: number, result: any) {
        client.write(JSON.stringify({
            id: id,
            jsonrpc: '2.0',
            result: result,
        } as RPCResponse));
    }
});

process.on('SIGTERM', () => {
    server.close();
});

server.listen('/tmp/l10ns.sock', () => {
    sendFinishStatus();
});
