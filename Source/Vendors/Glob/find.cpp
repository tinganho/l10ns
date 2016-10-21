#include <iostream>
#include "glob.h"

int main(int argc, char **argv) {
  if (argc != 2) {
    std::cerr << "Usage: " << argv[0] << " <pattern>" << std::endl;
    return 1;
  }

  glob::Glob glob(argv[1]);
  while (glob) {
    std::cout << glob.GetFileName() << std::endl;
    glob.Next();
  }

  return 0;
}