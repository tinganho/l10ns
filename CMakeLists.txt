cmake_minimum_required(VERSION 3.6)

project(l10ns)

set (L10NS_VERSION_MAJOR 0)
set (L10NS_VERSION_MINOR 1)
set (L10NS_VERSION_PATCH 0)
set(L10NS_VERSION
        ${L10NS_VERSION_MAJOR}.${L10NS_VERSION_MINOR}.${L10NS_VERSION_PATCH})

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++14")

# configure a header file to pass some of the CMake settings
configure_file("${PROJECT_SOURCE_DIR}/src/lib/program.h.in"
        "${PROJECT_SOURCE_DIR}/src/lib/program.h")

include_directories("${PROJECT_SOURCE_DIR}/src/lib")
include_directories("${PROJECT_BINARY_DIR}")
include_directories(${Boost_INCLUDE_DIRS})

set(Boost_USE_STATIC_LIBS ON)
find_package(Boost COMPONENTS system)


add_library(CommandLineParser STATIC
        src/lib/program.cpp src/lib/types.h src/lib/server.cpp src/lib/utils.cpp)

add_executable(l10ns src/main.cpp)
target_link_libraries(l10ns CommandLineParser)
target_link_libraries(l10ns ${Boost_SYSTEM_LIBRARY})