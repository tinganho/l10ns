
/// <reference path='../Source/Service/System.ts'/>

import { exec } from 'child_process';

function run(grunt: IGrunt) {
    grunt.registerTask('diff', function() {
        const done = this.async();
        if (!process.env.DIFF) {
            grunt.log.error('You have not defined your diff tool yet.');
        }
        const currentBaseline = L10ns.joinPath(__dirname, '../../Tests/Baselines/Current');
        const referenceBaseline = L10ns.joinPath(__dirname, '../../Tests/Baselines/Reference');
        const cmd = process.env.DIFF + ' ' + referenceBaseline + ' ' + currentBaseline;
        console.log(cmd);
        exec(cmd, function(err: any, stdout: string, stderr: string) {
            if (err || stderr) {
                console.error(stderr || stdout || (err.message + err.stack));
                return done(false);
            }
            if (stdout) {
                console.log(stdout);
            }
            done();
        });
    });
}

module.exports = run;