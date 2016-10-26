
#include "ProjectTestRunner.cpp"
#include "Configurations.h"
#include <exception>
#include <iostream>

using namespace std;

int main() {
    try {
        TestFramework::runProjectTests();
        return 0;
    }
    catch (const exception & ex) {
        cerr << ex.what() << endl;
        return 1;
    }
}
