
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
};

struct Diagnostic {
    string message;
    unsigned int code;
    Diagnostic* parent;

    Diagnostic(string message)
        : message(message) {

    }
};

struct Argument {
    string * name;
    string * description;

    Argument(string * p_name, string * p_description) {
        this->name = p_name;
        this->description = p_description;
    }
};

struct Flag : Argument {
    string * alias;
    bool has_value;
    FlagKind kind;
    string value;

    Flag(FlagKind p_kind, const char p_name[], const char p_alias[], const char p_description[], bool p_has_value)
        : kind(p_kind), Argument(new string(p_name), new string(p_description)), alias(new string(p_alias)) {

        has_value = p_has_value;
        value = "";
    }
};

struct Action : Argument {
    vector<Flag> * flags;
    ActionKind kind;
    string * info;

    Action(ActionKind p_kind, const char p_name[], const char p_description[], const char p_info[],vector<Flag> * p_flags)
        : kind(p_kind), Argument(new string(p_name), new string(p_description)), info(new string(p_info)) {

        if (p_flags != NULL) {
            flags = p_flags;
        }
    }
};

#endif // TYPES_H
