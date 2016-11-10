
#include <string>
#include <iostream>
#include <boost/bind.hpp>
#include <boost/enable_shared_from_this.hpp>
#include <boost/asio.hpp>
#include <boost/shared_ptr.hpp>
#include "CommandParser.cpp"
#include "Configurations.h"
#include "Utils.cpp"

using namespace std;

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
            boost::bind(&TCPConnection::handleWrite, shared_from_this(),
            boost::asio::placeholders::error,
            boost::asio::placeholders::bytes_transferred));
    }

private:
    TCPConnection(boost::asio::io_service& service)
        : _socket(service) {
    }

    void handleWrite(const boost::system::error_code& /*error*/, size_t /*bytes_transferred*/)
    {
    }

    tcp::socket _socket;
    std::string message;
};

class TCPServer {
public:
    tcp::endpoint endpoint;

    TCPServer(boost::asio::io_service& service)
        : endpoint(tcp::v4(), 0)
        , localEndpoint(acceptor.local_endpoint())
        , acceptor(service, endpoint) {

        startAccept();
        executeCommand("L10NS_IS_USING_TCP_SERVER=1 L10NS_EXTENSION_SERVER_PORT=" + port() + " ./test");
    }

    string port() {
        return to_string(localEndpoint.port());
    }

private:
    tcp::acceptor acceptor;
    tcp::endpoint localEndpoint;

    void startAccept() {
        TCPConnection::Pointer newConnection = TCPConnection::create(acceptor.get_io_service());
        acceptor.async_accept(newConnection->socket(),
            boost::bind(&TCPServer::handleAccept, this, newConnection,
                boost::asio::placeholders::error));
    }

    void handleAccept(TCPConnection::Pointer newConnection, const boost::system::error_code& error) {
        if (!error) {
            newConnection->start();
        }

        startAccept();
    }
};

void startExtensionServer() {
    try {
        boost::asio::io_service service;
        TCPServer server(service);
        service.run();
    }
    catch (exception& e) {
        std::cerr << e.what() << std::endl;
    }
}

inline void printDefaultHelp() {
    auto w = new TextWriter();
    w->addTab(2);
    w->addTab(12);
    w->writeLine("Usage: l10ns [<options>] <command>");
    w->newline();
    w->writeLine("Commands:");
    w->newline();
    for (const auto& action : actions) {
        w->tab();
        w->write(*action.name);
        w->tab();
        w->writeLine(*action.description);
    }
    w->newline();
    w->writeLine("For more details: 'l10ns <command> --help'.");
    w->newline();
    w->clearTabs();
    w->addTab(2);
    w->addTab(17);
    w->writeLine("Options:");
    w->newline();
    for (const auto& flag : defaultFlags) {
        w->tab();
        if (flag.alias->length() != 0) {
            w->write(*flag.name + ", " + *flag.alias);
        }
        else {
            w->write(*flag.name);
        }
        w->tab();
        w->writeLine(*flag.description);
    }
    w->print();
}

inline Action * getAction(ActionKind action) {
    for (int i = 0; i < actions.size(); i++) {
        if (actions[i].kind == action) {
            return &actions[i];
        }
    }

    throw logic_error("Could not get action name.");
}

inline void printActionHelp(Command * command) {
    auto a = getAction(command->action);
    auto w = new TextWriter();
    w->writeLine(*a->info);
    w->newline();
    w->writeLine("Options:");
    w->clearTabs();
    w->addTab(2);
    w->addTab(24);
    w->newline();
    for (const auto& flag : *getActionFlags(command->action)) {
        w->tab();
        if (flag.alias->length() != 0) {
            w->write(*flag.name + ", " + *flag.alias);
        }
        else {
            w->write(*flag.name);
        }
        w->tab();
        w->writeLine(*flag.description);
    }
    w->print();
}

inline void printCommandHelp(Command * command) {
    if (command->action == ActionKind::None) {
        printDefaultHelp();
    }
    else {
        printActionHelp(command);
    }
}

void synchronizeKeys() {
    startExtensionServer();
}

inline void printDiagnostics(vector<Diagnostic*> diagnostics) {
    for (auto const & d : diagnostics) {
        cout << d->message << endl;
    }
}

int init(int argc, char * argv[]) {
    auto command = parseCommandArguments(argc, argv);
    if (command->diagnostics.size() > 0) {
        printDiagnostics(command->diagnostics);
        return 1;
    }
    cout << command->diagnostics.size() << endl;
    if (command->isRequestingVersion) {
        println("L10ns version ", VERSION, ".");
    }
    else if (command->isRequestingHelp) {
        printCommandHelp(command);
    }
    else if (command->action == ActionKind::Sync) {
        synchronizeKeys();
    }
    return 0;
}
} // L10ns
