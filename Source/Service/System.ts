
namespace L10ns {
    const _fs = require('fs');
    const _path = require('path');
    const _exec = require('child_process').exec;
    const _glob = require('glob');
    const _mkdirp = require('mkdirp');
    const _mv = require('mv');
    const _cpr = require('cpr');
    const _rimraf = require('rimraf');

    export const rootDir = joinPath(__dirname, '../../');

    export async function readFile(file: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            _fs.readFile(file, { encoding: 'utf8' }, (err: Error, content: string) => {
                if (err) {
                    return reject(err);
                }
                resolve(content);
            });
        });
    }

    export async function writeFile(file: string, content: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
        _fs.writeFile(file, content, { encoding: 'utf8' }, (err: Error) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    export function joinPath(path: string, ...paths: string[]): string {
        return _path.join(path, ...paths);
    }

    export async function createFolder(folder: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            _mkdirp(folder, (err: Error) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    export async function copyFolder(from: string, to: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            _cpr(from, to, (err: Error) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    export function remove(path: string): void {
        _rimraf.sync(path);
    }

    export function exists(path: string): boolean {
        try {
            _fs.lstatSync(path);
            return true;
        }
        catch(err) {
            return false;
        }
    }

    export async function moveFolder(from: string, to: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            _mv(from, to, (err: Error) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    export function runCommand(cmd: string, quiet = false): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!quiet) {
                write(cmd);
            }
            _exec(cmd, (err: any, stdout: string, stderr: string) => {
                if (err || stderr) {
                    return reject(stderr || stdout);
                }
                if (!quiet) {
                    write(stdout);
                }

                resolve(stdout);
            });
        });
    }

    export function findFiles(query: string, fromDir?: string): string[] {
        return _glob.sync(query, fromDir ? { cwd: fromDir, mark: true } : undefined);
    }

    export function write(msg: string) {
        console.log(msg);
    }
}
module.exports.L10ns = L10ns;