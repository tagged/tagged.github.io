var path = '../src/util/util';

jest.dontMock(path);

var Util = require(path);

describe('The merge function', function() {
  
  beforeEach(function() {
    this.styleA = {prop1: 'style1'};
    this.styleB = {prop2: 'style2'};
    this.mergedStyle = Util.merge(this.styleA, this.styleB);
  });

  it('combines two style objects into a third new one', function() {
    expect(this.mergedStyle).toEqual({prop1: 'style1', prop2: 'style2'});
  });

  it('leaves the two style objects unaltered', function() {
    expect(this.styleA).toEqual({prop1: 'style1'});
    expect(this.styleB).toEqual({prop2: 'style2'});
  });
});