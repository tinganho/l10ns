/// <reference path='../Source/Service/System.ts'/>
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const child_process_1 = require("child_process");
function run(grunt) {
    grunt.registerTask('test', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const done = this.async();
            grunt.task.run('compile-tests');
            let env = process.env;
            env.TESTING = true;
            const options = [
                'Build/Binaries/RunTests.js',
                '--colors',
            ];
            const runTestsCmd = 'node_modules/.bin/mocha';
            console.log(runTestsCmd, options.join(' '));
            let hasError = false;
            let cmdEmitter = child_process_1.spawn(runTestsCmd, options, { env: env });
            cmdEmitter.stdout.on('data', (data) => {
                process.stdout.write(data.toString());
            });
            cmdEmitter.stderr.on('data', function (data) {
                hasError = true;
                process.stderr.write(data.toString());
            });
            cmdEmitter.on('exit', function (code) {
                if (code !== 0 || hasError) {
                    return grunt.fail.warn('Test failed', code);
                }
                grunt.log.ok('child process exited with code ' + code);
                done();
            });
            return undefined;
        });
    });
}
module.exports = run;
