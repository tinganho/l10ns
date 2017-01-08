
#include "CommandController.cpp"
#include <iostream>

using namespace std;

int main(int argc, char* argv[]) {
    try {
	    return L10ns::init(argc, argv);
    }
    catch (const exception& ex) {
        cerr << ex.what() << endl;
        return 1;
    }
}
