
#include <cstdlib>
#include <string>
#include "Configurations.h"

using namespace std;

int main() {
    string current_dir = PROJECT_DIR "src/Tests/Current/";
    string reference_dir = PROJECT_DIR "src/Tests/Reference/";
    string cmd = "$DIFF " + reference_dir + " " + current_dir;
    std::system(cmd.c_str());
}
