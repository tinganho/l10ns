
/// <reference path='../Source/Service/System.ts'/>

import { spawn } from 'child_process';

function run(grunt: IGrunt) {
    grunt.registerTask('test', async function() {
        const done = this.async();
        const compileSourceCmd = 'grunt compile-source';
        try {
            await L10ns.runCommand(compileSourceCmd, /* stdoutIsError */true);
        }
        catch(err) {
            grunt.log.error('Compiled source failed.');
            return grunt.log.error(err);
        }
        const compileTestsCmd = 'grunt compile-tests';
        try {
            await L10ns.runCommand(compileTestsCmd, /* stdoutIsError */true);
        }
        catch(err) {
            grunt.log.error('Compiled test failed.');
            return grunt.log.error(err);
        }
        let env = process.env;
        env.TESTING = true;
        const options = [
            'Build/Binaries/RunTests.js',
            '--colors',
        ];
        const runTestsCmd = 'node_modules/.bin/mocha';
        console.log(runTestsCmd, options.join(' '));
        let cmdEmitter = spawn(runTestsCmd, options, { env: env });
        cmdEmitter.stdout.on('data', (data: any) => {
            process.stdout.write(data.toString());
        });
        cmdEmitter.stderr.on('data', function (data: any) {
            process.stderr.write(data.toString());
        });
        cmdEmitter.on('exit', function(code: any) {
            if (code !== 0) {
                return grunt.fail.warn('Test failed', code);
            }
            grunt.log.ok('child process exited with code ' + code);
            done();
        });
        return undefined;
    });
}

module.exports = run;
