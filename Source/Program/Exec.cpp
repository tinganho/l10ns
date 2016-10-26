
#include "CommandController.cpp"

int main(int argc, char* argv[]) {
    try {
	    return L10ns::init(argc, argv);
    }
    catch (const exception & ex) {
        return 1;
    }
}
