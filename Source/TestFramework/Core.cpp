
#include <exception>
#include <string>
#include <iostream>
#include <vector>
#include <functional>

using namespace std;

namespace TestFramework {

struct Test {
    string name;
    function<void()> procedure;
    bool success;

    Test(string name, function<void()> procedure): name(name), procedure(procedure) {
    }
};

struct Domain {
    string name;
    vector<Test *>tests = {};

    Domain(string name): name(name) {
    }
};

vector<Domain *> domains = {};
Domain * currentDomain;

void domain(string name) {
    currentDomain = new Domain(name);
    domains.push_back(currentDomain);
}

void test(string name, function<void()> procedure) {
    auto test = new Test(name, procedure);
    currentDomain->tests.push_back(test);
}

void printResult() {
    for (auto const & d : domains) {
        for (auto const & t : d->tests) {
            if (!t->success) {
                cout << "Error: " + t->name << endl;
            }
        }
    }
}

void runTests() {
    for (auto const & d : domains) {
        for (auto const & t : d->tests) {
            try {
                t->procedure();
                t->success = true;
            }
            catch(exception & e) {
                t->success = false;
            }
        }
    }
}

} // TestFramework
