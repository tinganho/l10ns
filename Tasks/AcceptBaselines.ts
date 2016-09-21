
/// <reference path='../Source/Service/System.ts'/>

function run(grunt: IGrunt) {
    grunt.registerTask('accept-baseline', async function() {
        const done = this.async();
        const rootDir = L10ns.joinPath(__dirname, '../../');
        L10ns.remove(L10ns.joinPath(rootDir, 'Tests/Baselines/Reference'));
        await L10ns.copyFolder(L10ns.joinPath(rootDir, 'Tests/Baselines/Current'), L10ns.joinPath(rootDir, 'Tests/Baselines/Reference'));
        done();
    });
}

module.exports = run;
