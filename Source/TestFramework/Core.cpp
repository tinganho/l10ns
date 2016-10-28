
#include <exception>
#include <string>
#include <iostream>
#include <vector>
#include <functional>
#include "Utils.cpp"

using namespace std;
using namespace L10ns;

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
    vector<Test*> failedTests = {};
    int testsSucceded = 0;
    int testsFailed = 0;
    int tests = 0;
    for (auto const & d : domains) {
        for (auto const & t : d->tests) {
            if (!t->success) {
                failedTests.push_back(t);
                testsFailed++;
            }
            else {
                testsSucceded++;
            }
            tests++;
        }
    }

    cout << "\e[32m  " + to_string(testsSucceded) + " passed\e[0m" << endl;
    cout << "\e[31m  " + to_string(testsFailed) + " failed\e[0m" << endl;
    cout << "  " + to_string(testsSucceded + testsFailed) + " total" << endl;
    int domainSize = domains.size();
    string domain = domainSize == 1 ? " domain" : " domains";
    cout << "  " + to_string(domainSize) + domain << endl;
}

void runTests() {
    cout << endl;
    for (auto const & d : domains) {
        cout << "  Domain: " << d->name << endl;
        cout << "  ";
        for (auto const & t : d->tests) {
            try {
                t->procedure();
                cout << "\e[32m․\e[0m";
                t->success = true;
            }
            catch(exception & e) {
                cout << "\e[31m․\e[0m";
                t->success = false;
            }
        }
        cout << endl;

    }
    cout << endl;
}

} // TestFramework
