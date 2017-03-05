
#include <iostream>
#include <jsonrpccpp/client.h>
#include <jsonrpccpp/client/connectors/unixdomainsocketclient.h>
#include "Utils.cpp"
#include "json.hpp"
#include "Diagnostics.cpp"
#include "JsonRpcClient.h"

using json = nlohmann::json;
using namespace L10ns;
using namespace jsonrpc;
using namespace std;

class Extension {
public:
    static Extension create(Session* session, string extension_file) {
        string command;

        auto check_capabilities = [&session, &extension_file](vector<string> capabilities) -> void {
            for (auto const& c : capabilities) {
                if (c != "Plural" &&
                    c != "Select" &&
                    c != "Date" &&
                    c != "Number" &&
                    c != "Ordinal" &&
                    c != "Currency") {

                    add_diagnostic(session, D::Unknown_capability_in_extension_file, c, extension_file);
                }
            }
        };

        auto check_extension_existense = [&]() -> void {
            vector<string> files = find_files(*session->root_dir + string("src/Extensions/*/Extension.json"));
            bool found_matching_programming_language = false;
            for (auto const& f : files) {
                json package = json::parse(read_file(f));
                string pl = package["ProgrammingLanguage"];
                if (pl == *session->programming_language) {
                    found_matching_programming_language = true;
                    command = package["Execute"];
                    break;
                }
            }
            if (!found_matching_programming_language) {
                add_diagnostic(session,
                    D::Could_not_find_an_extension_for_the_programming_language,
                    *session->programming_language);
            }
        };

        json manifest = json::parse(read_file(extension_file));
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
        check_capabilities(capabilities);
        auto dependency_test = manifest["DependencyTest"];
        if (dependency_test.is_null()) {
            add_diagnostic(session, D::Missing_field_in_your_extension_file, "DependencyTest", extension_file);
        }
        auto executable = manifest["Executable"];
        if (executable.is_null()) {
            add_diagnostic(session, D::Missing_field_in_your_extension_file, "Executable", extension_file);
        }
        check_extension_existense();

        extension.programming_language = programming_language;
        extension.file_extensions = file_extensions.get<vector<string>>();
        extension.capabilities = capabilities.get<vector<string>>();
        extension.dependency_test = dependency_test;
        extension.executable = executable;
        extension.session = session;
        extension.command = command;

        return extension;
    }

    string programming_language;
    vector<string> file_extensions;
    vector<string> capabilities;
    string dependency_test;
    string executable;
    string command;
    Session* session;

    void start_server() {
        try {
            execute_command(session->command);
            HttpClient http_client("http://localhost:8683");
	        Client client(http_client);
            Json::Value params;
            params["name"] = "Peter";
            cout << client.CallMethod("sync", params) << endl;
        }
        catch (exception& e) {
            cerr << e.what() << endl;
            add_diagnostic(session, D::Could_not_start_extension_server);
        }
    }

    void stop_server() {

    }
};
