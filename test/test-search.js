
/**
 * Module dependencies
 */

var path = require('path');

/**
 * Import Parser constructor
 */

var Search = _Search = require('../lib/search').Search;

module.exports = function() {
  describe('Search', function() {
    describe('#constructor', function() {
      beforeEach(function() {
        sinon.stub(_Search.prototype, '_createIndex');
      });

      afterEach(function() {
        _Search.prototype._createIndex.restore();
      });

      it('should create index', function() {
        var search = new _Search;
        search._createIndex.should.have.been.calledOnce;
      });

      it('should set default locale from global configs', function() {
        var search = new _Search;
        expect(search.defaultLocale).to.equal(cf.defaultLocale);
      });

      it('should set folder from global configs', function() {
        var search = new _Search;
        expect(search.folder).to.equal(cf.folder);
      });

      it('should set index to null', function() {
        var search = new _Search;
        expect(search.index).to.not.be.a('undefined');
      });

      it('should set translation to null', function() {
        var search = new _Search;
        expect(search.translations).to.not.be.a('undefined');
      });

      it('should set logLength to global config LOG_LENGTH', function() {
        var search = new _Search;
        expect(search.logLength).to.equal(cf.LOG_LENGTH);
      });

      it('should call the EventEmitter constructor', function() {
        var eventsStub = { EventEmitter : sinon.spy() };
        var _Search = proxyquire('../lib/search', { events : eventsStub }).Search
        _Search.prototype._createIndex = sinon.spy();
        var search = new _Search;
        eventsStub.EventEmitter.should.have.been.calledOnce;
      });
    });

    describe('#_createIndex', function() {
      it('should set the key field', function() {
        var search = new Search;
        expect(search.index._fields[0].name).to.equal('key');
      });

      it('should set the text field', function() {
        var search = new Search;
        expect(search.index._fields[1].name).to.equal('text');
      });

      it('should set the key field to have boost 10', function() {
        var search = new Search;
        expect(search.index._fields[0].boost).to.equal(10);
      });

      it('should set the text field to have boost 10', function() {
        var search = new Search;
        expect(search.index._fields[1].boost).to.equal(10);
      });
    });

    describe('#readTranslations', function() {
      it('should get translations from File#readTranslations', function() {
        var fileStub = { readTranslations : sinon.stub().returns({ 'en-US' : {} }) };
        var Search = proxyquire('../lib/search', { './file' : fileStub }).Search;
        var search = new Search;
        search.defaultLocale = 'en-US';
        search.readTranslations();
        fileStub.readTranslations.should.have.been.calledOnce;
      });

      it('should add translations to search index', function() {
        var translation = { 'key' : 'test', 'text' : 'nihao' };
        var fileStub = {
          readTranslations : sinon
            .stub()
            .returns({
              'en-US' : {
                'test' : translation
              }
            })
        };
        var Search = proxyquire('../lib/search', { './file' : fileStub }).Search;
        var search = new Search;
        search.index.add = sinon.spy();
        search.readTranslations();
        search.index.add.should.have.been.calledWith({
          id : translation.key,
          text : translation.text,
          // the key `BASE__EXIT_BUTTON` should be toknized as `base exit button`
          key : translation.key.replace(/_+/g,  ' ').toLowerCase()
        });
      });

      it('should emit readend event', function() {
        var translation = { 'key' : 'test', 'text' : 'nihao' };
        var fileStub = {
          readTranslations : sinon
            .stub()
            .returns({
              'en-US' : {
                'test' : translation
              }
            })
        };
        var Search = proxyquire('../lib/search', { './file' : fileStub }).Search;
        var search = new Search;
        search.emit = sinon.spy();
        search.readTranslations();
        search.emit.should.have.been.calledWith('readend');
      });
    });

    describe('#query', function() {

      it('should output `No results found` when nu results are found in search', function() {
        var logStub = { log : sinon.spy() };
        var fsStub = { writeFile : sinon.spy() };
        var Search = proxyquire('../lib/search', { fs : fsStub, './_log' : logStub }).Search;
        var search = new Search;
        search.index.add({ id : 'test-id', text : 'test-text', key : 'test-key' });
        var res = search.query('nottest');
        logStub.log.should.have.been.calledWith('No result found')
      });

      it('should slice the search result if the search result is over this.logLength', function() {
        var logStub = { log : sinon.spy() };
        var fsStub = { writeFile : sinon.spy() };
        var Search = proxyquire('../lib/search', { fs : fsStub, './_log' : logStub }).Search;
        var search = new Search;
        search.logLength = 1;
        search.docs = { 'test-ref1' : { key : 'test-key' }};
        search.index.search = sinon.stub().returns([{
          id : 'test-id1',
          ref : 'test-ref1'
        },
        {
          id : 'test-id2',
          ref : 'test-ref2'
        }]);
        search.query('test-query');
        logStub.log.should.have.callCount(1);
      });

      it('should format @-tags so that single digit have a space before tag'
      + ' and double digit don\'t have any space before tag', function() {
        var logStub = { log : sinon.spy() };
        var fsStub = { writeFile : sinon.spy() };
        var Search = proxyquire('../lib/search', {
          fs : fsStub,
          './_log' : logStub
        }).Search;
        var search = new Search;
        search.docs = {
          'test-ref1' : { key : 'test-key1' },
          'test-ref2' : { key : 'test-key2' },
          'test-ref3' : { key : 'test-key3' },
          'test-ref4' : { key : 'test-key4' },
          'test-ref5' : { key : 'test-key5' },
          'test-ref6' : { key : 'test-key6' },
          'test-ref7' : { key : 'test-key7' },
          'test-ref8' : { key : 'test-key8' },
          'test-ref9' : { key : 'test-key9' },
          'test-ref10' : { key : 'test-key10' }
        };
        search.index.search = sinon.stub().returns([{
          id : 'test-id1',
          ref : 'test-ref1'
        },
        {
          id : 'test-id2',
          ref : 'test-ref2'
        },
        {
          id : 'test-id3',
          ref : 'test-ref3'
        },
        {
          id : 'test-id4',
          ref : 'test-ref4'
        },
        {
          id : 'test-id5',
          ref : 'test-ref5'
        },
        {
          id : 'test-id6',
          ref : 'test-ref6'
        },
        {
          id : 'test-id7',
          ref : 'test-ref7'
        },
        {
          id : 'test-id8',
          ref : 'test-ref8'
        },
        {
          id : 'test-id9',
          ref : 'test-ref9'
        },
        {
          id : 'test-id10',
          ref : 'test-ref10'
        }]);
        search.query('test-query');
        logStub.log.should.have.calledWithMatch(' @1');
        logStub.log.should.have.calledWithMatch(' @2');
        logStub.log.should.have.calledWithMatch(' @3');
        logStub.log.should.have.calledWithMatch(' @4');
        logStub.log.should.have.calledWithMatch(' @5');
        logStub.log.should.have.calledWithMatch(' @6');
        logStub.log.should.have.calledWithMatch(' @7');
        logStub.log.should.have.calledWithMatch(' @8');
        logStub.log.should.have.calledWithMatch(' @9');
        logStub.log.should.have.calledWithMatch('@10');
      });

      it('should get the search result by mapping the .ref with this.docs', function() {
        var logStub = { log : sinon.spy() };
        var fsStub = { writeFile : sinon.spy() };
        var Search = proxyquire('../lib/search', {
          fs : fsStub,
          './_log' : logStub
        }).Search;
        var search = new Search;
        search.docs = {
          'test-ref1' : { key : 'test-key1' },
          'test-ref2' : { key : 'test-key2' }
        };
        search.index.search = sinon.stub().returns([{
          id : 'test-id1',
          ref : 'test-ref1'
        },
        {
          id : 'test-id2',
          ref : 'test-ref2'
        }]);
        search.query('test-query');
        logStub.log.should.have.calledWithMatch(search.docs['test-ref1'].key);
        logStub.log.should.have.calledWithMatch(search.docs['test-ref2'].key);
      });

      it('should write a cache of latest search', function() {
        var logStub = { log : sinon.spy() };
        var fsStub = { writeFile : sinon.spy() };
        var Search = proxyquire('../lib/search', {
          fs : fsStub,
          './_log' : logStub
        }).Search;
        var search = new Search;
        search.docs = {
          'test-ref1' : { key : 'test-key1' },
          'test-ref2' : { key : 'test-key2' }
        };
        search.index.search = sinon.stub().returns([{
          id : 'test-id1',
          ref : 'test-ref1'
        },
        {
          id : 'test-id2',
          ref : 'test-ref2'
        }]);
        search.query('test-query');
        fsStub.writeFile.should.have.been.calledWithMatch('latestSearch.json');
        expect(fsStub.writeFile.args[0][1]).to.have.a('string');
      });

      it('should emit `queryend` event when query has ended', function() {
        var logStub = { log : sinon.spy() };
        var fsStub = { writeFile : function(path, content, callback) { callback(); } };
        var Search = proxyquire('../lib/search', {
          fs : fsStub,
          './_log' : logStub
        }).Search;
        var search = new Search;
        search.index.search = sinon.stub().returns([]);
        search.emit = sinon.spy();
        search.query('test-query');
        search.emit.should.have.been.calledOnce;
        search.emit.should.have.been.calledWith('queryend', []);
      });
    });
  });
};
