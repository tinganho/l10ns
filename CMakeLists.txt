
cmake_minimum_required(VERSION 3.2)

project(l10ns)

set(VERSION "3.0")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++14")
set(EXECUTABLE_OUTPUT_PATH "Executables")

configure_file(${PROJECT_SOURCE_DIR}/Source/Program/Configurations.h.in ${PROJECT_SOURCE_DIR}/Source/Program/Configurations.h)

find_package(Boost 1.54 COMPONENTS system filesystem REQUIRED)

add_subdirectory(Source/Vendors/Glob)

include_directories("${PROJECT_SOURCE_DIR}/Source/Program")
include_directories("${PROJECT_SOURCE_DIR}/Source/Vendors/Glob")

add_executable(l10ns Source/Program/Exec.cpp)
add_executable(run-tests Source/TestFramework/Exec.cpp)

add_executable(accept-baseline Tasks/AcceptBaseline.cpp)
add_executable(generate-diagnostics Tasks/GenerateDiagnostics.cpp)

target_link_libraries(l10ns glob ${Boost_LIBRARIES})
target_link_libraries(run-tests glob ${Boost_LIBRARIES})
target_link_libraries(accept-baseline glob ${Boost_LIBRARIES})
target_link_libraries(generate-diagnostics glob ${Boost_LIBRARIES})
