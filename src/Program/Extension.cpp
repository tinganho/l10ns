
#include "json.hpp"
#include "Diagnostics.cpp"

using json = nlohmann::json;

class Extension {
public:
    static Extension create(Session* session, const json& manifest) {
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
    }

    string programming_language;
    vector<string> file_extensions;
    vector<string> capabilities;
    string dependency_test;
    string executable;

    void start_server() {

    }

    void stop_server() {

    }
};
