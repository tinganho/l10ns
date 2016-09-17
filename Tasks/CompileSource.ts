import { exec } from 'child_process';

function run(grunt: IGrunt) {
    grunt.registerTask('compile-source', (done: () => void) => {
        const compileSource = [
            'Source/Core.ts',
            'Source/Program.ts',
            'Source/Scanner.ts',
            'Source/System.ts',
            'Source/Types.ts',
        ].join(' ');
        const compileCmd = `tsc ${compileSource} --outFile Build/Binaries/L10ns.js`;
        const bundleSource = [
            'Build/Source/Core.js',
            'Build/Source/Program.js',
            'Build/Source/Scanner.js',
            'Build/Source/System.js',
            'Build/Source/Types.js',
        ].join(' ');
        const bundleCmd = `node_modules/.bin/browserify ${bundleSource} -o Build/Binaries/L10ns.js`;
        console.log(compileCmd);
        exec(compileCmd, (_, stdout, stderr) => {
            if (stderr) {
                console.log(stderr);
            }
            console.log(stdout);
            console.log(bundleCmd);
            exec(bundleCmd, (_, stdout, stderr) => {
                if (stderr) {
                    console.log(stderr);
                }
                console.log(stdout);
                done();
            });
        });
    });
}

module.exports = run;
