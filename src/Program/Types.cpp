
#ifndef TYPES_H
#define TYPES_H

#include <string>
#include <Utils.cpp>
#include "json.hpp"

using namespace std;
using json = nlohmann::json;

enum class CommandKind {
    None,
    Init,
    Sync,
    Log,
    Set,
    Extension_RunTests,
    Extension_AcceptBaselines,
};

enum class FlagKind {
    None,
    Help,
    Version,
    Language,
    Key,
    Value,
    RootDir,
    Grep,
};

struct Argument {
    string* name;
    string* description;

    Argument(string* name, string* description) {
        this->name = name;
        this->description = description;
    }
};

struct Flag : Argument {
    string* alias;
    bool has_value;
    FlagKind kind;
    string value;

    Flag(FlagKind kind, const char name[], const char alias[], const char description[], bool has_value)
        : kind(kind), Argument(new string(name), new string(description)), alias(new string(alias)) {

        this->has_value = has_value;
        this->value = "";
    }
};

struct Command : Argument {
    vector<Flag>* flags;
    CommandKind kind;
    string* info;

    Command(CommandKind kind, const char name[], const char description[], const char info[], vector<Flag> * flags)
        : kind(kind), Argument(new string(name), new string(description)), info(new string(info)) {

        this->flags = flags;
    }
};

struct Extension {
public:
    string programming_language;
    vector<string> file_extensions;
    vector<string> capabilities;
    string dependency_test;
    string executable;
};

class Session {
public:
    bool is_requesting_help;
    bool is_requesting_version;
    string* root_dir;
    CommandKind command;
    vector<Diagnostic*> diagnostics;
    string* programming_language;

    Session()
        : is_requesting_help(false)
        , is_requesting_version(false)
        , command(CommandKind::None) {
    }

    void add_diagnostic(Diagnostic* diagnostic) {
        diagnostics.push_back(diagnostic);
    }
};

#endif // TYPES_H
