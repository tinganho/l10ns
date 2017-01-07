
#ifndef TYPES_H
#define TYPES_H

#include <string>

using namespace std;

enum class ActionKind {
    None,
    Init,
    Sync,
    Log,
    Set,
};

enum class FlagKind {
    None,
    Help,
    Version,
    Language,
    Key,
    Value,
    RootDir,
};

struct DiagnosticTemplate {
    string message_template;

    DiagnosticTemplate(string message_template)
        : message_template(message_template) {
    }
};

struct Diagnostic {
    string* message;

    Diagnostic(string* message)
        : message(message) {}
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

struct Action : Argument {
    vector<Flag>* flags;
    ActionKind kind;
    string* info;

    Action(ActionKind kind, const char name[], const char description[], const char info[], vector<Flag> * flags)
        : kind(kind), Argument(new string(name), new string(description)), info(new string(info)) {

        if (flags != NULL) {
            this->flags = flags;
        }
    }
};

#endif // TYPES_H
