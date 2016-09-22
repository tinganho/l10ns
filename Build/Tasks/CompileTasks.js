"use strict";
const child_process_1 = require("child_process");
const CommandOptions_1 = require("./CommandOptions");
function run(grunt) {
    grunt.registerTask('compile-tasks', function () {
        const done = this.async();
        const compileSource = [
            'Tasks/AcceptBaselines.ts',
            'Tasks/CommandOptions.ts',
            'Tasks/compileSource.ts',
            'Tasks/CompileTasks.ts',
            'Tasks/CompileTests.ts',
            'Tasks/Diff.ts',
            'Tasks/GenerateDiagnostics.ts',
            'Tasks/RunTests.ts',
        ].join(' ');
        const options = [
            '--outDir Build',
            '--module commonjs',
        ].concat(CommandOptions_1.defaultOptions).join(' ');
        const compileCmd = `tsc ${compileSource} ${options}`;
        console.log(compileCmd);
        child_process_1.exec(compileCmd, (err, stdout, stderr) => {
            if (err || stderr) {
                console.error(stderr || stdout || (err.message + err.stack));
                return;
            }
            if (stdout) {
                console.log(stdout);
            }
            const catCmd = 'cat Build/Tasks/GenerateDiagnostics.js Build/Binaries/L10ns.js > Build/Tasks/GenerateDiagnostics.Bundle.js';
            console.log(catCmd);
            child_process_1.exec(catCmd, (err, stdout, stderr) => {
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
}
module.exports = run;
