
#include <stdexcept>
#include <iostream>
#include <string>
#include <sys/ioctl.h>

using namespace std;

namespace L10ns {

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

    namespace Debug {
        void fail(string err) {
            throw logic_error(err);
        }

        void assert(bool assertion, string err) {
            if (!assertion) {
                fail(err);
            }
        }
    }

} // L10ns
