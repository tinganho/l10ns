
#include <cstdlib>
#include <string>
#include "Configurations.h"

using namespace std;

int main() {
    string current_dir = PROJECT_DIR "Tests/Current/";
    string baseline_dir = PROJECT_DIR "Tests/Reference/";
    string cmd = "$DIFF " + current_dir + " " + baseline_dir;
    std::system(cmd.c_str());
}
