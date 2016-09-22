"use strict";
const child_process_1 = require("child_process");
const CommandOptions_1 = require("./CommandOptions");
function run(grunt) {
    grunt.registerTask('compile-tests', function () {
        const done = this.async();
        const testSource = [
            'Source/TestFramework/MessageFormatTestRunner.ts',
            'Source/TestFramework/ProjectTestRunner.ts',
            'Source/TestFramework/TestRunner.ts',
        ].join(' ');
        const options = [
            '--outFile Build/Binaries/Tests.js',
        ].concat(CommandOptions_1.defaultOptions).join(' ');
        const compileTestCmd = `tsc ${testSource} ${options}`;
        const bundleSource = [
            'Build/Binaries/L10ns.js',
            'Build/Binaries/Tests.js',
        ].join(' ');
        const bundleCmd = `cat ${bundleSource} > Build/Binaries/RunTests.js`;
        const compileSourceCmd = 'grunt compile-source';
        console.log(compileSourceCmd);
        child_process_1.exec(compileSourceCmd, () => {
            console.log(compileTestCmd);
            child_process_1.exec(compileTestCmd, (err, stdout, stderr) => {
                if (err || stderr) {
                    console.error(stderr || stdout || (err.message + err.stack));
                    return;
                }
                if (stdout) {
                    console.log(stdout);
                }
                console.log(bundleCmd);
                child_process_1.exec(bundleCmd, (err, stdout, stderr) => {
                    if (err || stderr) {
                        console.error(stderr || stdout || (err.message + err.stack));
                        return;
                    }
                    if (stdout) {
                        console.log(stdout);
                    }
                    done();
                });
            });
        });
    });
}
module.exports = run;
