
/// <reference path='../Service/System.ts'/>
/// <reference path='../Service/Core.ts'/>

namespace L10ns.TestFramework {
    const rootDir = joinPath(__dirname, '../../');
    const l10ns = joinPath(rootDir, 'Build/Binaries/L10ns.js');
    
    function runCommandFromProject(command: string, project: string): Promise<string | undefined> {
        return L10ns.runCommand(`(cd ${joinPath(rootDir, project)}; ${command})`);
    }

    export async function runProjectTests() {
        const projects = findFiles('Tests/Cases/Projects/*', rootDir);
        for (const p of projects) {
            let command: string;
            try {
                command = await readFile(joinPath(rootDir, p, 'Command'));
            }
            catch(err) {
                Debug.fail(`Could not read project command from project '${joinPath(rootDir, p, 'Command')}'.`);
                return;
            }
            let stderr: string | undefined;
            const cmd = 'node ' + l10ns + ' ' + command;
            console.log(cmd)
            const stdout = await runCommandFromProject(cmd, p)
                .catch((error) => {
                    stderr = error
                });
            if (stderr) {
                console.log(stderr)
            }
            else {
                console.log(stdout);
            }
        }
    }
}
