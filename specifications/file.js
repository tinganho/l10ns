
var dependencies = {
  'fs': {},
  'path': {},
  'mkdirp': {},
  'glob': {},
  'q': {},
};

describe('File', function() {
  describe('#constructor()', function() {
    it('should set this.linefeed to \\n', function() {
      var file = new (proxyquire('../libraries/file', dependencies).File);
      expect(file.linefeed).to.eql('\n');
    });

    it('should set this.outputFolderExists to \\n', function() {
      var file = new (proxyquire('../libraries/file', dependencies).File);
      expect(file.outputFolderExists).to.be.true;
    });
  });
});
