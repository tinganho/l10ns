
/// <reference path='../Service/System.ts'/>
/// <reference path='../Service/Core.ts'/>

namespace L10ns.TestFramework {
    const l10ns = joinPath(rootDir, 'Build/Binaries/L10ns.js');
    
    async function runCommandFromProject(command: string, project: string): Promise<string | undefined> {
        return L10ns.runCommand(`(cd ${joinPath(rootDir, project)}; ${command})`);
    }

    export async function runProjectTests() {
        describe('Project Tests:', () => {
            const projects = findFiles('Tests/Cases/Projects/*', rootDir);
            for (const p of projects) {
                ((p) => {
                    const projectSegments = p.split('/').filter(seg => seg);
                    const caseName = projectSegments[projectSegments.length - 1];
                    it(caseName, async (done) => {
                        try {
                            let command: string;
                            try {
                                command = await readFile(joinPath(rootDir, p, 'Command'));
                            }
                            catch(err) {
                                return Debug.fail(`Could not read project command '${joinPath(rootDir, p, 'Command')}'.`);
                            }
                            let stderr: string | undefined;
                            const cmd = 'node ' + l10ns + ' ' + command;
                            try {
                                await runCommandFromProject(cmd, p);
                            }
                            catch(err) {
                                stderr = err;
                            }

                            const caseFolder = joinPath(rootDir, `Tests/Baselines/Current/Projects/`, caseName);
                            await createFolder(caseFolder);
                            const errorFile = joinPath(caseFolder, 'Errors');
                            const referenceErrorFile = errorFile.replace('Baselines/Current', 'Baselines/Reference');
                            const referenceErrorFileExists = exists(referenceErrorFile);
                            if (stderr) {
                                await writeFile(errorFile, stderr);
                                if (referenceErrorFileExists) {
                                    Debug.assert(stderr === await readFile(referenceErrorFile), 'Error file is wrong!');
                                }
                                else {
                                    return Debug.fail('No error is expected!');
                                }
                            }
                            else {
                                if (referenceErrorFileExists) {
                                    return Debug.fail('Expected an error!');
                                }
                            }
                            const compiledFolder = joinPath(rootDir, p, 'Localizations');
                            const currentFolder = joinPath(caseFolder, 'Localizations');
                            try {
                                await moveFolder(compiledFolder, caseFolder);
                            }
                            catch(err) {}
                            await assertFolder(currentFolder);
                            done();
                        }
                        catch(err) {
                            done(err);
                        }
                    });
                })(p);
            }
        });
    }

    async function assertFolder(current: string) {
        const currentFiles = findFiles(joinPath(current, '**'), rootDir);
        for (const f of currentFiles) {
            const currentFileContent = await readFile(f);
            const expectationFile = f.replace('Baselines/Current', 'Baselines/Reference');
            if (exists(expectationFile)) {
                const expectationFileContent = await readFile(expectationFile);
                Debug.assert(currentFileContent === expectationFileContent);
            }
        }
    }
}
