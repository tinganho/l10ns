
#include "Core.cpp"
#include "Utils.cpp"
#include "Configurations.h"
#include <fstream>

using namespace std;
using namespace L10ns;

namespace TestFramework {

void runProjectTests() {
    auto paths = findFiles("Tests/Cases/Projects/*", PROJECT_DIR);
    for (auto const &p : paths) {
        auto command = readFile(p + "/Command");
        command = string(PROJECT_DIR) + "/Executables/l10ns " + command;
        string result = executeCommand(command);
    }
}

}
