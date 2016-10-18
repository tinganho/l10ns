cmake_minimum_required(VERSION 3.6)
set(VERSION "3.0")
project(l10ns)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++14")
set(EXECUTABLE_OUTPUT_PATH "Executables")
include_directories("${PROJECT_BINARY_DIR}")
include_directories("${PROJECT_BINARY_DIR}/Source/Program")

configure_file(Source/Program/Configurations.h.in Source/Program/Configurations.h)

add_executable(l10ns Source/Program/Exec.cpp)
