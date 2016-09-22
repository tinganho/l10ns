
///<reference path='Program.ts'/>

if (require.main === module) {
    const session: L10ns.ProgramSession = L10ns.parseCommandLine(process.argv);
    if (session.errors.length > 0) {
        session.errors.forEach(error => {
            console.log(`Error L${error.code}: ${error.messageText}`);
        });
        process.exit(1);
    }
}
