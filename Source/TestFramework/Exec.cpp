
#include "ProjectTestRunner.cpp"
#include "Configurations.h"
#include <exception>
#include <iostream>

using namespace std;

int main() {
    try {
        TestFramework::addProjectTests();
        TestFramework::runTests();
        TestFramework::printResult();
        return 0;
    }
    catch (const exception & e) {
        cerr << e.what() << endl;
        return 1;
    }
}
