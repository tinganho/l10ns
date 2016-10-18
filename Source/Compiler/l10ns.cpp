
#include <iostream>
#include "Program.cpp"
#include "Configurations.h"

int main(int argc, char* argv[]) {
	auto command = Command::parse(argc, argv);
	if (command->isRequestingVersion) {
		std::cout << "L10ns version " << VERSION << std::endl;
	}
	return 0;
}
