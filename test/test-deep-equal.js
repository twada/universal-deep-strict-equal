// port of https://github.com/nodejs/node/blob/v6.1.0/test/parallel/test-assert.js#L62-L163
//     and https://github.com/nodejs/node/blob/v6.1.0/test/parallel/test-assert.js#L384-L410
'use strict';

var _deepEqual = require('..');
var assert = require('assert');
var keys = Object.keys || require('object-keys');

function deepEqual (actual, expected) {
    return _deepEqual(actual, expected, false);
}

describe('deepEqual', function () {

it('7.2', function () {
assert(deepEqual(new Date(2000, 3, 14), new Date(2000, 3, 14)), 'deepEqual(new Date(2000, 3, 14), new Date(2000, 3, 14))');
assert(!deepEqual(new Date(), new Date(2000, 3, 14)), 'deepEqual(new Date(), new Date(2000, 3, 14))');
});


it('7.3', function () {
assert(deepEqual(/a/, /a/));
assert(deepEqual(/a/g, /a/g));
assert(deepEqual(/a/i, /a/i));
assert(deepEqual(/a/m, /a/m));
assert(deepEqual(/a/igm, /a/igm));
assert(!deepEqual(/ab/, /a/));
assert(!deepEqual(/a/g, /a/));
assert(!deepEqual(/a/i, /a/));
assert(!deepEqual(/a/m, /a/));
assert(!deepEqual(/a/igm, /a/im));

var re1 = /a/;
re1.lastIndex = 3;
assert(!deepEqual(re1, /a/));
});


it('7.4', function () {
assert(deepEqual(4, '4'), 'deepEqual(4, \'4\')');
assert(deepEqual(true, 1), 'deepEqual(true, 1)');
assert(!deepEqual(4, '5'), 'deepEqual( 4, \'5\')');
});


it('7.5', function () {
// having the same number of owned properties && the same set of keys
assert(deepEqual({a: 4}, {a: 4}));
assert(deepEqual({a: 4, b: '2'}, {a: 4, b: '2'}));
assert(deepEqual([4], ['4']));
assert(!deepEqual({a: 4}, {a: 4, b: true}));
assert(deepEqual(['a'], {0: 'a'}));
//(although not necessarily the same order),
assert(deepEqual({a: 4, b: '1'}, {b: '1', a: 4}));
var a1 = [1, 2, 3];
var a2 = [1, 2, 3];
a1.a = 'test';
a1.b = true;
a2.b = true;
a2.a = 'test';
assert(!deepEqual(keys(a1), keys(a2)));
assert(deepEqual(a1, a2));
});

it('having an identical prototype property', function () {
var nbRoot = {
  toString: function() { return this.first + ' ' + this.last; }
};

function nameBuilder(first, last) {
  this.first = first;
  this.last = last;
  return this;
}
nameBuilder.prototype = nbRoot;

function nameBuilder2(first, last) {
  this.first = first;
  this.last = last;
  return this;
}
nameBuilder2.prototype = nbRoot;

var nb1 = new nameBuilder('Ryan', 'Dahl');
var nb2 = new nameBuilder2('Ryan', 'Dahl');

assert(deepEqual(nb1, nb2));

nameBuilder2.prototype = Object;
nb2 = new nameBuilder2('Ryan', 'Dahl');
assert(deepEqual(nb1, nb2));
});

it('primitives and object', function () {
assert(!deepEqual(null, {}));
assert(!deepEqual(undefined, {}));
assert(!deepEqual('a', ['a']));
assert(!deepEqual('a', {0: 'a'}));
assert(!deepEqual(1, {}));
assert(!deepEqual(true, {}));
if (typeof Symbol !== 'undefined') {
  assert(!deepEqual(Symbol(), {}));
}
});

// https://github.com/nodejs/node/issues/6416
it("Make sure circular refs don't throw", function(){
var b = {};
b.b = b;

var c = {};
c.b = c;

assert(deepEqual(b, c));
assert(deepEqual(b, c));

var d = {};
d.a = 1;
d.b = d;

var e = {};
e.a = 1;
e.b = e.a;

assert(!deepEqual(d, e));
assert(!deepEqual(d, e));
});

it("GH-7178. Ensure reflexivity of deepEqual with `arguments` objects", function(){
var args = (function() { return arguments; })();
assert(!deepEqual([], args));
assert(!deepEqual(args, []));
});

  describe('primitive wrappers and object', function () {
    it('String and array', function () {
      if (new String('a')['0'] === 'a') {
        assert(deepEqual(new String('a'), ['a']));
      } else {
        assert(!deepEqual(new String('a'), ['a']));
      }
    });
    it('String and object', function () {
      if (new String('a')['0'] === 'a') {
        assert(deepEqual(new String('a'), {0: 'a'}));
      } else {
        assert(!deepEqual(new String('a'), {0: 'a'}));
      }
    });
    it('Number', function () {
      assert(deepEqual(new Number(1), {}));
    });
    it('Boolean', function () {
      assert(deepEqual(new Boolean(true), {}));
    });
  });

});
