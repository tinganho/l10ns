
#include <vector>
#include <string>

using namespace std;

namespace L10ns {

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
    string * name;
    string * description;

    Argument(string * pname, string * pdescription) {
        name = pname;
        description = pdescription;
    }
};

struct Flag : Argument {
    string * alias;
    bool hasValue;
    FlagKind kind;
    string value;

    Flag(FlagKind pkind, const char pname[], const char palias[], const char pdescription[], bool phasValue)
        : kind(pkind), Argument(new string(pname), new string(pdescription)), alias(new string(palias)) {

        hasValue = phasValue;
        value = "";
    }
};

struct Action : Argument {
    vector<Flag> * flags;
    ActionKind kind;
    string * info;

    Action(ActionKind pkind, const char pname[], const char pdescription[], const char pinfo[],vector<Flag> * pflags)
        : kind(pkind), Argument(new string(pname), new string(pdescription)), info(new string(pinfo)) {

        if (pflags != NULL) {
            flags = pflags;
        }
    }
};

static Flag helpFlag = Flag(FlagKind::Help, "--help", "-h", "Print help description.", /*hasValue*/ false);
static Flag languageFlag = Flag(FlagKind::Language, "--language", "-l", "Specify language.", false);

static vector<Flag> defaultFlags = {
    helpFlag,
    Flag(FlagKind::Version, "--version", "", "Print current version.", /*hasValue*/ false),
};

static vector<Flag> helpFlags = {
    helpFlag,
};

static vector<Flag> setFlags = {
    Flag(FlagKind::Key, "--key", "-k", "Specify localization key.", /*hasValue*/ true),
    Flag(FlagKind::Value, "--value", "-v", "Specify localization value.", /*hasValue*/ true),
    languageFlag,
    helpFlag,
};

static vector<Flag> logFlags = {
    languageFlag,
    helpFlag,
};

static const char * initInfo =
  "Initialize a L10ns project. This command creates on 'l10ns.json' "
  "file, with sane default options applied.";

static const char * updateInfo =
  "Synchronize your keys between source code and storage.";

static const char * logInfo =
  "Show latest localizations.";

static const char * setInfo =
  "Set new localizations.";

static vector<Action> actions = {
    Action(ActionKind::Init, "init", "Initialize project.", initInfo, &helpFlags),
    Action(ActionKind::Update, "update", "Update localization keys.", updateInfo, &helpFlags),
    Action(ActionKind::Log, "log", "Show latest added localizations.", logInfo, &logFlags),
    Action(ActionKind::Set, "set", "Set localization.", setInfo, &setFlags),
};

struct Command {
    bool isRequestingHelp;
    bool isRequestingVersion;
    ActionKind action;
    vector<Flag> * flags;

    Command()
        : isRequestingHelp(false)
        , isRequestingVersion(false)
        , action(ActionKind::None)
        , flags(&defaultFlags) {

    }
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

    // Flag to optimize has action parsing.
    bool hasAction = false;

    // The option flag that is pending for a value.
    const Flag * flagWhichAwaitsValue = NULL;

    for (int argIndex = 1; argIndex < argc; argIndex++) {
        auto arg = argv[argIndex];
        if (!hasAction) {
            for (auto const& a : actions) {
                if (strcmp(a.name->c_str(), arg) == 0) {
                    command->action = a.kind;
                    hasAction = true;
                    command->flags = a.flags;
                    break;
                }
            }
        }

        if (flagWhichAwaitsValue == NULL) {
            for (auto const& flag : *command->flags) {
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
