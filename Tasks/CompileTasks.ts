import { exec } from 'child_process';

function run(grunt: IGrunt) {
    grunt.registerTask('compile-tasks', (done: () => void) => {
        const cmd = 'cat Build/Tasks/GenerateDiagnostics.js Build/Binaries/L10ns.js > Build/Tasks/GenerateDiagnostics.Bundle.js';
        console.log(cmd);
        exec(cmd, (_err, stdout, _) => {
            console.log(stdout);
            done();
        });
    });
}

module.exports = run;
