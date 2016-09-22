
/// <reference path='../Service/System.ts'/>

namespace L10ns.TestFramework {
    export const rootDir = joinPath(__dirname, '../../');
    
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