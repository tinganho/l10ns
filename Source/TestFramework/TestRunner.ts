
/// <reference path='../Service/System.ts'/>

namespace L10ns.TestFramework {
    export async function run() {
        try {
            await runProjectTests();
        }
        catch(err) {
            console.log(err);
        };
    }
}

L10ns.TestFramework.run();