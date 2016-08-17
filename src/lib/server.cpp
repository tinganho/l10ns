
#include <cstdio>
#include <iostream>
#include <boost/array.hpp>
#include <boost/bind.hpp>
#include <boost/enable_shared_from_this.hpp>
#include <boost/asio.hpp>
#include <boost/lexical_cast.hpp>
#include <boost/uuid/uuid_io.hpp>
#include <boost/uuid/random_generator.hpp>

using boost::asio::local::stream_protocol;


#ifndef SERVER_H
#define SERVER_H

class session : public boost::enable_shared_from_this<session>
{
public:
    session(boost::asio::io_service& io_service)
            : socket_(io_service) {}

    stream_protocol::socket& socket()
    {
        return socket_;
    }

    void listen()
    {
        socket_.async_read_some(boost::asio::buffer(data_),
                                boost::bind(&session::handle_read,
                                            shared_from_this(),
                                            boost::asio::placeholders::error,
                                            boost::asio::placeholders::bytes_transferred));
    }

    void handle_read(const boost::system::error_code& error, size_t bytes_transferred)
    {
        if (!error)
        {
            boost::asio::async_write(socket_,
                                     boost::asio::buffer(data_, bytes_transferred),
                                     boost::bind(&session::handle_write,
                                                 shared_from_this(),
                                                 boost::asio::placeholders::error));
        }
    }

    void handle_write(const boost::system::error_code& error)
    {
        if (!error)
        {
            listen();
        }
    }

private:
#if defined(BOOST_ASIO_HAS_LOCAL_SOCKETS)
    stream_protocol::socket socket_;
#else
    tcp::socket socket_;
#endif
    boost::array<char, 1024> data_;
};

typedef boost::shared_ptr<session> session_ptr;

class server
{
public:
#if defined(BOOST_ASIO_HAS_LOCAL_SOCKETS)
    server(boost::asio::io_service& io_service, const std::string& file)
        : io_service_(io_service), acceptor_(io_service, stream_protocol::endpoint(file)) {
#else
        server(boost::asio::io_service& io_service, const std::string& file)
        : io_service_(io_service), acceptor_(io_service, tcp::endpoint(tcp::v4(), 39999)) {
#endif

        listen_to_new_connections();
    }

    const char* socket_path;
    boost::asio::io_service& io_service_;

#if defined(BOOST_ASIO_HAS_LOCAL_SOCKETS)
    stream_protocol::acceptor acceptor_;
#else
    tcp::acceptor acceptor_;
#endif

private:
    void listen_to_new_connections()
    {
        session_ptr new_session(new session(io_service_));
        acceptor_.async_accept(new_session->socket(),
                               boost::bind(&server::handle_accept, this, new_session,
                                           boost::asio::placeholders::error));
    }

    void handle_accept(session_ptr new_session, const boost::system::error_code& error)
    {
        if (!error)
        {
            new_session->listen();
            listen_to_new_connections();
        }
    }

};

#endif