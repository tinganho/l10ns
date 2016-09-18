
namespace L10ns {
    const _fs = require('fs');
    const _path = require('path');
    const _exec = require('child_process').exec;
    const _glob = require('glob')

    export function readFile(file: string): Promise<string> {
        return new Promise((resolve, reject) => {
            _fs.readFile(file, { encoding: 'utf8' }, (err: Error, content: string) => {
                if (err) {
                    reject();
                }
                resolve(content);
            });
        });
    }

    export function writeFile(file: string, content: string): void {
        _fs.writeFileSync(file, content, { encoding: 'utf8' });
    }

    export function joinPath(path: string, ...paths: string[]): string {
        return _path.join(path, ...paths);
    }

    export function runCommand(cmd: string): Promise<string> {
        return new Promise((resolve, reject) => {
            _exec(cmd, (_: any, stdout: string, stderr: string) => {
                if (stderr) {
                    return reject(stderr);
                }

                resolve(stdout);
            });
        });
    }

    export function findFiles(query: string, fromDir?: string): string[] {
        return _glob.sync(query, fromDir ? { cwd: fromDir, mark: true } : undefined);
    }
}
