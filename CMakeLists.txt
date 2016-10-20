cmake_minimum_required(VERSION 3.6)

project(l10ns)

set(VERSION "3.0")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++14")
set(EXECUTABLE_OUTPUT_PATH "Executables")

configure_file(Source/Program/Configurations.h.in Source/Program/Configurations.h)

find_package(Boost 1.40 COMPONENTS system REQUIRED)

include_directories("${PROJECT_BINARY_DIR}")
include_directories("${PROJECT_BINARY_DIR}/Source/Program")
include_directories("${Boost_INCLUDE_DIR}")

add_executable(l10ns Source/Program/Exec.cpp)

target_link_libraries(l10ns ${Boost_LIBRARIES})
