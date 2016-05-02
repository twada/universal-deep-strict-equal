// port of https://github.com/nodejs/node/blob/v6.0.0/test/parallel/test-assert.js#L62-L163
'use strict';

var _deepEqual = require('..');
var assert = require('assert');

function deepEqual(actual, expected, message) {
    if (!_deepEqual(actual, expected, false)) {
        assert.fail(actual, expected, message, 'deepEqual', deepEqual);
    }
};

function makeBlock(f) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    return f.apply(this, args);
  };
}

describe('deepEqual', function () {

it('7.2', function () {
assert.doesNotThrow(makeBlock(deepEqual, new Date(2000, 3, 14),
                    new Date(2000, 3, 14)),
                    'deepEqual(new Date(2000, 3, 14), new Date(2000, 3, 14))');

assert.throws(makeBlock(deepEqual, new Date(), new Date(2000, 3, 14)),
              assert.AssertionError,
              'deepEqual(new Date(), new Date(2000, 3, 14))');
});


it('7.3', function () {
assert.doesNotThrow(makeBlock(deepEqual, /a/, /a/));
assert.doesNotThrow(makeBlock(deepEqual, /a/g, /a/g));
assert.doesNotThrow(makeBlock(deepEqual, /a/i, /a/i));
assert.doesNotThrow(makeBlock(deepEqual, /a/m, /a/m));
assert.doesNotThrow(makeBlock(deepEqual, /a/igm, /a/igm));
assert.throws(makeBlock(deepEqual, /ab/, /a/));
assert.throws(makeBlock(deepEqual, /a/g, /a/));
assert.throws(makeBlock(deepEqual, /a/i, /a/));
assert.throws(makeBlock(deepEqual, /a/m, /a/));
assert.throws(makeBlock(deepEqual, /a/igm, /a/im));

var re1 = /a/;
re1.lastIndex = 3;
assert.throws(makeBlock(deepEqual, re1, /a/));
});


it('7.4', function () {
assert.doesNotThrow(makeBlock(deepEqual, 4, '4'), 'deepEqual(4, \'4\')');
assert.doesNotThrow(makeBlock(deepEqual, true, 1), 'deepEqual(true, 1)');
assert.throws(makeBlock(deepEqual, 4, '5'),
              assert.AssertionError,
              'deepEqual( 4, \'5\')');
});


it('7.5', function () {
// having the same number of owned properties && the same set of keys
assert.doesNotThrow(makeBlock(deepEqual, {a: 4}, {a: 4}));
assert.doesNotThrow(makeBlock(deepEqual, {a: 4, b: '2'}, {a: 4, b: '2'}));
assert.doesNotThrow(makeBlock(deepEqual, [4], ['4']));
assert.throws(makeBlock(deepEqual, {a: 4}, {a: 4, b: true}),
              assert.AssertionError);
assert.doesNotThrow(makeBlock(deepEqual, ['a'], {0: 'a'}));
//(although not necessarily the same order),
assert.doesNotThrow(makeBlock(deepEqual, {a: 4, b: '1'}, {b: '1', a: 4}));
var a1 = [1, 2, 3];
var a2 = [1, 2, 3];
a1.a = 'test';
a1.b = true;
a2.b = true;
a2.a = 'test';
assert.throws(makeBlock(deepEqual, Object.keys(a1), Object.keys(a2)),
              assert.AssertionError);
assert.doesNotThrow(makeBlock(deepEqual, a1, a2));
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

assert.doesNotThrow(makeBlock(deepEqual, nb1, nb2));

nameBuilder2.prototype = Object;
nb2 = new nameBuilder2('Ryan', 'Dahl');
assert.doesNotThrow(makeBlock(deepEqual, nb1, nb2));
});

it('primitives and object', function () {
assert.throws(makeBlock(deepEqual, null, {}), assert.AssertionError);
assert.throws(makeBlock(deepEqual, undefined, {}), assert.AssertionError);
assert.throws(makeBlock(deepEqual, 'a', ['a']), assert.AssertionError);
assert.throws(makeBlock(deepEqual, 'a', {0: 'a'}), assert.AssertionError);
assert.throws(makeBlock(deepEqual, 1, {}), assert.AssertionError);
assert.throws(makeBlock(deepEqual, true, {}), assert.AssertionError);
if (typeof Symbol !== 'undefined') {
  assert.throws(makeBlock(deepEqual, Symbol(), {}), assert.AssertionError);
}
});

it('primitive wrappers and object', function () {
assert.doesNotThrow(makeBlock(deepEqual, new String('a'), ['a']),
                    assert.AssertionError);
assert.doesNotThrow(makeBlock(deepEqual, new String('a'), {0: 'a'}),
                    assert.AssertionError);
assert.doesNotThrow(makeBlock(deepEqual, new Number(1), {}),
                    assert.AssertionError);
assert.doesNotThrow(makeBlock(deepEqual, new Boolean(true), {}),
                    assert.AssertionError);
});

});
