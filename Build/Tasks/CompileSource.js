"use strict";
const child_process_1 = require("child_process");
const CommandOptions_1 = require("./CommandOptions");
function run(grunt) {
    grunt.registerTask('compile-source', function () {
        const done = this.async();
        const generateDiagnosticsCmd = 'grunt generate-diagnostics';
        console.log(generateDiagnosticsCmd);
        child_process_1.execSync(generateDiagnosticsCmd);
        const compileSource = [
            'Source/Service/Core.ts',
            'Source/Service/DiagnosticMessages.Generated.ts',
            'Source/Service/Program.ts',
            'Source/Service/Scanner.ts',
            'Source/Service/System.ts',
            'Source/Service/Types.ts',
        ].join(' ');
        const options = [
            '--outFile Build/Binaries/L10ns.js',
            '--module amd',
        ].concat(CommandOptions_1.defaultOptions).join(' ');
        const compileCmd = `tsc ${compileSource} ${options}`;
        console.log(compileCmd);
        child_process_1.exec(compileCmd, (err, stdout, stderr) => {
            if (err || stderr) {
                console.error(stderr || (err.message + err.stack));
                return;
            }
            console.log(stdout);
            done();
        });
    });
}
module.exports = run;
