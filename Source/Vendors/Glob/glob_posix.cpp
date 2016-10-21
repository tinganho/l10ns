#include <fnmatch.h>
#include "glob_posix.h"

static std::pair<std::string, std::string> SplitPath(const std::string &path) {
  std::string::size_type last_sep = path.find_last_of("/");
  if (last_sep != std::string::npos) {
    return std::make_pair(std::string(path.begin(), path.begin() + last_sep),
                          std::string(path.begin() + last_sep + 1, path.end()));
  }
  return std::make_pair(".", path);
}

namespace glob {

Glob::Glob(const std::string &pattern)
 : dir_(0),
   dir_entry_(0)
{
  std::pair<std::string, std::string> dir_and_mask = SplitPath(pattern);

  dir_ = opendir(dir_and_mask.first.c_str());
  pattern_ = dir_and_mask.second;

  if (dir_ != 0) {
    Next();
  }
}

Glob::~Glob() {
  if (dir_ != 0) {
    closedir(dir_);
  }
}

bool Glob::Next() {
  while ((dir_entry_ = readdir(dir_)) != 0) {
    if (!fnmatch(pattern_.c_str(), dir_entry_->d_name,
                 FNM_CASEFOLD | FNM_NOESCAPE | FNM_PERIOD)) {
      return true;
    }
  }
  return false;
}

} // namespace glob
