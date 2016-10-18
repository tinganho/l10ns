
#include <iostream>
#include <vector>
#include <string>

using namespace std;

namespace L10ns {
namespace CommandParser {

enum class ActionKind {
    None,
    Init,
    Update,
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

struct Argument {
    std::string * name;
    std::string * description;

    Argument(std::string * pname, std::string * pdescription) {
        name = pname;
        description = pdescription;
    }
};

struct Flag : Argument {
    std::string * alias;
    bool hasValue;
    FlagKind kind;
    std::string value;

    Flag(FlagKind pkind, const char pname[], const char palias[], const char pdescription[], bool phasValue)
        : kind(pkind), Argument(new std::string(pname), new std::string(pdescription)), alias(new std::string(palias)) {

        hasValue = phasValue;
        value = "";
    }
};

struct Action : Argument {
    std::vector<Flag> * flags;
    ActionKind kind;

    Action(ActionKind pkind, const char pname[], const char pdescription[], std::vector<Flag> * pflags)
        : kind(pkind), Argument(new std::string(pname), new std::string(pdescription)) {

        if (pflags != NULL) {
            flags = pflags;
        }
    }
};

struct Command {
    bool isRequestingHelp;
    bool isRequestingVersion;
    ActionKind action;
    std::vector<Flag> * flags;

    Command()
        : isRequestingHelp(false)
        , isRequestingVersion(false)
        , action(ActionKind::None)
        , flags(NULL) {

    }
};

static Flag helpFlag = Flag(FlagKind::Help, "--help", "-h", "Print help description.", /*hasValue*/ false);
static Flag languageFlag = Flag(FlagKind::Language, "--language", "-l", "Specify language.", false);

static std::vector<Flag> defaultFlags = {
    helpFlag,
    Flag(FlagKind::Version, "--version", "-v", "Print current version.", /*hasValue*/ false),
};

static std::vector<Flag> helpFlags = {
    helpFlag,
};

static std::vector<Flag> setFlags = {
    Flag(FlagKind::Key, "--key", "-k", "Specify localization key.", /*hasValue*/ true),
    Flag(FlagKind::Value, "--value", "-v", "Specify localization value.", /*hasValue*/ true),
    languageFlag,
    helpFlag,
};

static std::vector<Flag> logFlags = {
    languageFlag,
    helpFlag,
};

static std::vector<Action> actions = {
    Action(ActionKind::Init, "init", "Initialize project.", &helpFlags),
    Action(ActionKind::Update, "update", "Update localization keys.", &helpFlags),
    Action(ActionKind::Log, "log", "Show log.", &logFlags),
    Action(ActionKind::Set, "set", "Set localization to key", &setFlags),
};

void setCommandFlag(Command *command, const Flag *flag, char *value = NULL) {
    switch (flag->kind) {
        case FlagKind::Help:
            command->isRequestingHelp = true;
            return;
        case FlagKind::Version:
            command->isRequestingVersion = true;
            return;
        default:
            return;
    }
}

Command* parseCommandArguments(int argc, char* argv[]) {
    Command * command = new Command();
    bool hasAction = false;                              // Flag to optimize has action parsing.
    const Flag * flagWhichAwaitsValue = NULL;            // The option flag that is pending for a value.
    std::vector<Flag> * currentFlags = &defaultFlags;    // Current flags for command. Changes depending on action.

    for (int argIndex = 1; argIndex < argc; argIndex++) {
        auto arg = argv[argIndex];
        if (!hasAction) {
            for (auto const& a : actions) {
                if (strcmp(a.name->c_str(), arg) == 0) {
                    command->action = a.kind;
                    hasAction = true;
                    currentFlags = a.flags;
                    command->flags = a.flags;
                    break;
                }
            }
        }

        if (flagWhichAwaitsValue == NULL) {
            for (auto const& flag : *currentFlags) {
                if (strcmp(flag.name->c_str(), arg) == 0 || (flag.alias->length() != 0 && strcmp(flag.name->c_str(), arg) == 0)) {
                    if (flag.hasValue) {
                        flagWhichAwaitsValue = &flag;
                    }
                    setCommandFlag(command, &flag);
                    break;
                }
            }
        }
        else {
            setCommandFlag(command, flagWhichAwaitsValue, arg);
            flagWhichAwaitsValue = NULL;
            continue;
        }
    }

    return command;
}


} // L10ns
} // CommandParser

