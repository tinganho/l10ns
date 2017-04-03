declare module 'jayson' {
    import http = require('http');

    class Jayson {
        client: string;
        server: any;
    }

    const jayson: Jayson;

    export = jayson;
}