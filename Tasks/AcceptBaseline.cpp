
#include "Utils.cpp"
#include "Configurations.h"

using namespace L10ns;

int main() {
    remove(PROJECT_DIR "/Tests/Reference");
    copyFolder(PROJECT_DIR "/Tests/Current", PROJECT_DIR "/Tests/Reference");
}
