"use strict";
const child_process_1 = require("child_process");
function run(grunt) {
    grunt.registerTask('compile-tasks', (done) => {
        const cmd = 'cat Build/Tasks/GenerateDiagnostics.js Build/Binaries/L10ns.js > Build/Tasks/GenerateDiagnostics.Bundle.js';
        console.log(cmd);
        child_process_1.exec(cmd, (_err, stdout, _) => {
            console.log(stdout);
            done();
        });
    });
}
module.exports = run;
