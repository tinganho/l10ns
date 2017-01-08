
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

    auto create_extension = [&](json& manifest) -> Extension {
        Extension extension;
        auto programming_language = manifest["ProgrammingLanguage"];
        if (programming_language.is_null()) {
            add_diagnostic(session, D::Missing_field_in_your_extension_file, "ProgrammingLanguage", extension_file);
        }
        auto file_extensions = manifest["FileExtensions"];
        if (file_extensions.is_null()) {
            add_diagnostic(session, D::Missing_field_in_your_extension_file, "FileExtensions", extension_file);
        }
        auto capabilities = manifest["Capabilities"];
        if (capabilities.is_null()) {
            add_diagnostic(session, D::Missing_field_in_your_extension_file, "Capabilities", extension_file);
        }
        capabilities = capabilities.get<vector<string>>();
        check_capabilities(session, capabilities);
        auto dependency_test = manifest["DependencyTest"];
        if (dependency_test.is_null()) {
            add_diagnostic(session, D::Missing_field_in_your_extension_file, "DependencyTest", extension_file);
        }
        auto executable = manifest["Executable"];
        if (executable.is_null()) {
            add_diagnostic(session, D::Missing_field_in_your_extension_file, "Executable", extension_file);
        }
        extension.programming_language = programming_language;
        extension.file_extensions = file_extensions.get<vector<string>>();
        extension.capabilities = capabilities.get<vector<string>>();
        extension.dependency_test = dependency_test;
        extension.executable = executable;

        return extension;
    };

    Extension extension = create_extension(manifest);

    for_each_compilation_test_file([&](const string& test_file) {

    });
}
