
#include "Types.cpp"
#include "Utils.cpp"
#include "Diagnostics.cpp"
#include "Extension.cpp"
#include "Core.cpp"
#include <signal.h>

using namespace L10ns;
using namespace TestFramework;

int child;

void kill_all_processes(int signum) {
#ifdef __unix__  
    kill(child, SIGTERM);
    unlink("/tmp/l10ns.sock");
    exit(signum);
#endif
}

void run_extension_tests(Session* session) {
    string extension_file = join_paths(*session->root_dir, "Extension.json");
    Extension* extension;

    auto start_extension_server = [&]() -> void {
        extension = Extension::create(session, extension_file);
#ifdef __unix__  
        int fd[2];
        pipe(fd);
        child = extension->start_server(fd);
        signal(SIGINT, kill_all_processes);
        char buf[1];
        read(fd[0], buf, 1);
#endif
    };

    auto for_each_compilation_test_file = [&](std::function<void (const string&)> callback) -> void {
        vector<string> comilation_test_files = find_files(*session->root_dir + "Tests/Cases/Compilations/*");
        for (auto const& f : comilation_test_files) {
            callback(f);
        }
    };

    auto for_each_key_extraction_test_file = [&](std::function<void (const string&)> callback) -> void {
        vector<string> comilation_test_files = find_files(*session->root_dir + "Tests/Cases/KeyExtractions/*");
        for (auto const& f : comilation_test_files) {
            callback(f);
        }
    };

    start_extension_server();
    domain("KeyExtractions");
    for_each_key_extraction_test_file([&](const string& test_file) {
        vector<string> files = { test_file };
        FileToKeys file_to_keys = extension->get_localization_keys(files, extension->function_names);
        Json::Value result;
        for (FileToKeys::iterator it = file_to_keys.begin(); it != file_to_keys.end(); it++) {
            vector<Key> keys = it->second;
            Json::Value keys_json = Json::arrayValue;
            for (auto key_it = keys.begin(); key_it != keys.end(); key_it++) {
                auto key = key_it;
                auto params = key->params;
                Json::Value params_json = Json::arrayValue;
                for (vector<string>::iterator param_it = params.begin(); param_it != params.end(); param_it++) {
                    params_json.append(*param_it);
                }
                Json::Value key_json;
                key_json["name"] = key->name;
                key_json["params"] = params_json;
                key_json["line"] = key->line;
                key_json["column"] = key->column;
                keys_json.append(key_json);
            }
            result[it->first] = keys_json;
        }
        Json::StreamWriterBuilder builder;
        builder["indentation"] = "    ";
        std::unique_ptr<Json::StreamWriter> writer(builder.newStreamWriter());
        std::ostringstream string_buffer;
        writer->write(result, &string_buffer);
        string result_string = string_buffer.str();
        result_string = replace_string(result_string, *session->root_dir + "Tests/Cases/", "");
        string currents_file_path = replace_string(test_file, "Cases", "Currents");
        currents_file_path = replace_string(currents_file_path, ".js", ".json");
        string currents_dir = currents_file_path.substr(0, currents_file_path.find_last_of("/"));
        recursively_create_dir(currents_dir);
        write_file(replace_string(currents_file_path, "Cases", "Currents"), result_string);
        string reference_file_path = replace_string(currents_file_path, "Cases", "References");
        string reference_string = "";
        if (file_exists(reference_file_path)) {
            reference_string = read_file(reference_file_path);
        }
        string test_name = currents_file_path.substr(currents_file_path.find_last_of("/") + 1);
        test_name = replace_string(test_name, *session->root_dir, "");
        test(test_name, [reference_string, result_string](Test* t) {
            if (result_string != reference_string) {
                cout << result_string << endl;
                cout << reference_string << endl;
                throw runtime_error("Assertion Error!");
            }
        });
    });
    runTests();
    printResult();
    kill_all_processes(SIGTERM);
}
