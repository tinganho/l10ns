project(glob)

cmake_minimum_required(VERSION 2.8)

set(sources glob.h)
if(WIN32)
  list(APPEND sources glob_win32.cpp glob_win32.h)
else()
  list(APPEND sources glob_posix.cpp glob_posix.h)
endif()

add_library(glob STATIC ${sources})

add_executable(find find.cpp)
target_link_libraries(find glob)
