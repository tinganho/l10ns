
#include <exception>
#include <string>
#include <vector>

using namespace std;

namespace TestFramework {

struct Test {
    string name;
    void (*procedure)();
    bool success;

    Test(string name, void (*procedure)()) {
        name = name;
        procedure = procedure;
    }
};

struct Domain {
    string name;
    vector<Test>tests = {};

    Domain(string name) {
        name = name;
    }
};

vector<Domain *> domains = {};
Domain * currentDomain;

void domain(string name) {
    currentDomain = new Domain(name);
    domains.push_back(currentDomain);
}

void test(string name, void (*procedure)()) {
    auto test = Test(name, procedure);
    try {
        procedure();
        test.success = true;
    }
    catch(exception & e) {
        test.success = false;
    }
}

} // TestFramework
