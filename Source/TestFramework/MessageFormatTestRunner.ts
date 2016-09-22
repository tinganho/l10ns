
/// <reference path='../Service/System.ts'/>
/// <reference path='../Service/Core.ts'/>

namespace L10ns.TestFramework {
    interface MessageFormatCase {
        value: string;
        variables: string[];
    }

    export function runMessageFormatTests() {
        const tests = findFiles('Tests/Cases/MessageFormat/*', rootDir);
        describe('Message Format:', () => {
            for (const t of tests) {
                console.log(t);
            }
        });
    }
}