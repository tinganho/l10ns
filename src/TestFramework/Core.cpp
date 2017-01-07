
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
    function<void(Test* t)> procedure;
    bool success;

    Test(string name, function<void(Test* t)> procedure): name(name), procedure(procedure) {
    }
};

struct Domain {
    string name;
    vector<Test*>tests = {};

    Domain(string name): name(name) {
    }
};

vector<Domain*> domains = {};
Domain * current_domain;

void domain(string name) {
    current_domain = new Domain(name);
    domains.push_back(current_domain);
}

void test(string name, function<void(Test* t)> procedure) {
    auto test = new Test(name, procedure);
    current_domain->tests.push_back(test);
}

int printResult() {
    vector<Test*> failed_tests = {};
    int tests_succeded = 0;
    int tests_failed = 0;
    int tests = 0;
    for (auto const & d : domains) {
        for (auto const & t : d->tests) {
            if (!t->success) {
                failed_tests.push_back(t);
                tests_failed++;
            }
            else {
                tests_succeded++;
            }
            tests++;
        }
    }

    cout << "\e[32m    " + to_string(tests_succeded) + " passed\e[0m" << endl;
    cout << "\e[31m    " + to_string(tests_failed) + " failed\e[0m" << endl;
    cout << "    " + to_string(tests_succeded + tests_failed) + " total" << endl;
    int domain_size = domains.size();
    string domain = domain_size == 1 ? " domain" : " domains";
    cout << "    " + to_string(domain_size) + domain << endl;

    if (tests_failed > 0) {
        cout << endl;
        cout << "Failed tests:" << endl;
        cout << endl;
        for (auto const & t : failed_tests) {
            cout <<  "\e[31m    " + t->name + "\e[0m" << endl;
        }
    }

    return tests_failed == 0 ? 0 : 1;
}

void runTests() {
    cout << endl;
    for (auto const & d : domains) {
        cout << d->name + ":" << endl;
        cout << "    ";
        for (auto const & t : d->tests) {
            try {
                t->procedure(t);
                cout << "\e[32m․\e[0m";
                t->success = true;
            }
            catch (exception & e) {
                cout << "\e[31m․\e[0m";
                t->success = false;
            }
        }
        cout << endl;

    }
    cout << endl;
}

} // TestFramework
