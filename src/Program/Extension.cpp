
#include <stdio.h>
#include <unistd.h>
#include <iostream>
#include <jsonrpccpp/client/connectors/httpclient.h>
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
        auto function_names = manifest["FunctionNames"];
        if (function_names.is_null()) {
            add_diagnostic(session, D::Missing_field_in_your_extension_file, "FunctionNames", extension_file);
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
        auto command = manifest["Command"];
        if (command.is_null()) {
            add_diagnostic(session, D::Missing_field_in_your_extension_file, "Command", extension_file);
        }

        extension.programming_language = programming_language;
        extension.file_extensions = file_extensions.get<vector<string>>();
        extension.function_names = function_names.get<vector<string>>();
        extension.capabilities = capabilities.get<vector<string>>();
        extension.dependency_test = dependency_test;
        extension.command = command;
        extension.session = session;

        return extension;
    }

    string programming_language;
    vector<string> file_extensions;
    vector<string> function_names;
    vector<string> capabilities;
    string dependency_test;
    string command;
    Session* session;
    JsonRpcClient* client;

    int start_server(int (&fd)[2]) {
        pid_t cpid = fork();
        if (cpid == 0) {
            close(fd[0]);
            execl("/bin/bash", "/bin/bash", "-c", "node Build/index.js", (char *) 0);
        }
        return cpid;
    }

    std::string sync(vector<string>& files, vector<string>& function_names) {
        Json::Value files_json = Json::arrayValue;
        for (auto const& f : files) {
            files_json.append(f);
        }
        Json::Value function_names_json  = Json::arrayValue;
        for (auto const& f : function_names) {
            function_names_json.append(f);
        }
        HttpClient http_client("http://localhost:8383");
        JsonRpcClient rpc_client(http_client);
        return rpc_client.sync(files_json, function_names_json);
    }

    void stop_server() {

    }
};
