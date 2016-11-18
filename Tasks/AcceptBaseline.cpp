
#include "Utils.cpp"
#include "Configurations.h"

using namespace L10ns;

int main() {
    remove_all(PROJECT_DIR "Tests/Reference");
    copy_folder(PROJECT_DIR "Tests/Current", PROJECT_DIR "Tests/Reference");
}
