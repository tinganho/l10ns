
import http = require('http');
import { extractKeysFromFile, Key } from './KeyExtractor/Extractor';

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

interface Files {
    [name: string]: Key[];
}

function main() {
    const server = http.createServer((req, res) => {
        let data: Buffer[] = [];
        req.on('data', (chunk: Buffer) => {
            data.push(chunk);
        })
        .on('end', () => {
            const body = Buffer.concat(data).toString();
            const rpc = JSON.parse(body) as RPCRequest;
            switch (rpc.method) {
                case 'sync':
                    const files: Files = {};
                    const callExpressionIdentifiers = rpc.params.function_names;
                    for (const f of rpc.params.files) {
                        const keys = extractKeysFromFile(f, callExpressionIdentifiers);
                        files[f] = keys;
                    }
                    write(rpc.id, files);
                    break;
                case 'compile':
                    break;
                default:
                    throw new Error(`Unknown method '${rpc.method}'`);
            }

            function write(id: number, result: any) {
                res.write(JSON.stringify({
                    id,
                    jsonrpc: '2.0',
                    result,
                } as RPCResponse));
                res.end();
            }
        });
    }).listen(8888);

    process.on('SIGTERM', () => {
        server.close();
        process.exit(0);
    });
}
main();
