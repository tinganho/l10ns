
/// <reference path='../Service/System.ts'/>

namespace L10ns.TestFramework {
    export async function run() {
        await runProjectTests().catch((err) => {
            console.log(err);
        });
    }
}

L10ns.TestFramework.run();