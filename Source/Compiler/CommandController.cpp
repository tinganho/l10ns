
#include <iostream>
#include "CommandParser.cpp"
#include "Configurations.h"

using namespace L10ns::CommandParser;

namespace L10ns {
namespace Controller {

void printHelp(Command * command) {
    if (command->action == CommandParser::ActionKind::None) {
        cout << "help";
    }
}


int init(int argc, char * argv[]) {
    auto command = CommandParser::parseCommandArguments(argc, argv);
    if (command->isRequestingVersion) {
        cout << "L10ns version " << VERSION << endl;
    }
    else if (command->isRequestingHelp) {
        printHelp(command);
    }
    return 0;
}

} // Controller
} // L10ns
