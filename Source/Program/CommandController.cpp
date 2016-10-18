
#include "CommandParser.cpp"
#include "Configurations.h"
#include "Utils.cpp"

namespace L10ns {

inline void printDefaultHelp() {
    auto w = new TextWriter();
    w->addTab(2);
    w->addTab(10);
    w->writeLine("Usage: l10ns <command> [<options>]");
    w->newline();
    w->writeLine("Commands:");
    for (const auto& action : actions) {
        w->writeLine(*action.name + " " + *action.description);
    }
    w->print();
}

inline void printActionHelp(ActionKind action) {

}

inline void printCommandHelp(Command * command) {
    if (command->action == ActionKind::None) {
        printDefaultHelp();
    }
    else {
        printActionHelp(command->action);
    }
}

int init(int argc, char * argv[]) {
    auto command = parseCommandArguments(argc, argv);
    if (command->isRequestingVersion) {
        println("L10ns version ", VERSION, ".");
    }
    else if (command->isRequestingHelp) {
        printCommandHelp(command);
    }
    return 0;
}

} // L10ns
