import { spawn, execSync } from 'child_process';

function run(grunt: IGrunt) {
    grunt.registerTask('test', function() {
        const done = this.async();
        const compileSourceCmd = 'grunt compile-source';
        console.log(compileSourceCmd);
        execSync(compileSourceCmd);
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
    });
}

module.exports = run;
