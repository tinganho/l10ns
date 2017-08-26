
#ifndef EXTENSION_H_
#define EXTENSION_H_

#include <stdio.h>
#include <unistd.h>
#include <iostream>
#include "Utils.cpp"
#include <json/json.h>
#include "Diagnostics.cpp"
#include <map>

using namespace L10ns;
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


vector<string> to_vector_of_strings(const Json::Value& vec) {
    std::vector<string> res;
    for (const Json::Value& item : vec) {
        res.push_back(item.asString());
    }
    return res;
}

typedef std::map<string, vector<Key>> FileToKeys;

class Extension {
public:
    static Extension* create(Session* session, string extension_file) {

        auto check_capabilities = [&session, &extension_file](const Json::Value& capabilities) -> void {
            for (auto const& capability : capabilities) {
                if (capability.isString() != true) {
                    // TODO: Change this
                    add_diagnostic(session, D::Unknown_capability_in_extension_file);
                    continue;
                }
                const string c = capability.asString();
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
        Json::Reader reader;
        Json::Value manifest;
        bool ok = reader.parse(read_file(extension_file), manifest);
        if (!ok) {
            // TODO: Change this
            add_diagnostic(session, D::Missing_field_in_your_extension_file, "ProgrammingLanguage", extension_file);
        }
        Extension* extension = new Extension();
        auto programming_language = manifest["ProgrammingLanguage"];
        if (programming_language.isNull()) {
            add_diagnostic(session, D::Missing_field_in_your_extension_file, "ProgrammingLanguage", extension_file);
        }
        auto file_extensions = manifest["FileExtensions"];
        if (file_extensions.isNull()) {
            add_diagnostic(session, D::Missing_field_in_your_extension_file, "FileExtensions", extension_file);
        }
        auto function_names = manifest["FunctionNames"];
        if (function_names.isNull()) {
            add_diagnostic(session, D::Missing_field_in_your_extension_file, "FunctionNames", extension_file);
        }
        auto capabilities = manifest["Capabilities"];
        if (capabilities.isNull()) {
            add_diagnostic(session, D::Missing_field_in_your_extension_file, "Capabilities", extension_file);
        }

        check_capabilities(capabilities);
        auto dependency_test = manifest["DependencyTest"];
        if (dependency_test.isNull()) {
            add_diagnostic(session, D::Missing_field_in_your_extension_file, "DependencyTest", extension_file);
        }
        auto command = manifest["Command"];
        if (command.isNull()) {
            add_diagnostic(session, D::Missing_field_in_your_extension_file, "Command", extension_file);
        }
        auto test_dir = manifest["TestDirectory"];
        if (test_dir.isNull()) {
            add_diagnostic(session, D::Missing_field_in_your_extension_file, "TestDirectory", extension_file);
        }

        extension->programming_language = programming_language.asString();
        extension->file_extensions = to_vector_of_strings(file_extensions);
        extension->function_names = to_vector_of_strings(function_names);
        extension->capabilities = to_vector_of_strings(capabilities);
        extension->dependency_test = dependency_test.asString();
        extension->command = command.asString();
        extension->test_dir = test_dir.asString();
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
        // HttpClient http_client("http://localhost:8888");
        // JsonRpcClient rpc_client(http_client);
        // auto file_to_keys_json = rpc_client.sync(files_json, function_names_json);
        FileToKeys file_to_keys;
        // for (Json::ValueIterator file_to_keys_it = file_to_keys_json.begin(); file_to_keys_it != file_to_keys_json.end(); file_to_keys_it++) {
        //     auto k = *file_to_keys_it;
        //     vector<Key> keys;
        //     for (Json::ValueIterator key_it = k.begin(); key_it != k.end(); key_it++) {
        //         auto v = *key_it;
        //         vector<string> params;
        //         Json::Value params_json = v["params"];
        //         for (Json::ValueIterator param_it = params_json.begin(); param_it != params_json.end(); param_it++) {
        //             if (!param_it->isString()) {
        //                 throw invalid_argument("Parameters must be of type string.");
        //             }
        //             params.push_back(param_it->asString());
        //         }
        //         keys.push_back(Key(v["name"].asString(), params, v["line"].asInt(), v["column"].asInt()));
        //     }
        //     file_to_keys[file_to_keys_it.key().asString()] = keys;
        // }
        return file_to_keys;
    }

    void stop_server() {

    }
};

#endif //EXTENSION_H_
