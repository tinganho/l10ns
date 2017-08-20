
#ifndef UTILS_H
#define UTILS_H

#include <cstdio>
#include <memory>
#include <stdexcept>
#include <iostream>
#include <fstream>
#include <string>
#include <sys/ioctl.h>
#include <exception>
#include <boost/asio.hpp>
#include <boost/algorithm/string/replace.hpp>
#include <boost/regex.hpp>
#define BOOST_NO_CXX11_SCOPED_ENUMS
#include <boost/filesystem.hpp>
#undef BOOST_NO_CXX11_SCOPED_ENUMS
#include "glob.h"
#include "Types.cpp"

using namespace std;
using boost::asio::ip::tcp;
namespace fs = boost::filesystem;

namespace L10ns {

Diagnostic* create_diagnostic(DiagnosticTemplate* d) {
    string* message = new string(d->message_template);
    return new Diagnostic(message);
}

Diagnostic* create_diagnostic(DiagnosticTemplate* d, string arg1) {
    string* message = new string(boost::regex_replace(d->message_template, boost::regex("\\{0\\}"), arg1));
    return new Diagnostic(message);
}

Diagnostic* create_diagnostic(DiagnosticTemplate* d, string arg1, string arg2) {
    string message1 = string(boost::regex_replace(d->message_template, boost::regex("\\{0\\}"), arg1));
    string* message2 = new string(boost::regex_replace(message1, boost::regex("\\{1\\}"), arg2));
    return new Diagnostic(message2);
}

void add_diagnostic(Session* session, DiagnosticTemplate* d) {
    session->add_diagnostic(create_diagnostic(d));
}

void add_diagnostic(Session* session, DiagnosticTemplate* d, string arg1) {
    session->add_diagnostic(create_diagnostic(d, arg1));
}

void add_diagnostic(Session* session, DiagnosticTemplate* d, string arg1, string arg2) {
    session->add_diagnostic(create_diagnostic(d, arg1, arg2));
}

string execute_command(const string command) {
    char buffer[128];
    string result = "";
    shared_ptr<FILE> pipe(popen(command.c_str(), "r"), pclose);
    if (!pipe) {
        throw runtime_error("popen() failed!");
    }
    while (!feof(pipe.get())) {
        if (fgets(buffer, 128, pipe.get()) != NULL)
            result += buffer;
    }
    return result;
}

string execute_command(const string command, string cwd) {
    return execute_command("cd " + cwd + " && " + command);
}

void newline() {
    cout << endl;
}

void println(string text) {
    cout << text << endl;
}

void println(string text1, string text2) {
    cout << text1 << text2 << endl;
}

void println(string text1, string text2, string text3) {
    cout << text1 << text2 << text3 << endl;
}

class TextWriter {
public:
    string text;
    vector<int> tabs;

    void add_tab(unsigned int indentation) {
        this->tabs.push_back(indentation);
    }

    void tab() {
        for (int i_tab = 0; i_tab < this->tabs.size(); i_tab++) {
            if (this->column < this->tabs[i_tab]) {
                int diff = this->tabs[i_tab] - column;
                for (int i_diff = 0; i_diff < diff; i_diff++) {
                    this->text += " ";
                }
                this->column += diff;
                break;
            }
            else {
                this->text += " ";
            }
        }
    }

    void clear_tabs() {
        this->tabs.clear();
    }

    void newline() {
        this->text += '\n';
        this->column = 0;
        this->print_indentation();
    }

    void newline(unsigned int amount) {
        for (int i = 0; i < amount; i++) {
            this->text += '\n';
        }
        this->column = 0;
        this->print_indentation();
    }

    void write(string text) {
        this->text += text;
        this->column += text.size();
    }

    void write_line(string text) {
        this->write(text);
        this->newline();
    }

    void print() {
        cout << this->text;
    }

    void indent() {
        this->indentation += this->indentation_step;
    }

    void unindent() {
        this->indentation -= this->indentation_step;
    }

    TextWriter() {
        if (getenv("COLUMNS") != NULL) {
            this->window_width = *(int *)(getenv("COLUMNS"));
        }
        else {
            struct winsize w;
            ioctl(0, TIOCGWINSZ, &w);
            this->window_width = w.ws_col;
        }
    }

private:
    int window_width;
    unsigned int column = 0;
    unsigned int indentation = 0;
    static const unsigned int indentation_step = 2;

    void print_indentation() {
        for (int i = 0; i < this->indentation; i++) {
            this->text += " ";
            this->column += 1;
        }
    }
};

bool file_exists(const string filename) {
    ifstream f(filename.c_str());
    return f.good();
}

string read_file(string filename) {
    std::ifstream t(filename);
    std::stringstream buffer;
    buffer << t.rdbuf();
    return buffer.str();
}

void write_file(string filename, string content) {
    ofstream f;
    f.open(filename);
    f << content;
    f.close();
}

void write_file(string filename, string content, string cwd) {
    write_file(cwd + filename, content);
}

void remove_all(string path) {
    fs::remove_all(fs::path(path));
}

bool copy_folder(fs::path const & source, fs::path const & destination) {
    try {
        if (!fs::exists(source) || !fs::is_directory(source)) {
            std::cerr << "Source directory '" << source.string()
                << "' does not exist or is not a directory." << '\n'
            ;
            return false;
        }
        if (fs::exists(destination)) {
            std::cerr << "Destination directory '" << destination.string()
                << "' already exists." << '\n';
            return false;
        }
        if (!fs::create_directory(destination)) {
            std::cerr << "Unable to create destination directory '" << destination.string() << "'.\n";
            return false;
        }
    }
    catch (fs::filesystem_error const & e) {
        std::cerr << e.what() << '\n';
        return false;
    }
    for (fs::directory_iterator file(source); file != fs::directory_iterator(); ++file) {
        try {
            fs::path current(file->path());
            if(fs::is_directory(current)) {
                if(!copy_folder(current, destination / current.filename())) {
                    return false;
                }
            }
            else {
                fs::copy_file(current, destination / current.filename());
            }
        }
        catch (fs::filesystem_error const & e) {
            cerr << e.what() << '\n';
        }
    }
    return true;
}

string replace_string(string target, string pattern, string replacement) {
    return boost::replace_all_copy(target, pattern, replacement);
}

namespace Debug {
    void fail(string err) {
        throw logic_error(err);
    }
}

void recursively_create_dir(string dir) {
    boost::filesystem::path d(dir);
    boost::filesystem::create_directories(d);
}

vector<string> find_files(string pattern) {
    glob::Glob glob(pattern);
    vector<string> files;
    while (glob) {
        string path = pattern.substr(0, pattern.find_last_of('/'));
        files.push_back(path + '/' + glob.GetFileName());
        glob.Next();
    }
    return files;
}

vector<string> find_files(string pattern, string cwd) {
    if (cwd.front() != '/') {
        throw invalid_argument("Utils::find_files: Current working directory 'p_cwd', must be an absolute path. Got '" + cwd + "'.");
    }
    if (cwd.back() != '/') {
        cwd += '/';
    }
    return find_files(cwd + pattern);
}

string join_paths(string path1, string path2) {
    fs::path p1 (path1);
    fs::path p2 (path2);
    return fs::canonical(p1 / p2).string();
}

string join_paths(string path1, string path2, string path3) {
    fs::path p1 (path1);
    fs::path p2 (path2);
    fs::path p3 (path2);
    return fs::canonical(p1 / p2 / p3).string();
}

string get_cwd() {
    boost::filesystem::path full_path(boost::filesystem::current_path());
    return full_path.string() + "/";
}

} // L10ns

#endif // UTILS_H
