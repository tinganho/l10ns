
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

    Diagnostic(string message, unsigned int code)
        : message(message)
        , code(code) {

    }
};
