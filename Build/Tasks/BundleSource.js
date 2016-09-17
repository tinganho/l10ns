"use strict";
const child_process_1 = require("child_process");
function run(grunt) {
    grunt.registerTask('bundle-source', (done) => {
        const source = [
            'Build/Source/Core.js',
            'Build/Source/Program.js',
            'Build/Source/Scanner.js',
            'Build/Source/System.js',
            'Build/Source/Types.js',
        ].join(' ');
        const cmd = `browserify ${source} -o Build/Binaries/L10ns.js`;
        console.log(cmd);
        child_process_1.exec(cmd, (_err, stdout, _) => {
            console.log(stdout);
            done();
        });
    });
}
module.exports = run;
//# sourceMappingURL=BundleSource.js.map