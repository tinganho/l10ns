
#include <iostream>
#include "CommandParser.cpp"
#include "Configurations.h"

namespace L10ns {
namespace Controller {

int init(int argc, char * argv[]) {
    auto command = CommandParser::parseCommandArguments(argc, argv);
    if (command->isRequestingVersion) {
        cout << "L10ns version " << VERSION << endl;
    }
    else if (command->isRequestingHelp) {

    }
    return 0;
}

} // Controller
} // L10ns
