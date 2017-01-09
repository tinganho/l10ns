
#include "Types.cpp"
#include "Utils.cpp"
#include "json.hpp"
#include "Diagnostics.cpp"

using namespace L10ns;
using json = nlohmann::json;

void run_extension_tests(Session* session) {
    string extension_file = join_paths(*session->root_dir, "Extension.json");
    json manifest = json::parse(read_file(extension_file));

    auto for_each_compilation_test_file = [&](std::function<void (const string&)> callback) -> void {
        vector<string> comilation_test_files = find_files(*session->root_dir + "Tests/Cases/Compilations/*");
        for (auto const& f : comilation_test_files) {
            callback(f);
        }
    };

    auto check_capabilities = [&](Session* session, vector<string> capabilities) -> void {
        for (auto const& c : capabilities) {
            if (c != "Plural" &&
                c != "Select" &&
                c != "Date" &&
                c != "Number" &&
                c != "Ordinal" &&
                c != "Currency") {

                add_diagnostic(session, D::Unknown_capability, c);
            }
        }
    };

    Extension extension = Extension::create(session, manifest);
    for_each_compilation_test_file([&](const string& test_file) {
        extension.start_server();
    });
}
