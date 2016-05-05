// port of https://github.com/nodejs/node/blob/v6.0.0/test/parallel/test-assert-typedarray-deepequal.js
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

function supportsTypedArray() {
    try {
        var a1 = new Uint8ClampedArray(1e5);
        var a2 = new Float64Array(1e5);
        return (a1 && a2);
    } catch (e) {
        return false;
    }
}

if (supportsTypedArray()) {

var equalArrayPairs = [
  [new Uint8Array(1e5), new Uint8Array(1e5)],
  [new Uint16Array(1e5), new Uint16Array(1e5)],
  [new Uint32Array(1e5), new Uint32Array(1e5)],
  [new Uint8ClampedArray(1e5), new Uint8ClampedArray(1e5)],
  [new Int8Array(1e5), new Int8Array(1e5)],
  [new Int16Array(1e5), new Int16Array(1e5)],
  [new Int32Array(1e5), new Int32Array(1e5)],
  [new Float32Array(1e5), new Float32Array(1e5)],
  [new Float64Array(1e5), new Float64Array(1e5)],
  [new Int16Array(256), new Uint16Array(256)],
  [new Int16Array([256]), new Uint16Array([256])],
  [new Float32Array([+0.0]), new Float32Array([-0.0])],
  [new Float64Array([+0.0]), new Float32Array([-0.0])],
  [new Float64Array([+0.0]), new Float64Array([-0.0])]
];

var notEqualArrayPairs = [
  [new Uint8Array(2), new Uint8Array(3)],
  [new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6])],
  [new Uint8ClampedArray([300, 2, 3]), new Uint8Array([300, 2, 3])],
  [new Uint16Array([2]), new Uint16Array([3])],
  [new Uint16Array([0]), new Uint16Array([256])],
  [new Int16Array([0]), new Uint16Array([256])],
  [new Int16Array([-256]), new Uint16Array([0xff00])], // same bits
  [new Int32Array([-256]), new Uint32Array([0xffffff00])], // ditto
  [new Float32Array([0.1]), new Float32Array([0.0])],
  [new Float64Array([0.1]), new Float64Array([0.0])]
];

  describe('TypedArray deepEqual', function () {
    equalArrayPairs.forEach(function (arrayPair, idx) {
      it('equalArrayPairs - ' + idx, function () {
        deepEqual(arrayPair[0], arrayPair[1]);
      });
    });
    notEqualArrayPairs.forEach(function (arrayPair, idx) {
      it('notEqualArrayPairs - ' + idx, function () {
        assert.throws(
          makeBlock(deepEqual, arrayPair[0], arrayPair[1]),
          assert.AssertionError
        );
      });
    });
  });
} else {
  it('SKIP -- this platform does not support TypedArray', function () {
    assert(true, 'skipped');
  });
}
