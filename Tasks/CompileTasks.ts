import { exec } from 'child_process';
import { defaultOptions } from './CommandOptions';

function run(grunt: IGrunt) {
    grunt.registerTask('compile-tasks', function() {
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
        ].concat(defaultOptions).join(' ');
        const compileCmd = `tsc ${compileSource} ${options}`;
        console.log(compileCmd);
        exec(compileCmd, (err, stdout, stderr) => {
            if (err || stderr) {
                console.error(stderr || stdout || (err.message + err.stack));
                return;
            }
            if (stdout) {
                console.log(stdout);
            }
            const catCmd = 'cat Build/Tasks/GenerateDiagnostics.js Build/Binaries/L10ns.js > Build/Tasks/GenerateDiagnostics.Bundle.js';
            console.log(catCmd);
            exec(catCmd, (err, stdout, stderr) => {
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
