#include "glob_win32.h"

namespace glob {

Glob::Glob(const std::string &pattern)
 : ok_(false),
   find_handle_(INVALID_HANDLE_VALUE)
{
  find_handle_ = FindFirstFile(pattern.c_str(), &find_data_);
  ok_ = find_handle_ != INVALID_HANDLE_VALUE;
}

Glob::~Glob() {
  if (find_handle_ != INVALID_HANDLE_VALUE) {
    FindClose(find_handle_);
  }
}

bool Glob::Next() {
  ok_ = FindNextFile(find_handle_, &find_data_) != 0;
  return ok_;
}

} // namespace glob
