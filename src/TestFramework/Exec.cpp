
#include "ProjectTestRunner.cpp"
#include "Configurations.h"
#include <exception>
#include <iostream>

using namespace std;

int main() {
    try {
        remove_all(PROJECT_DIR "src/Tests/Current");
        TestFramework::addProjectTests();
        TestFramework::runTests();
        return TestFramework::printResult();
    }
    catch (const exception & e) {
        cerr << e.what() << endl;
        return 1;
    }
}
