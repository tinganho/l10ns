
var dependencies = {
  'fs': {},
  'path': {},
  'mkdirp': {},
  'glob': {},
  'q': {},
};

describe('File', function() {
  describe('#constructor', function() {
    it('should set this.newline to \\n', function() {
      var file = new (proxyquire('../libraries/file', dependencies).File);
      expect(file.newline).to.eql('\n');
    });
  });

  describe('#writeTranslations', function() {
    it('should create a translation folder if it does not exists', function() {
      pcf.locales = {};
      pcf.output = 'output-folder';
      dependencies.fs.existsSync = sinon.stub().returns(false);
      dependencies.mkdirp.sync = sinon.spy();
      var file = new (proxyquire('../libraries/file', dependencies).File);
      file._sortMaptoArray = sinon.stub().returns({});
      file.writeTranslations({});
      dependencies.mkdirp.sync.should.have.been.calledOnce;
      dependencies.mkdirp.sync.should.have.been.calledWith(pcf.output);
    });

    it('should delete old localizations and create new ones', function() {
      pcf.locales = { 'en-US': 'English (US)' };
      pcf.output = 'output-folder';
      dependencies.fs.existsSync = sinon.stub()
      dependencies.fs.existsSync.onCall(0).returns(false);
      dependencies.fs.existsSync.onCall(1).returns(true);
      dependencies.fs.appendFileSync = sinon.spy();
      dependencies.path.dirname = sinon.stub().returns('output-folder');
      dependencies.fs.unlinkSync = sinon.spy();
      var file = new (proxyquire('../libraries/file', dependencies).File);
      file._sortMaptoArray = sinon.stub().returns({ 'en-US': [{ 'key1': {}}]});
      file.writeTranslations({ 'en-US': { 'key1': {}}});
      dependencies.fs.unlinkSync.should.have.been.calledOnce;
      dependencies.fs.unlinkSync.should.have.been.calledWith('output-folder/en-US.locale');
      dependencies.fs.appendFileSync.should.have.been.calledOnce;
      dependencies.fs.appendFileSync.should.have.been.calledWith('output-folder/en-US.locale', JSON.stringify({ 'key1': {}}) + '\n');
    });

    it('if a callback is provided it should callback after write operation is done', function() {
      pcf.locales = { 'en-US': 'English (US)' };
      pcf.output = 'output-folder';
      dependencies.fs.existsSync = sinon.stub()
      dependencies.fs.existsSync.onCall(0).returns(false);
      dependencies.fs.existsSync.onCall(1).returns(true);
      dependencies.fs.appendFileSync = sinon.spy();
      dependencies.path.dirname = sinon.stub().returns('output-folder');
      dependencies.fs.unlinkSync = sinon.spy();
      var callback = sinon.spy();
      var file = new (proxyquire('../libraries/file', dependencies).File);
      file._sortMaptoArray = sinon.stub().returns({ 'en-US': [{ 'key1': {}}]});
      file.writeTranslations({ 'en-US': { 'key1': {}}}, callback);
      callback.should.have.been.calledOnce;
    });
  });
});
