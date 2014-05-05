
/**
 * Module dependencies
 */

var fixtures = require('./fixtures/json')
  , Merger = require('../libraries/merger').Merger;

module.exports = function() {
  describe('Merger', function() {
    describe('#constructor', function() {
      it('should set counter to 0', function() {
        var merger = new Merger();
        expect(merger.counter).to.equal(0);
      });
    });

    describe('#mergeTimeStamp', function() {
      it('should use old timestamp', function() {
        var merger = new Merger();
        var time = 1000;
        var res = merger.mergeTimeStamp({ 'test' : {}}, { 'test' : { timestamp : time }}, 'test');
        expect(res.test.timestamp).to.equal(time);
      });

      it('should use current timstamp as timestamp whenever old timestamp is undefined', function() {
        var merger = new Merger();
        var res = merger.mergeTimeStamp({ 'test' : {}}, { 'test' : {}}, 'test');
        expect(res.test.timestamp).to.be.a('number');
      });
    });

    describe('#mergeId', function() {
      it('should merge old translation `id`', function() {
        var merger = new Merger();
        var id = 'iuerhg';
        var res = merger.mergeId({ 'test' : {}}, { 'test' : { id : id }}, 'test');
        expect(res.test.id).to.equal(id);
      });

      it('should set a new translation id if there doesn\'t exist a old one', function() {
        var merger = new Merger();
        var res = merger.mergeId({ 'test' : {}}, { 'test' : { }}, 'test');
        expect(res.test.id).to.be.a('string');
      });

      it('should set property `_new` to false if `id` already exists', function() {
        var merger = new Merger();
        var id = 'iuerhg';
        var res = merger.mergeId({ 'test' : {}}, { 'test' : { id : id }}, 'test');
        expect(res.test._new).to.be.false;
      });

      it('should set property `_new` to true if `id` doesn\'t exists', function() {
        var merger = new Merger();
        var res = merger.mergeId({ 'test' : {}}, { 'test' : {}}, 'test');
        expect(res.test._new).to.be.true;
      });

      it('should increase counter everytime mergeId is called', function() {
        var merger = new Merger();
        merger.mergeId({ 'test' : {}}, { 'test' : {}}, 'test');
        expect(merger.counter).to.be.above(0);
      });
    });

    describe('#mergeTranslations', function() {
      it('should migrate old translation values', function() {
        var merger = new Merger();
        var values = ['wefew'];
        var res = merger.mergeTranslations({ 'test' : {}}, { 'test' : { values : values }}, 'test');
        expect(res.test.values).to.equal(values);
      });

      it('should set an empty array as values whenever old translation values doesn\'t exists', function() {
        var merger = new Merger();
        var res = merger.mergeTranslations({ 'test' : {}}, { 'test' : {}}, 'test');
        expect(res.test.values).to.eql([]);
      });

      it('should set the key as text whenever no old translations exists', function() {
        var merger = new Merger();
        var res = merger.mergeTranslations({ 'test' : {}}, { 'test' : {}}, 'test');
        expect(res.test.text).to.eql('test');
      });

      it('should set the key as text if old value is an array', function() {
        var merger = new Merger();
        var res = merger.mergeTranslations({ 'test' : {}}, { 'test' : { values : []}}, 'test');
        expect(res.test.text).to.eql('test');
      });

      it('should set the value as text if old value is of type string', function() {
        var merger = new Merger();
        var values = ['test'];
        var res = merger.mergeTranslations({ 'test' : {}}, { 'test' : { values : values }}, 'test');
        expect(res.test.text).to.eql(values[0]);
      });
    });
  });
};
