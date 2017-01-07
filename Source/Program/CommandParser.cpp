
#include <vector>
#include <string>
#include "Utils.cpp"
#include "Types.cpp"
#include "Diagnostics.cpp"

using namespace std;

namespace L10ns {

static Flag help_flag = Flag(FlagKind::Help, "--help", "-h", "Print help description.", /*has_value*/ false);
static Flag language_flag = Flag(FlagKind::Language, "--language", "-l", "Specify language.", false);
static Flag root_dir = Flag(FlagKind::Help, "--rootDir", "-rd", "Specify current root dir(mainly for testing purposes).", /*has_value*/ true);

static vector<Flag> default_flags = {
    help_flag,
    root_dir,
    Flag(FlagKind::Version, "--version", "", "Print current version.", /*has_value*/ false),
};

static vector<Flag> help_flags = {
    help_flag,
};

static vector<Flag> set_flags = {
    Flag(FlagKind::Key, "--key", "-k", "Specify localization key.", /*has_value*/ true),
    Flag(FlagKind::Value, "--value", "-v", "Specify localization value.", /*has_value*/ true),
    Flag(FlagKind::Value, "--log-index", "-li", "Specify log index.", /*has_value*/ true),
    Flag(FlagKind::Value, "--search-index", "-se", "Specify latest search index.", /*has_value*/ true),
    language_flag,
    help_flag,
    root_dir,
};

static vector<Flag> log_flags = {
    language_flag,
    help_flag,
    root_dir,
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

struct Session {
    bool is_requesting_help;
    bool is_requesting_version;
    string* root_dir;
    ActionKind action;
    vector<Diagnostic*> diagnostics;
    string* programming_language;

    Session()
        : is_requesting_help(false)
        , is_requesting_version(false)
        , action(ActionKind::None) {
    }

    void add_diagnostics(Diagnostic* diagnostic) {
        diagnostics.push_back(diagnostic);
    }

    void write_file(string filename, string content) {
        L10ns::write_file(filename, content, *root_dir);
    }
};

void set_command_flag(Session* session, const Flag* flag, char* value = NULL) {
    switch (flag->kind) {
        case FlagKind::Help:
            session->is_requesting_help = true;
            return;
        case FlagKind::Version:
            session->is_requesting_version = true;
            return;
        case FlagKind::RootDir:
            session->root_dir = new string(value);
            return;
        default:
            throw invalid_argument("Unknown command flag.");
    }
}

Session* parse_command_args(int argc, char* argv[]) {
    Session* session = new Session();
    session->root_dir = get_cwd();

    // Flag to optimize parsing.
    bool has_action = false;

    // The option flag that is pending for a value.
    const Flag* flag_which_awaits_value = NULL;

    for (int arg_index = 1; arg_index < argc; arg_index++) {
        auto arg = argv[arg_index];
        if (!has_action && arg_index == 1) {
            if (arg[0] == '-') {
                goto no_action;
            }
            for (auto const& a : actions) {
                if (strcmp(a.name->c_str(), arg) == 0) {
                    session->action = a.kind;
                    has_action = true;
                    current_flags = a.flags;
                    goto end_of_loop;
                }
            }
            if (!has_action) {
                session->add_diagnostics(create_diagnostic(D::Unknown_command, arg));
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
                    set_command_flag(session, &flag);
                    is_known_flag = true;
                }
            }
            if (!is_known_flag) {
                session->add_diagnostics(create_diagnostic(D::Unknown_command_flag, arg));
                return session;
            }
        }
        else {
            set_command_flag(session, flag_which_awaits_value, arg);
            flag_which_awaits_value = NULL;
        }

        end_of_loop:;
    }

    if (!file_exists(*session->root_dir + "l10ns.json") && !(session->is_requesting_help || session->is_requesting_version)) {
        session->add_diagnostics(create_diagnostic(D::You_are_not_inside_a_L10ns_project));
    }

    return session;
}
} // L10ns
