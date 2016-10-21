#include <cassert>
#include <string>
#include <windows.h>

namespace glob {

class Glob {
 public:
  Glob(const std::string &pattern);
  ~Glob();

  std::string GetFileName() const {
    assert(ok_);
    return find_data_.cFileName;
  }

  operator bool() const {
    return ok_;
  }

  bool Next();

 private:
  Glob(const Glob &);
  void operator=(const Glob &);

 private:
  bool ok_;
  HANDLE find_handle_;
  WIN32_FIND_DATA find_data_;
};

} // namespace glob
