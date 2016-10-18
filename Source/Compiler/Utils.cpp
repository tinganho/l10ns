
#include <iostream>
#include <string>

using namespace std;

namespace L10ns {
namespace Utils {

    void println(string text) {
        cout << text << endl;
    }

    void println(string text1, string text2) {
        cout << text1 << text2 << endl;
    }

    void println(string text1, string text2, string text3) {
        cout << text1 << text2 << text3 << endl;
    }

    namespace Debug {

    }

} // Utils
} // L10ns
