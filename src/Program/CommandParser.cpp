
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
};

static vector<Flag> log_flags = {
    language_flag,
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

static vector<Command> commands = {
    Command(CommandKind::Init, "init", "Initialize project.", init_info, NULL),
    Command(CommandKind::Sync, "sync", "Synchronize localization keys.", sync_info, NULL),
    Command(CommandKind::Log, "log", "Show latest added localizations.", log_info, &log_flags),
    Command(CommandKind::Set, "set", "Set localization.", set_info, &set_flags),
};

vector<Flag>* get_command_flags(CommandKind kind) {
    switch (kind) {
        case CommandKind::Init:
            return &help_flags;
        case CommandKind::Sync:
            return &help_flags;
        case CommandKind::Log:
            return &log_flags;
        case CommandKind::Set:
            return &set_flags;
        default:
            throw invalid_argument("Could not get action flag.");
    }
}

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

void add_diagnostic(Session* session, DiagnosticTemplate* d) {
    session->add_diagnostics(create_diagnostic(d));
}

void add_diagnostic(Session* session, DiagnosticTemplate* d, string arg1) {
    session->add_diagnostics(create_diagnostic(d, arg1));
}

Session* parse_command_args(int argc, char* argv[]) {
    Session* session = new Session();
    session->root_dir = get_cwd();

    // Flag to optimize parsing.
    bool has_command = false;

    // The option flag that is pending for a value.
    const Flag* flag_which_awaits_value = NULL;
    vector<Flag> all_flags(default_flags);

    auto add_command = [&](const char* arg) -> void {
        if (has_command) {
            add_diagnostic(session, D::You_cannot_run_several_commands);
            goto end;
        }

        for (auto const& command : commands) {
            if (strcmp(command.name->c_str(), arg) == 0) {
                session->command = command.kind;
                if (command.flags != NULL) {
                    all_flags.insert(all_flags.end(), command.flags->begin(), command.flags->end());
                }
                has_command = true;
                goto end;
            }
        }

        // We can only reach here if the command is unknown.
        add_diagnostic(session, D::Unknown_command, arg);

        end:;
    };

    auto set_command = [&](const char* arg) -> bool {
        for (auto const& flag : all_flags) {
            if (strcmp(flag.name->c_str(), arg) == 0 || (flag.alias->length() != 0 && strcmp(flag.name->c_str(), arg) == 0)) {
                if (flag.has_value) {
                    flag_which_awaits_value = &flag;
                }
                set_command_flag(session, &flag);
                return true;
            }
        }

        return false;
    };

    auto for_each_arg = [&](std::function<void (char*)> callback) -> void {
        for (int arg_index = 1; arg_index < argc; arg_index++) {
            callback(argv[arg_index]);
        }
    };

    for_each_arg([&](char* arg) -> void {
        if (flag_which_awaits_value == NULL) {
            if (arg[0] != '-') {
                add_command(arg);
            }
            else if (!set_command(arg)) {
                add_diagnostic(session, D::Unknown_command_flag, arg);
            }
        }
        else {
            set_command_flag(session, flag_which_awaits_value, arg);
            flag_which_awaits_value = NULL;
        }
    });

    if (!file_exists(*session->root_dir + "l10ns.json") && !(session->is_requesting_help || session->is_requesting_version)) {
        add_diagnostic(session, D::You_are_not_inside_a_L10ns_project);
    }

    return session;
}
} // L10ns
