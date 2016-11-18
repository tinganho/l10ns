
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

Diagnostic* create_diagnostic(DiagnosticTemplate* d, string arg1) {
    string* message = new string(boost::regex_replace(d->message_template, boost::regex("\\{0\\}"), arg1));
    return new Diagnostic(message);
}

string execute_command(const string p_command) {
    char buffer[128];
    string result = "";
    shared_ptr<FILE> pipe(popen(p_command.c_str(), "r"), pclose);
    if (!pipe) {
        throw runtime_error("popen() failed!");
    }
    while (!feof(pipe.get())) {
        if (fgets(buffer, 128, pipe.get()) != NULL)
            result += buffer;
    }
    return result;
}

string execute_command(const string p_command, string p_cwd) {
    return execute_command("cd " + p_cwd + " && " + p_command);
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

inline bool file_exists(const string & filename) {
    ifstream f(filename.c_str());
    return f.good();
}

inline string read_file(string filename) {
    string line;
    string result;
    ifstream f(filename);
    if (f.is_open()) {
        while (getline(f, line)) {
            result += line + '\n';
        }
        f.close();
        return result;
    }
    else {
        throw invalid_argument("Utils::readFile: Could not open file '" + filename + "'.");
    }
}

inline void write_file(string filename, string content) {
    ofstream f;
    f.open(filename);
    f << content;
    f.close();
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
            std:: cerr << e.what() << '\n';
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

void recursively_create_folder(string folder) {
    boost::filesystem::path dir(folder);
    create_directories(dir);
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

} // L10ns

#endif // UTILS_H
