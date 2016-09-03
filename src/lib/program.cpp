
#include <iostream>
#include <boost/asio.hpp>
#include "program.h"
#include "utils.cpp"

using namespace std;
using boost::asio::ip::tcp;

void show_options();
void show_usage_info();

program::program() {
    std::string home_dir = getenv("HOME");
}

std::string folder = "/usr/local/lib/l10ns";
std::string* program::system_library_folder = &folder;

void program::init(int argc, char *argv[]) {
    parse_options(argc, argv);
}

void program::parse_options(int argc, char **argv) {
    string wait_for_value = "";
    for (int i = 1; i < argc; ++i) {
        string arg = argv[i];
        if (arg == "-h" || arg == "--help") {
            show_help();
            return;
        }
        else if (arg == "-v" || arg == "--version") {
            show_version();
            return;
        }

        // Actions
        else if (arg == "sync") {
            start_localization_server();
        }

        // Options
        else if (arg == "--no-color") {
            output_color = false;
        }
        else if (arg == "--verbose") {
            verbose = true;
        }
        else if (arg == "--language" || arg == "-l") {
            wait_for_value = "--language";
            continue;
        }
        else if (arg == "--key" || arg == "-k") {
            wait_for_value = "--key";
            continue;
        }
        else {
            if (wait_for_value == "--language") {
                language = &arg;
                wait_for_value = "";
                continue;
            }
            else if (wait_for_value == "--key") {
                key = &arg;
                wait_for_value = "";
                continue;
            }
            else {
                return;
            }
        }
    }

    if (wait_for_value != "") {
        debug::error("You have not specified a value for '{0}'.", wait_for_value);
        return;
    }

    if (language == nullptr) {
        return;
    }
}

string get_socket_unique_path() {
    boost::uuids::basic_random_generator<boost::mt19937> gen;
    boost::uuids::uuid u = gen();
    return "/tmp/l10ns_" + to_string(u) + ".sock";
}

void program::handle_sig_event(const boost::system::error_code& error, const char* socket_path) {
    if (!error)
    {
        if (socket_path) {
            ::remove(socket_path);
        }
        if (server_) {
            server_->io_service_.stop();
        }
    }
}

void program::start_localization_server()
{
    string socket_path = get_socket_unique_path();
    debug::log("opening socket: " + socket_path);
    ::remove(socket_path.c_str());
    boost::asio::io_service io_service;

    boost::asio::signal_set signals(io_service, SIGINT, SIGTERM);
    signals.async_wait(boost::bind(&program::handle_sig_event,
                                   this,
                                   boost::asio::placeholders::error,
                                   socket_path.c_str()));

    server_ = new server(io_service, socket_path.c_str());
    io_service.run();
}

void program::show_version() const {
    cout << "Version: " << L10NS_VERSION << endl;
}

void program::show_help() const {
    show_version();
    cout << std::endl;
    show_usage_info();
    show_options();
}

void show_usage_info() {
    cout <<
"Syntax: l10ns [action] [options...]\n"
"\n"
"Example: l10ns compile\n"
"         l10ns log\n"
"         l10ns set --index 1 --value \"hello world\"\n"
"         l10ns --help\n";
}

void show_options() {

}
