
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
#include <boost/filesystem.hpp>
#include "glob.h"

using namespace std;
using boost::asio::ip::tcp;

namespace L10ns {

string executeCommand(const string command) {
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

string executeCommand(const string command, string cwd) {
    return executeCommand("cd " + cwd + " && " + command);
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

    void addTab(unsigned int indentation) {
        tabs.push_back(indentation);
    }

    void tab() {
        for (int tabIndex = 0; tabIndex < tabs.size(); tabIndex++) {
            if (column < tabs[tabIndex]) {
                int diff = tabs[tabIndex] - column;
                for (int diffIndex = 0; tabIndex < diff; tabIndex++) {
                    text += " ";
                }
                column += diff;
            }
        }
    }

    void clearTabs() {
        tabs.clear();
    }

    void newline() {
        text += '\n';
        column = 0;
        printIndentation();
    }

    void newline(unsigned int amount) {
        for (int i = 0; i < amount; i++) {
            text += '\n';
        }
        column = 0;
        printIndentation();
    }

    void write(string ptext) {
        text += ptext;
        column += ptext.size();
    }

    void writeLine(string ptext) {
        text += ptext;
        newline();
    }

    void print() {
        cout << text;
    }

    void indent() {
        indentation += indentationStep;
    }

    void unindent() {
        indentation -= indentationStep;
    }

    TextWriter() {
        if (getenv("COLUMNS") != NULL) {
            windowWidth = *(int *)(getenv("COLUMNS"));
        }
        else {
            struct winsize w;
            ioctl(0, TIOCGWINSZ, &w);
            windowWidth = w.ws_col;
        }
    }

private:
    int windowWidth;
    unsigned int column = 0;
    unsigned int indentation = 0;
    static const unsigned int indentationStep = 2;

    void printIndentation() {
        for (int i = 0; i < indentation; i++) {
            text += " ";
            column += 1;
        }
    }
};

inline bool fileExists(const string & filename) {
    ifstream f(filename.c_str());
    return f.good();
}

inline string readFile(string filename) {
    string line;
    string result;
    ifstream f(filename);
    if (f.is_open()) {
        while (getline(f, line)) {
            result += line;
        }
        f.close();
        return result;
    }
    else {
        throw invalid_argument("Utils::readFile: Could not open file '" + filename + "'.");
    }
}

inline void writeFile(string filename, string content) {
    ofstream f;
    f.open(filename);
    f << content;
    f.close();
}

void remove(string path) {
    boost::filesystem::path p(path);
    remove_all(p);
}

bool copyFolder(boost::filesystem::path const & source, boost::filesystem::path const & destination) {
    namespace fs = boost::filesystem;
    try {
        if (!fs::exists(source) || !fs::is_directory(source)) {
            std::cerr << "Source directory " << source.string()
                << " does not exist or is not a directory." << '\n'
            ;
            return false;
        }
        if (fs::exists(destination)) {
            std::cerr << "Destination directory " << destination.string()
                << " already exists." << '\n';
            return false;
        }

        if (!fs::create_directory(destination)) {
            std::cerr << "Unable to create destination directory" << destination.string() << '\n';
            return false;
        }
    }
    catch(fs::filesystem_error const & e) {
        std::cerr << e.what() << '\n';
        return false;
    }
    for(fs::directory_iterator file(source); file != fs::directory_iterator(); ++file) {
        try {
            fs::path current(file->path());
            if(fs::is_directory(current)) {
                if(!copyFolder(current, destination / current.filename())) {
                    return false;
                }
            }
            else {
                fs::copy_file(current, destination / current.filename());
            }
        }
        catch(fs::filesystem_error const & e) {
            std:: cerr << e.what() << '\n';
        }
    }
    return true;
}

string replaceSubString(string str, string subString, string replacement) {
    return boost::replace_all_copy(str, subString, replacement);
}

namespace Debug {
    void fail(string err) {
        throw logic_error(err);
    }
}

void recursivelyCreateFolder(string folder) {
    boost::filesystem::path dir(folder);
    create_directories(dir);
}

vector<string> findFiles(string pattern) {
    glob::Glob glob(pattern);
    vector<string> files;
    while (glob) {
        string path = pattern.substr(0, pattern.find_last_of('/'));
        files.push_back(path + '/' + glob.GetFileName());
        glob.Next();
    }
    return files;
}

vector<string> findFiles(string pattern, string cwd) {
    if (cwd.front() != '/') {
        throw invalid_argument("Utils::findFiles: Current working directory(cwd) must be an absolute path. Got '" + cwd + "'.");
    }
    if (cwd.back() != '/') {
        cwd += '/';
    }
    return findFiles(cwd + pattern);
}

} // L10ns

#endif // UTILS_H
