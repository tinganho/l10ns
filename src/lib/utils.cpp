
#include <string>
#include <iostream>
#include <boost/algorithm/string/replace.hpp>

#ifndef L10NS_UTILS_H
#define L10NS_UTILS_H

enum debug_flags {
    none       = 0,
    logs       = 1 << 1,
    errors     = 1 << 2,
};

class color {
public:
    static bool use_colors;

    static std::string cyan(std::string const& text) {
        if (use_colors) {
            return "\033[36m" + text + "\033[39m";
        }
        return text;
    }

    static std::string red(std::string const& text) {
        if (use_colors) {
            return "\033[0;31m" + text + "\033[0m";
        }
        return text;
    }

    static std::string yellow(std::string const& text) {
        if (use_colors) {
            return "\033[33m" + text + " \033[0m";
        }
        return text;
    }
};

bool color::use_colors = true;

class debug {
public:
    static int flags;

    static std::string time_stamp() {
        char formatted_time[10];
        time_t t = time(NULL);
        strftime(formatted_time, sizeof(formatted_time), "%H:%M", localtime(&t));
        return std::string(formatted_time);
    }

    static void assert_(bool& expr, std::string& message) {
        if (!expr && flags & debug_flags::errors) {
            error(message);
            throw std::domain_error(message);
        }
    }

    static void assert_(std::string const & message) {
        if (flags & debug_flags::errors) {
            error(message);
            throw std::domain_error(message);
        }
    }

    static void log(std::string const & message) {
        if (flags & debug_flags::logs) {
            std::cout << color::cyan("Log") + " " + time_stamp() + ": " + message << std::endl;
        }
    }

    static void log(std::string const & message, std::string const & arg1) {
        if (flags & debug_flags::logs) {
            auto message1 = boost::replace_all_copy(message, "{0}", arg1);
            log(message1);
        }
    }

    static void log(std::string const & message, std::string const & arg1, std::string const & arg2) {
        if (flags & debug_flags::logs) {
            auto message1 = boost::replace_all_copy(message, "{0}", arg1);
            auto message2 = boost::replace_all_copy(message1, "{1}", arg2);
            log(message2);
        }
    }

    static void error(std::string const & message) {
        if (flags & debug_flags::errors) {
            std::cout << color::red("Error") + " " + time_stamp() + ": " + message << std::endl;
        }
    }

    static void error(std::string const & message, std::string const & arg1) {
        if (flags & debug_flags::errors) {
            auto message1 = boost::replace_all_copy(message, "{0}", arg1);
            error(message1);
        }
    }

    static void error(std::string const & message, std::string const & arg1,std::string const & arg2) {
        if (flags & debug_flags::errors) {
            auto message1 = boost::replace_all_copy(message, "{0}", arg1);
            auto message2 = boost::replace_all_copy(message1, "{1}", arg2);
            error(message2);
        }
    }
};

int debug::flags = debug_flags::errors;

#endif