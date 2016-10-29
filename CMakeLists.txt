
cmake_minimum_required(VERSION 3.6)

project(l10ns)

set(VERSION "3.0")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++14")
set(EXECUTABLE_OUTPUT_PATH "Executables")

configure_file(Source/Program/Configurations.h.in Source/Program/Configurations.h)

find_package(Boost 1.60 COMPONENTS system filesystem REQUIRED)

add_subdirectory(Source/Vendors/Glob)

include_directories("${PROJECT_SOURCE_DIR}/Source/Program")
include_directories("${PROJECT_SOURCE_DIR}/Source/Vendors/Glob")

add_executable(l10ns Source/Program/Exec.cpp)
add_executable(run-tests Source/TestFramework/Exec.cpp)

add_executable(accept-baseline Tasks/AcceptBaseline.cpp)

target_link_libraries(l10ns glob ${Boost_LIBRARIES})
target_link_libraries(run-tests glob ${Boost_LIBRARIES})
target_link_libraries(accept-baseline glob ${Boost_LIBRARIES})
