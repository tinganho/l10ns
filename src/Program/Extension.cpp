
#ifndef EXTENSION_H_
#define EXTENSION_H_

#include <stdio.h>
#include <unistd.h>
#include <iostream>
#include <jsonrpccpp/client/connectors/httpclient.h>
#include <jsonrpccpp/client/connectors/unixdomainsocketclient.h>
#include "Utils.cpp"
#include "json.hpp"
#include "Diagnostics.cpp"
#include "JsonRpcClient.h"
#include <map>

using json = nlohmann::json;
using namespace L10ns;
using namespace jsonrpc;
using namespace std;

struct Key {
    string name;
    vector<string> params;
    unsigned int line;
    unsigned int column;
    Key(string n, vector<string> p, unsigned int l, unsigned int c):
        name(n),
        params(p),
        line(l),
        column(c) {};
};

typedef std::map<string, vector<Key>> FileToKeys;

class Extension {
public:
    static Extension* create(Session* session, string extension_file) {

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
        Extension* extension = new Extension();
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
        auto test_dir = manifest["TestDirectory"];
        if (test_dir.is_null()) {
            add_diagnostic(session, D::Missing_field_in_your_extension_file, "TestDirectory", extension_file);
        }

        extension->programming_language = programming_language;
        extension->file_extensions = file_extensions.get<vector<string>>();
        extension->function_names = function_names.get<vector<string>>();
        extension->capabilities = capabilities.get<vector<string>>();
        extension->dependency_test = dependency_test;
        extension->command = command;
        extension->test_dir = test_dir;
        extension->session = session;

        return extension;
    }

    string programming_language;
    vector<string> file_extensions;
    vector<string> function_names;
    vector<string> capabilities;
    string test_dir;
    string dependency_test;
    string command;
    Session* session;
    JsonRpcClient* client;

    int start_server() {
        pid_t cpid = fork();
        if (cpid == 0) {
            execl("/bin/bash", "/bin/bash", "-c", command.c_str(), (char *) 0);
        }
        return cpid;
    }

    FileToKeys get_localization_keys(vector<string>& files, vector<string>& function_names) {
        Json::Value files_json = Json::arrayValue;
        for (auto const& f : files) {
            files_json.append(f);
        }
        Json::Value function_names_json = Json::arrayValue;
        for (auto const& f : function_names) {
            function_names_json.append(f);
        }
        HttpClient http_client("http://localhost:8888");
        JsonRpcClient rpc_client(http_client);
        auto file_to_keys_json = rpc_client.sync(files_json, function_names_json);
        FileToKeys file_to_keys;
        for (Json::ValueIterator file_to_keys_it = file_to_keys_json.begin(); file_to_keys_it != file_to_keys_json.end(); file_to_keys_it++) {
            auto k = *file_to_keys_it;
            vector<Key> keys;
            for (Json::ValueIterator key_it = k.begin(); key_it != k.end(); key_it++) {
                auto v = *key_it;
                vector<string> params;
                Json::Value params_json = v["params"];
                for (Json::ValueIterator param_it = params_json.begin(); param_it != params_json.end(); param_it++) {
                    if (!param_it->isString()) {
                        throw invalid_argument("Parameters must be of type string.");
                    }
                    params.push_back(param_it->asString());
                }
                keys.push_back(Key(v["name"].asString(), params, v["line"].asInt(), v["column"].asInt()));
            }
            file_to_keys[file_to_keys_it.key().asString()] = keys;
        }
        return file_to_keys;
    }

    void stop_server() {

    }
};

#endif //EXTENSION_H_
