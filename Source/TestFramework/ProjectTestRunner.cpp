
#include "Core.cpp"
#include "Utils.cpp"
#include "Configurations.h"
#include <fstream>
#include <exception>

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
        string currentFolder = replaceSubString(p, "/Cases/", "/Current/");
        recursivelyCreateFolder(currentFolder);
        writeFile(currentFolder + "/stdout.out", result);
        string testName = p.substr(p.find_last_of("/") + 1);
        test(testName, [result, p]() {
            string referenceFile = replaceSubString(p, "/Cases/", "/Reference/");
            string reference = readFile(referenceFile);
            if (result != reference) {
                throw runtime_error("Assertion Error!");
            }
        });
    }
}

}
