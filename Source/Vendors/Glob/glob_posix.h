#include <cassert>
#include <string>
#include <dirent.h>

namespace glob {

class Glob {
 public:
  Glob(const std::string &pattern);
  ~Glob();

  std::string GetFileName() const {
    assert(dir_entry_ != 0);
    return dir_entry_->d_name;
  }

  operator bool() const {
    return dir_entry_ != 0;
  }

  bool Next();

 private:
  Glob(const Glob &);
  void operator=(const Glob &);

 private:
  std::string pattern_;
  DIR *dir_;
  struct dirent *dir_entry_;
};

} // namespace glob
