/// <reference path='../Source/Service/System.ts'/>
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
function run(grunt) {
    grunt.registerTask('accept-baseline', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const done = this.async();
            const rootDir = L10ns.joinPath(__dirname, '../../');
            try {
                L10ns.remove(L10ns.joinPath(rootDir, 'Tests/Baselines/Reference'));
                yield L10ns.copyFolder(L10ns.joinPath(rootDir, 'Tests/Baselines/Current'), L10ns.joinPath(rootDir, 'Tests/Baselines/Reference'));
                done();
            }
            catch (err) {
                console.error(err);
                done(false);
            }
        });
    });
}
module.exports = run;
