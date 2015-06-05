var path = '../src/util/util';

jest.dontMock(path);

var Util = require(path);

describe('The merge function', function() {
  
  beforeEach(function() {
    this.styleA = {prop1: 'style1'};
    this.styleB = {prop2: 'style2'};
    this.styleC = {
      prop1: {
        nest1a: 'style1a',
        nest1b: 'style1b'
      },
      prop2: {
        nest2a: 'style2a',
        nest2b: 'style2b'
      },
    };
    this.styleD = {prop2: {nest2b: 'something completely different'}};
  });

  it('combines two style objects into a third new one', function() {
    var mergedStyle = Util.merge(this.styleA, this.styleB);
    expect(mergedStyle).toEqual({prop1: 'style1', prop2: 'style2'});
  });

  it('leaves the two style objects unaltered', function() {
    Util.merge(this.styleA, this.styleB);
    expect(this.styleA).toEqual({prop1: 'style1'});
    expect(this.styleB).toEqual({prop2: 'style2'});
  });

  it('merges nested styles', function() {
    var mergedStyle = Util.merge(this.styleC, this.styleD);
    expect(mergedStyle).toEqual({
      prop1: {
        nest1a: 'style1a',
        nest1b: 'style1b'
      },
      prop2: {
        nest2a: 'style2a',
        nest2b: 'something completely different'
      },
    });
  });

});

describe('The prefix function', function() {
  
  it('applies the vendor prefixes Webkit Moz ms and O', function() {
    var prefixed = Util.prefix({userSelect: 'none'});
    expect(prefixed["userSelect"]).toEqual('none');
    expect(prefixed["WebkitUserSelect"]).toEqual('none');
    expect(prefixed["MozUserSelect"]).toEqual('none');
    expect(prefixed["msUserSelect"]).toEqual('none');
    expect(prefixed["OUserSelect"]).toEqual('none');
  });

  it('applies the vendor prefixes to nested styles', function() {
    var prefixed = Util.prefix({component: {userSelect: 'none'}});
    expect(prefixed["component"]["userSelect"]).toEqual('none');
    expect(prefixed["component"]["WebkitUserSelect"]).toEqual('none');
    expect(prefixed["component"]["MozUserSelect"]).toEqual('none');
    expect(prefixed["component"]["msUserSelect"]).toEqual('none');
    expect(prefixed["component"]["OUserSelect"]).toEqual('none');
  });

  it('applies the vendor prefixes to deeply nested styles', function() {
    var prefixed = Util.prefix({component: {subcomponent: {subsubcomponent: {userSelect: 'none'}}}});
    expect(prefixed["component"]["subcomponent"]["subsubcomponent"]["userSelect"]).toEqual('none');
    expect(prefixed["component"]["subcomponent"]["subsubcomponent"]["WebkitUserSelect"]).toEqual('none');
  });

  it('preserves unprefixed styles', function() {
    var prefixed = Util.prefix({width: 0});
    expect(prefixed).toEqual({width: 0});
  });

});