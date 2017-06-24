
#include <string>
#include <iostream>
#include "CommandParser.cpp"
#include "Configurations.h"
#include "Utils.cpp"
#include "json.hpp"
#include "Extension.cpp"
#include "ExtensionTestRunner.cpp"

using namespace std;
using json = nlohmann::json;

namespace L10ns {

void print_default_help_info() {
    auto w = new TextWriter();
    w->add_tab(2);
    w->add_tab(10);
    w->write_line("Usage: l10ns [<options>] <command>");
    w->newline();
    w->write_line("Commands:");
    w->newline();
    for (const auto& command : commands) {
        w->tab();
        w->write(*command.name);
        w->tab();
        w->write_line(*command.description);
    }
    w->newline();
    w->write_line("For more details: 'l10ns <command> --help'.");
    w->newline();
    w->clear_tabs();
    w->add_tab(2);
    w->add_tab(17);
    w->write_line("Options:");
    w->newline();
    for (const auto& flag : default_flags) {
        w->tab();
        if (flag.alias->length() != 0) {
            w->write(*flag.name + ", " + *flag.alias);
        }
        else {
            w->write(*flag.name);
        }
        w->tab();
        w->write_line(*flag.description);
    }
    w->print();
}

inline Command* get_command(CommandKind command) {
    for (int i = 0; i < commands.size(); i++) {
        if (commands[i].kind == command) {
            return &commands[i];
        }
    }

    throw logic_error("Could not get command name.");
}

inline void print_command_help_info(CommandKind command) {
    auto a = get_command(command);
    auto w = new TextWriter();
    w->write_line(*a->info);
    w->newline();
    w->write_line("Options:");
    w->clear_tabs();
    w->add_tab(2);
    w->add_tab(24);
    w->newline();
    for (const auto& flag : *get_command_flags(command)) {
        w->tab();
        if (flag.alias->length() != 0) {
            w->write(*flag.name + ", " + *flag.alias);
        }
        else {
            w->write(*flag.name);
        }
        w->tab();
        w->write_line(*flag.description);
    }
    w->print();
}

inline void print_help_info(Session* session) {
    if (session->command == CommandKind::None) {
        print_default_help_info();
    }
    else {
        print_command_help_info(session->command);
    }
}

void print_diagnostics(vector<Diagnostic*> diagnostics) {
    for (auto const& d : diagnostics) {
        cout << *d->message << endl;
    }
}

int init(int argc, char* argv[]) {
    auto session = parse_command_args(argc, argv);
    if (session->diagnostics.size() > 0) {
        print_diagnostics(session->diagnostics);
        return 1;
    }
    if (session->is_requesting_version) {
        println("L10ns version ", VERSION, ".");
    }
    else if (session->is_requesting_help) {
        print_help_info(session);
    }
    else {
        switch (session->command) {
            case CommandKind::Init:
                break;
            case CommandKind::Log:
                break;
            case CommandKind::Set:
                break;
            case CommandKind::Extension_RunTests:
                run_extension_tests(session);
                break;
            case CommandKind::Extension_AcceptBaselines: {
                string extension_file = join_paths(*session->root_dir, "Extension.json");
                Extension* extension = Extension::create(session, extension_file);
                string currents_dir = join_paths(*session->root_dir, extension->test_dir + "/Currents");
                string references_dir = replace_string(currents_dir, "Currents", "References");
                remove_all(references_dir);
                copy_folder(currents_dir, references_dir);
                break;
            }
            default:
                break;
        }
    }
    return 0;
}
} // L10ns
