
/// <reference path='../Service/System.ts'/>
/// <reference path='ProjectTestRunner.ts'/>
/// <reference path='MessageFormatTestRunner.ts'/>

namespace L10ns.TestFramework {
    export async function run() {
        try {
            remove(joinPath(rootDir, 'Tests/Baselines/Current/*'));
            await runProjectTests();
            await runMessageFormatTests();
        }
        catch(err) {
            console.log(err);
        }
    }
}

L10ns.TestFramework.run();