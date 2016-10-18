
#include "CommandParser.cpp"
#include "Configurations.h"
#include "Utils.cpp"

namespace L10ns {

void printDefaultHelp() {
    auto w = new TextWriter();
    w->writeLine("usage: l10ns <command> [<options>]");
    w->newline();
    w->writeLine("Commands:");
    for (const auto& action : actions) {
        w->writeLine(*action.name + " " + *action.description);
    }
    w->print();
}

void printActionHelp(ActionKind action) {

}

void printCommandHelp(Command * command) {
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
