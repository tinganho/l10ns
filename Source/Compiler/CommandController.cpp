
#include "CommandParser.cpp"
#include "Configurations.h"
#include "Utils.cpp"

using namespace L10ns::CommandParser;
using namespace L10ns::Utils;

namespace L10ns {
namespace Controller {

void printCommandHelp(Command * command) {
    if (command->action == CommandParser::ActionKind::None) {
        println("help");
    }
}

int init(int argc, char * argv[]) {
    auto command = CommandParser::parseCommandArguments(argc, argv);
    if (command->isRequestingVersion) {
        println("L10ns version ", VERSION);
    }
    else if (command->isRequestingHelp) {
        printCommandHelp(command);
    }
    return 0;
}

} // Controller
} // L10ns
