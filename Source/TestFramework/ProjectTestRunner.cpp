
#include "Core.cpp"
#include "Utils.cpp"
#include "Configurations.h"
#include <fstream>
#include <exception>

using namespace std;
using namespace L10ns;

namespace TestFramework {

void addProjectTests() {
    auto paths = find_files("Tests/Cases/Projects/*", PROJECT_DIR);

    domain("Project Tests");

    for (auto const &p : paths) {
        auto command = read_file(p + "/Command.cmd");
        command = string(PROJECT_DIR) + "/Executables/l10ns " + command;
        string result = execute_command(command);
        string current_folder = replace_string(p, "/Cases/", "/Current/");
        recursively_create_folder(current_folder);
        write_file(current_folder + "/stdout.out", result);
        string test_name = p.substr(p.find_last_of("/") + 1);
        test(test_name, [result, p](Test* t) {
            string reference_file = replace_string(p, "/Cases/", "/Reference/");
            string reference = read_file(reference_file + "/stdout.out");
            if (result != reference) {
                throw runtime_error("Assertion Error!");
            }
        });
    }
}

}
