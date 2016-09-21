import { exec } from 'child_process';
import { defaultOptions } from './CommandOptions';

function run(grunt: IGrunt) {
    grunt.registerTask('compile-tests', function() {
        const done = this.async();
        const compileSource = [
            'Source/TestFramework/ProjectTestRunner.ts',
            'Source/TestFramework/TestRunner.ts',
        ].join(' ');
        const options = [
            '--outFile Build/Binaries/Tests.js',
        ].concat(defaultOptions).join(' ');
        const compileCmd = `tsc ${compileSource} ${options}`;
        const bundleSource = [
            'Build/Binaries/L10ns.js',
            'Build/Binaries/Tests.js',
        ].join(' ');
        const bundleCmd = `cat ${bundleSource} > Build/Binaries/RunTests.js`;
        const compileSourceCmd = 'grunt compile-source';
        console.log(compileSourceCmd);
        exec(compileSourceCmd, () => {
            console.log(compileCmd);
            exec(compileCmd, (err, stdout, stderr) => {
                if (err || stderr) {
                    grunt.log.error(stderr || stdout || (err.message + err.stack));
                    return;
                }
                if (stdout) {
                    console.log(stdout);
                }
                console.log(bundleCmd);
                exec(bundleCmd, (err, stdout, stderr) => {
                    if (err || stderr) {
                        grunt.log.error(stderr || stdout || (err.message + err.stack));
                        return;
                    }
                    if (stdout) {
                        console.log(stdout);
                    }
                    grunt.log.ok('Compilation of tests done!');
                    done();
                });
            });
        });
    });
}

module.exports = run;
