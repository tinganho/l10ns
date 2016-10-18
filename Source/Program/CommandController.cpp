
#include "CommandParser.cpp"
#include "Configurations.h"
#include "Utils.cpp"

namespace L10ns {

inline void printDefaultHelp() {
    auto w = new TextWriter();
    w->addTab(2);
    w->addTab(12);
    w->writeLine("Usage: l10ns [<options>] <command>");
    w->newline();
    w->writeLine("Commands:");
    w->newline();
    for (const auto& action : actions) {
        w->tab();
        w->write(*action.name);
        w->tab();
        w->writeLine(*action.description);
    }
    w->newline();
    w->writeLine("For more details: 'l10ns <command> --help'.");
    w->newline();
    w->clearTabs();
    w->addTab(2);
    w->addTab(17);
    w->writeLine("Options:");
    w->newline();
    for (const auto& flag : defaultFlags) {
        w->tab();
        if (flag.alias->length() != 0) {
            w->write(*flag.name + ", " + *flag.alias);
        }
        else {
            w->write(*flag.name);
        }
        w->tab();
        w->writeLine(*flag.description);
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
