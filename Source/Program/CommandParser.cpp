
#include <vector>
#include <string>
#include "Utils.cpp"
#include "Types.cpp"
#include "Diagnostics.cpp"

using namespace std;

namespace L10ns {

static Flag help_flag = Flag(FlagKind::Help, "--help", "-h", "Print help description.", /*hasValue*/ false);
static Flag language_flag = Flag(FlagKind::Language, "--language", "-l", "Specify language.", false);

static vector<Flag> default_flags = {
    help_flag,
    Flag(FlagKind::Version, "--version", "", "Print current version.", /*hasValue*/ false),
};

static vector<Flag> help_flags = {
    help_flag,
};

static vector<Flag> set_flags = {
    Flag(FlagKind::Key, "--key", "-k", "Specify localization key.", /*hasValue*/ true),
    Flag(FlagKind::Value, "--value", "-v", "Specify localization value.", /*hasValue*/ true),
    Flag(FlagKind::Value, "--log-index", "-li", "Specify log index.", /*hasValue*/ true),
    Flag(FlagKind::Value, "--search-index", "-se", "Specify latest search index.", /*hasValue*/ true),
    language_flag,
    help_flag,
};

static vector<Flag> log_flags = {
    language_flag,
    help_flag,
};

static const char * init_info =
  "Initialize a L10ns project. This command creates on 'l10ns.json' "
  "file, with sane default options applied.\n\n"
  "Usage: l10ns init";

static const char * sync_info =
  "Synchronize your keys between source code and storage.\n\n"
  "Usage: l10ns sync";

static const char * log_info =
  "Show latest localizations.\n\n"
  "Usage: l10ns log [options]\n"
  "       l10ns log\n"
  "       l10ns log --language en-US";

static const char * set_info =
  "Set new localizations.\n\n"
  "Usage: l10ns set --key <key> --value <value> [options]\n"
  "       l10ns set --key LOGIN_TEXT --value \"Please login.\"\n"
  "       l10ns set --log-index 1 --value \"Please login.\"\n"
  "       l10ns set --search-index 1 --value \"Please login.\"";

static vector<Action> actions = {
    Action(ActionKind::Init, "init", "Initialize project.", init_info, &help_flags),
    Action(ActionKind::Sync, "sync", "Synchronize localization keys.", sync_info, &help_flags),
    Action(ActionKind::Log, "log", "Show latest added localizations.", log_info, &log_flags),
    Action(ActionKind::Set, "set", "Set localization.", set_info, &set_flags),
};

vector<Flag>* current_flags = &default_flags;

vector<Flag>* get_action_flags(ActionKind kind) {
    switch (kind) {
        case ActionKind::Init:
            return &help_flags;
        case ActionKind::Sync:
            return &help_flags;
        case ActionKind::Log:
            return &log_flags;
        case ActionKind::Set:
            return &set_flags;
        default:
            throw invalid_argument("Could not get action flag.");
    }
}

void set_command_flag(Command* command, const Flag* flag, char* value = NULL) {
    switch (flag->kind) {
        case FlagKind::Help:
            command->is_requesting_help = true;
            return;
        case FlagKind::Version:
            command->is_requesting_version = true;
            return;
        default:
            throw invalid_argument("Unknwon command flag.");
    }
}

Command* parse_command_args(int argc, char* argv[]) {
    Command * command = new Command();

    // Flag to optimize has action parsing.
    bool has_action = false;

    // The option flag that is pending for a value.
    const Flag* flag_which_awaits_value = NULL;

    for (int arg_index = 1; arg_index < argc; arg_index++) {
        auto arg = argv[arg_index];
        if (!has_action) {
            if (arg[0] == '-') {
                goto no_action;
            }
            for (auto const& a : actions) {
                if (strcmp(a.name->c_str(), arg) == 0) {
                    command->action = a.kind;
                    has_action = true;
                    current_flags = a.flags;
                    goto end_of_loop;
                }
            }
            if (!has_action) {
                command->add_diagnostics(create_diagnostic(D::Unknown_command, arg));
                goto end_of_loop;
            }

            no_action:;
        }

        if (flag_which_awaits_value == NULL) {
            bool is_known_flag = false;
            for (auto const& flag : *current_flags) {
                if (strcmp(flag.name->c_str(), arg) == 0 || (flag.alias->length() != 0 && strcmp(flag.name->c_str(), arg) == 0)) {
                    if (flag.has_value) {
                        flag_which_awaits_value = &flag;
                    }
                    set_command_flag(command, &flag);
                    is_known_flag = true;
                }
            }
            if (!is_known_flag) {
                command->add_diagnostics(create_diagnostic(D::Unknown_command_flag, arg));
                return command;
            }
        }
        else {
            set_command_flag(command, flag_which_awaits_value, arg);
            flag_which_awaits_value = NULL;
        }

        end_of_loop:;
    }

    return command;
}

} // L10ns
