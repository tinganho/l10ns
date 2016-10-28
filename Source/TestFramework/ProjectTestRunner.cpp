
#include "Core.cpp"
#include "Utils.cpp"
#include "Configurations.h"
#include <fstream>
#include <exception>
#include <boost/algorithm/string/replace.hpp>

using namespace std;
using namespace L10ns;

namespace TestFramework {

void addProjectTests() {
    auto paths = findFiles("Tests/Cases/Projects/*", PROJECT_DIR);

    domain("Project Tests");

    for (auto const &p : paths) {
        auto command = readFile(p + "/Command.cmd");
        command = string(PROJECT_DIR) + "/Executables/l10ns " + command;
        string result = executeCommand(command);
        string testName = p.substr(p.find_last_of("/") + 1);
        test(testName, [result, p]() {
            string reference = readFile(boost::replace_all_copy(p, "/Cases/", "/Reference/"));
            if (result != reference) {
                throw runtime_error("Assertion Error!");
            }
        });
    }
}

}
