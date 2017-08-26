
cmake_minimum_required(VERSION 3.2)

project(l10ns)

set(VERSION "3.0")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++14")
set(EXECUTABLE_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/bin)

# See: https://stackoverflow.com/questions/6468681/failed-linking-to-boost-library-with-cmake-generated-project-file-for-msvc9
add_definitions( -DBOOST_ALL_NO_LIB )
set(Boost_USE_STATIC_LIBS ON)

configure_file(${PROJECT_SOURCE_DIR}/src/Program/Configurations.h.in ${PROJECT_SOURCE_DIR}/src/Program/Configurations.h)
set(Boost_DEBUG on)
find_package(Boost 1.64 COMPONENTS system filesystem regex REQUIRED)

add_subdirectory(third_party/glob)
add_subdirectory(third_party/grpc)
add_subdirectory(third_party/jsoncpp)

include_directories("${PROJECT_SOURCE_DIR}/src/Program")
include_directories("${PROJECT_SOURCE_DIR}/src/TestFramework")
include_directories("${PROJECT_SOURCE_DIR}/third_party/glob")

add_executable(l10ns ${PROJECT_SOURCE_DIR}/src/Program/Exec.cpp)

add_executable(accept-baseline ${PROJECT_SOURCE_DIR}/tasks/AcceptBaseline.cpp)
add_executable(clean-project ${PROJECT_SOURCE_DIR}/tasks/Clean.cpp)
add_executable(diff ${PROJECT_SOURCE_DIR}/tasks/Diff.cpp)
add_executable(generate-diagnostics ${PROJECT_SOURCE_DIR}/tasks/GenerateDiagnostics.cpp)
add_executable(run-tests ${PROJECT_SOURCE_DIR}/src/TestFramework/Exec.cpp)

target_link_libraries(l10ns glob jsoncpp curl ${Boost_LIBRARIES})

target_link_libraries(accept-baseline glob ${Boost_LIBRARIES})
target_link_libraries(clean-project glob ${Boost_LIBRARIES})
target_link_libraries(diff glob ${Boost_LIBRARIES})
target_link_libraries(generate-diagnostics glob jsoncpp ${Boost_LIBRARIES})
target_link_libraries(run-tests glob ${Boost_LIBRARIES})
