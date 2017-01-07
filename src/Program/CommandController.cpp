
#include <string>
#include <iostream>
#include <boost/bind.hpp>
#include <boost/enable_shared_from_this.hpp>
#include <boost/asio.hpp>
#include <boost/shared_ptr.hpp>
#include "CommandParser.cpp"
#include "Configurations.h"
#include "Utils.cpp"
#include "json.hpp"

using namespace std;
using json = nlohmann::json;

namespace L10ns {

class TCPConnection : public boost::enable_shared_from_this<TCPConnection> {
public:
    typedef boost::shared_ptr<TCPConnection> Pointer;

    static Pointer create(boost::asio::io_service& service) {
        return Pointer(new TCPConnection(service));
    }

    tcp::socket& socket() {
        return _socket;
    }

    void start() {
        boost::asio::async_write(_socket, boost::asio::buffer(message),
            boost::bind(&TCPConnection::handle_write, shared_from_this(),
            boost::asio::placeholders::error,
            boost::asio::placeholders::bytes_transferred));
    }

private:
    TCPConnection(boost::asio::io_service& service)
        : _socket(service) {
    }

    void handle_write(const boost::system::error_code& /*error*/, size_t /*bytes_transferred*/)
    {
    }

    tcp::socket _socket;
    std::string message;
};

class TCPServer {
public:
    tcp::endpoint endpoint;

    TCPServer(boost::asio::io_service& service, string command)
        : endpoint(tcp::v4(), 0)
        , local_endpoint(acceptor.local_endpoint())
        , acceptor(service, endpoint) {

        start_accept();
        execute_command("IS_USING_TCP_SERVER=1 EXTENSION_SERVER_PORT=" + port() + " " + command);
    }

    string port() {
        return to_string(local_endpoint.port());
    }

private:
    tcp::acceptor acceptor;
    tcp::endpoint local_endpoint;

    void start_accept() {
        TCPConnection::Pointer new_connection = TCPConnection::create(acceptor.get_io_service());
        acceptor.async_accept(new_connection->socket(),
            boost::bind(&TCPServer::handle_accept, this, new_connection,
                boost::asio::placeholders::error));
    }

    void handle_accept(TCPConnection::Pointer new_connection, const boost::system::error_code& error) {
        if (!error) {
            new_connection->start();
        }

        start_accept();
    }
};

void start_extension_server(Session* session) {
    try {
        vector<string> files = find_files(PROJECT_DIR "Source/Extensions/*/Extension.json");
        string command;
        bool found_matching_programming_language = false;
        for (auto const& f : files) {
            json package = json::parse(read_file(f));
            string pl = package["ProgrammingLanguage"];
            if (pl == *session->programming_language) {
                found_matching_programming_language = true;
                command = package["Execute"];
                break;
            }
        }
        if (!found_matching_programming_language) {
            throw invalid_argument("No matching programming language for" + *session->programming_language);
        }
        boost::asio::io_service service;
        TCPServer server(service, command);
        service.run();
    }
    catch (exception& e) {
        cerr << e.what() << endl;
    }
}

inline void print_default_help_info() {
    auto w = new TextWriter();
    w->add_tab(2);
    w->add_tab(10);
    w->write_line("Usage: l10ns [<options>] <command>");
    w->newline();
    w->write_line("Commands:");
    w->newline();
    for (const auto& action : actions) {
        w->tab();
        w->write(*action.name);
        w->tab();
        w->write_line(*action.description);
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

inline Action* get_action(ActionKind action) {
    for (int i = 0; i < actions.size(); i++) {
        if (actions[i].kind == action) {
            return &actions[i];
        }
    }

    throw logic_error("Could not get action name.");
}

inline void print_action_help_info(Session* session) {
    auto a = get_action(session->action);
    auto w = new TextWriter();
    w->write_line(*a->info);
    w->newline();
    w->write_line("Options:");
    w->clear_tabs();
    w->add_tab(2);
    w->add_tab(24);
    w->newline();
    for (const auto& flag : *get_action_flags(session->action)) {
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

inline void print_command_help_info(Session* session) {
    if (session->action == ActionKind::None) {
        print_default_help_info();
    }
    else {
        print_action_help_info(session);
    }
}

inline void print_diagnostics(vector<Diagnostic*> diagnostics) {
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
        print_command_help_info(session);
    }
    else if (session->action == ActionKind::Sync) {
        start_extension_server(session);
    }
    return 0;
}
} // L10ns
