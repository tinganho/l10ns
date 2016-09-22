import { exec } from 'child_process';
import { defaultOptions } from './CommandOptions';

function run(grunt: IGrunt) {
    grunt.registerTask('compile-tests', function() {
        const done = this.async();
        const testSource = [
            'Source/TestFramework/MessageFormatTestRunner.ts',
            'Source/TestFramework/ProjectTestRunner.ts',
            'Source/TestFramework/TestRunner.ts',
        ].join(' ');
        const options = [
            '--outFile Build/Binaries/Tests.js',
        ].concat(defaultOptions).join(' ');
        const compileTestCmd = `tsc ${testSource} ${options}`;
        const bundleSource = [
            'Build/Binaries/L10ns.js',
            'Build/Binaries/Tests.js',
        ].join(' ');
        const bundleCmd = `cat ${bundleSource} > Build/Binaries/RunTests.js`;
        grunt.task.run('compile-source');
        console.log(compileTestCmd);
        exec(compileTestCmd, (err, stdout, stderr) => {
            if (err || stderr) {
                console.error(stderr || stdout || (err.message + err.stack));
                return;
            }
            if (stdout) {
                console.log(stdout);
            }
            console.log(bundleCmd);
            exec(bundleCmd, (err, stdout, stderr) => {
                if (err || stderr) {
                    console.error(stderr || stdout || (err.message + err.stack));
                    done(false);
                    return;
                }
                if (stdout) {
                    console.log(stdout);
                }
                done();
            });
        });
    });
}

module.exports = run;
