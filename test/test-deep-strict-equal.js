// port of https://github.com/nodejs/node/blob/v6.0.0/test/parallel/test-assert.js#L165-L280
'use strict';

var _deepEqual = require('..');
var assert = require('assert');

function deepStrictEqual(actual, expected, message) {
    if (!_deepEqual(actual, expected, true)) {
        assert.fail(actual, expected, message, 'deepStrictEqual', deepStrictEqual);
    }
};

function makeBlock(f) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    return f.apply(this, args);
  };
}

describe('deepStrictEqual', function () {

it('7.2', function () {
assert.doesNotThrow(makeBlock(deepStrictEqual, new Date(2000, 3, 14),
                    new Date(2000, 3, 14)),
                    'deepStrictEqual(new Date(2000, 3, 14),\
                    new Date(2000, 3, 14))');

assert.throws(makeBlock(deepStrictEqual, new Date(), new Date(2000, 3, 14)),
              assert.AssertionError,
              'deepStrictEqual(new Date(), new Date(2000, 3, 14))');
});


it('7.3 - strict', function () {
assert.doesNotThrow(makeBlock(deepStrictEqual, /a/, /a/));
assert.doesNotThrow(makeBlock(deepStrictEqual, /a/g, /a/g));
assert.doesNotThrow(makeBlock(deepStrictEqual, /a/i, /a/i));
assert.doesNotThrow(makeBlock(deepStrictEqual, /a/m, /a/m));
assert.doesNotThrow(makeBlock(deepStrictEqual, /a/igm, /a/igm));
assert.throws(makeBlock(deepStrictEqual, /ab/, /a/));
assert.throws(makeBlock(deepStrictEqual, /a/g, /a/));
assert.throws(makeBlock(deepStrictEqual, /a/i, /a/));
assert.throws(makeBlock(deepStrictEqual, /a/m, /a/));
assert.throws(makeBlock(deepStrictEqual, /a/igm, /a/im));

var re1 = /a/;
re1.lastIndex = 3;
assert.throws(makeBlock(deepStrictEqual, re1, /a/));

});


it('7.4 - strict', function () {
assert.throws(makeBlock(deepStrictEqual, 4, '4'),
              assert.AssertionError,
              'deepStrictEqual(4, \'4\')');

assert.throws(makeBlock(deepStrictEqual, true, 1),
              assert.AssertionError,
              'deepStrictEqual(true, 1)');

assert.throws(makeBlock(deepStrictEqual, 4, '5'),
              assert.AssertionError,
              'deepStrictEqual(4, \'5\')');
});


it('7.5 - strict', function () {
// having the same number of owned properties && the same set of keys
assert.doesNotThrow(makeBlock(deepStrictEqual, {a: 4}, {a: 4}));
assert.doesNotThrow(makeBlock(deepStrictEqual,
                              {a: 4, b: '2'},
                              {a: 4, b: '2'}));
assert.throws(makeBlock(deepStrictEqual, [4], ['4']));
assert.throws(makeBlock(deepStrictEqual, {a: 4}, {a: 4, b: true}),
              assert.AssertionError);
assert.throws(makeBlock(deepStrictEqual, ['a'], {0: 'a'}));
//(although not necessarily the same order),
assert.doesNotThrow(makeBlock(deepStrictEqual,
                              {a: 4, b: '1'},
                              {b: '1', a: 4}));

assert.throws(makeBlock(deepStrictEqual,
                        [0, 1, 2, 'a', 'b'],
                        [0, 1, 2, 'b', 'a']),
              assert.AssertionError);

var a1 = [1, 2, 3];
var a2 = [1, 2, 3];
a1.a = 'test';
a1.b = true;
a2.b = true;
a2.a = 'test';

assert.doesNotThrow(makeBlock(deepStrictEqual, a1, a2));
});


it('Prototype check', function () {
function Constructor1(first, last) {
  this.first = first;
  this.last = last;
}

function Constructor2(first, last) {
  this.first = first;
  this.last = last;
}

var obj1 = new Constructor1('Ryan', 'Dahl');
var obj2 = new Constructor2('Ryan', 'Dahl');

assert.throws(makeBlock(deepStrictEqual, obj1, obj2), assert.AssertionError);

Constructor2.prototype = Constructor1.prototype;
obj2 = new Constructor2('Ryan', 'Dahl');

assert.doesNotThrow(makeBlock(deepStrictEqual, obj1, obj2));
});


it('primitives', function () {
assert.throws(makeBlock(deepStrictEqual, 4, '4'),
              assert.AssertionError);
assert.throws(makeBlock(deepStrictEqual, true, 1),
              assert.AssertionError);
if (typeof Symbol !== 'undefined') {
  assert.throws(makeBlock(deepStrictEqual, Symbol(), Symbol()),
                assert.AssertionError);
  var s = Symbol();
  assert.doesNotThrow(makeBlock(deepStrictEqual, s, s));
}
});


it('primitives and object', function () {
assert.throws(makeBlock(deepStrictEqual, null, {}), assert.AssertionError);
assert.throws(makeBlock(deepStrictEqual, undefined, {}), assert.AssertionError);
assert.throws(makeBlock(deepStrictEqual, 'a', ['a']), assert.AssertionError);
assert.throws(makeBlock(deepStrictEqual, 'a', {0: 'a'}), assert.AssertionError);
assert.throws(makeBlock(deepStrictEqual, 1, {}), assert.AssertionError);
assert.throws(makeBlock(deepStrictEqual, true, {}), assert.AssertionError);
if (typeof Symbol !== 'undefined') {
  assert.throws(makeBlock(deepStrictEqual, Symbol(), {}),
                assert.AssertionError);
}
});


it('primitive wrappers and object', function () {
assert.throws(makeBlock(deepStrictEqual, new String('a'), ['a']),
              assert.AssertionError);
assert.throws(makeBlock(deepStrictEqual, new String('a'), {0: 'a'}),
              assert.AssertionError);
assert.throws(makeBlock(deepStrictEqual, new Number(1), {}),
              assert.AssertionError);
assert.throws(makeBlock(deepStrictEqual, new Boolean(true), {}),
              assert.AssertionError);
});

});

// https://github.com/nodejs/node/issues/6416
it("Make sure circular refs don't throw", function(){
var b = {};
b.b = b;

var c = {};
c.b = c;

assert.doesNotThrow(makeBlock(deepStrictEqual, b, c));

var d = {};
d.a = 1;
d.b = d;

var e = {};
e.a = 1;
e.b = e.a;

assert.throws(makeBlock(deepStrictEqual, d, e), /AssertionError/);
});