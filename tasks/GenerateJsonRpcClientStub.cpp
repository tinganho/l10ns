
#include <string>
#include <cstdlib>
#include "Configurations.h"

using namespace std;

int main() {
    string program_dir = PROJECT_DIR "src/Program";
    std::system((string("cd ") + program_dir).c_str());
    std::system("jsonrpcstub RpcCalls.json --cpp-client=JsonRpcClient --cpp-client-file=JsonRpcClient.h");
}
