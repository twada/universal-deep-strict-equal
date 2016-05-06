// port of https://github.com/nodejs/node/blob/v6.1.0/test/parallel/test-assert.js#L165-L280
'use strict';

var _deepEqual = require('..');
var assert = require('assert');

function deepStrictEqual (actual, expected) {
    return _deepEqual(actual, expected, true);
}

describe('deepStrictEqual', function () {

it('7.2', function () {
assert(deepStrictEqual(new Date(2000, 3, 14), new Date(2000, 3, 14)), 'deepStrictEqual(new Date(2000, 3, 14), new Date(2000, 3, 14))');

assert(!deepStrictEqual(new Date(), new Date(2000, 3, 14)), 'deepStrictEqual(new Date(), new Date(2000, 3, 14))');
});


it('7.3 - strict', function () {
assert(deepStrictEqual(/a/, /a/));
assert(deepStrictEqual(/a/g, /a/g));
assert(deepStrictEqual(/a/i, /a/i));
assert(deepStrictEqual(/a/m, /a/m));
assert(deepStrictEqual(/a/igm, /a/igm));
assert(!deepStrictEqual(/ab/, /a/));
assert(!deepStrictEqual(/a/g, /a/));
assert(!deepStrictEqual(/a/i, /a/));
assert(!deepStrictEqual(/a/m, /a/));
assert(!deepStrictEqual(/a/igm, /a/im));

var re1 = /a/;
re1.lastIndex = 3;
assert(!deepStrictEqual(re1, /a/));

});


it('7.4 - strict', function () {
assert(!deepStrictEqual(4, '4'), 'deepStrictEqual(4, \'4\')');
assert(!deepStrictEqual(true, 1),'deepStrictEqual(true, 1)');
assert(!deepStrictEqual(4, '5'), 'deepStrictEqual(4, \'5\')');
});


it('7.5 - strict', function () {
// having the same number of owned properties && the same set of keys
assert(deepStrictEqual({a: 4}, {a: 4}));
assert(deepStrictEqual({a: 4, b: '2'}, {a: 4, b: '2'}));
assert(!deepStrictEqual([4], ['4']));
assert(!deepStrictEqual({a: 4}, {a: 4, b: true}));
assert(!deepStrictEqual(['a'], {0: 'a'}));
//(although not necessarily the same order),
assert(deepStrictEqual({a: 4, b: '1'}, {b: '1', a: 4}));

assert(!deepStrictEqual([0, 1, 2, 'a', 'b'], [0, 1, 2, 'b', 'a']));

var a1 = [1, 2, 3];
var a2 = [1, 2, 3];
a1.a = 'test';
a1.b = true;
a2.b = true;
a2.a = 'test';

assert(deepStrictEqual(a1, a2));
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

assert(!deepStrictEqual(obj1, obj2));

Constructor2.prototype = Constructor1.prototype;
obj2 = new Constructor2('Ryan', 'Dahl');

assert(deepStrictEqual(obj1, obj2));
});


it('primitives', function () {
assert(!deepStrictEqual(4, '4'));
assert(!deepStrictEqual(true, 1));
if (typeof Symbol !== 'undefined') {
  assert(!deepStrictEqual(Symbol(), Symbol()));
  var s = Symbol();
  assert(deepStrictEqual(s, s));
}
});


it('primitives and object', function () {
assert(!deepStrictEqual(null, {}));
assert(!deepStrictEqual(undefined, {}));
assert(!deepStrictEqual('a', ['a']));
assert(!deepStrictEqual('a', {0: 'a'}));
assert(!deepStrictEqual(1, {}));
assert(!deepStrictEqual(true, {}));
if (typeof Symbol !== 'undefined') {
  assert(!deepStrictEqual(Symbol(), {}));
}
});


it('primitive wrappers and object', function () {
assert(!deepStrictEqual(new String('a'), ['a']));
assert(!deepStrictEqual(new String('a'), {0: 'a'}));
assert(!deepStrictEqual(new Number(1), {}));
assert(!deepStrictEqual(new Boolean(true), {}));
});

});

// https://github.com/nodejs/node/issues/6416
it("Make sure circular refs don't throw", function(){
var b = {};
b.b = b;

var c = {};
c.b = c;

assert(deepStrictEqual(b, c));

var d = {};
d.a = 1;
d.b = d;

var e = {};
e.a = 1;
e.b = e.a;

assert(!deepStrictEqual(d, e));
});
