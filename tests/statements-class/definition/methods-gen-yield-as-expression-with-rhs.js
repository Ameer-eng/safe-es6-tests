// Copyright (C) 2017 Ecma International.  All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
description: |
    Collection of assertion functions used throughout test262
defines: [assert]
---*/


function assert(mustBeTrue, message) {
    if (mustBeTrue === true) {
        return;
    }

    if (message === undefined) {
        message = 'Expected true but got ' + assert._toString(mustBeTrue);
    }
    throw message;
}

assert._isSameValue = function (a, b) {
    var same;
    if (a === b) {
        // Handle +/-0 vs. -/+0
        same = a !== 0 || 1 / a === 1 / b;
    } else {
        // Handle NaN vs. NaN
        same = a !== a && b !== b;
    }
    if (!same) {
        throw a + " does not equal " + b;
    }
    return true;
};

assert.sameValue = function (actual, expected, message) {
    try {
        if (assert._isSameValue(actual, expected)) {
            return;
        }
    } catch (error) {
        throw message + ' (_isSameValue operation threw) ' + error;
    }

    if (message === undefined) {
        message = '';
    } else {
        message += ' ';
    }

    throw message += 'Expected SameValue(«' + assert._toString(actual) + '», «' + assert._toString(expected) + '») to be true';
};

assert.notSameValue = function (actual, unexpected, message) {
    if (!assert._isSameValue(actual, unexpected)) {
        return;
    }

    if (message === undefined) {
        message = '';
    } else {
        message += ' ';
    }

    message += 'Expected SameValue(«' + assert._toString(actual) + '», «' + assert._toString(unexpected) + '») to be false';

    throw message;
};

assert.throws = function (expectedErrorConstructor, func, message) {
    if (typeof func !== "function") {
        throw 'assert.throws requires two arguments: the error constructor ' +
            'and a function to run';
    }
    if (message === undefined) {
        message = '';
    } else {
        message += ' ';
    }

    try {
        func();
    } catch (thrown) {
        if (typeof thrown !== 'object' || thrown === null) {
            message += 'Thrown value was not an object!';
            throw message;
        } else if (thrown.constructor !== expectedErrorConstructor) {
            message += 'Expected a ' + expectedErrorConstructor.name + ' but got a ' + thrown.constructor.name;
            throw message;
        }
        return;
    }

    message += 'Expected a ' + expectedErrorConstructor.name + ' to be thrown but no exception was thrown at all';
    throw message;
};

assert._toString = function (value) {
    try {
        if (value === 0 && 1 / value === -Infinity) {
            return '-0';
        }

        return String(value);
    } catch (err) {
        if (err.name === 'TypeError') {
            return Object.prototype.toString.call(value);
        }

        throw err;
    }
};// Copyright (C) 2013 the V8 project authors. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
  description: >
      `yield` is a valid expression within generator function bodies.
  features: [generators]
  es6id: 14.4
---*/

var iter, result;
class A {
  *g1() { (yield 1) }
  *g2() { [yield 1] }
  *g3() { {yield 1} }
  *g4() { yield 1, yield 2; }
  *g5() { (yield 1) ? yield 2 : yield 3; }
}

iter = A.prototype.g1();
result = iter.next();
assert.sameValue(result.value, 1, 'Within grouping operator: result `value`');
assert.sameValue(
  result.done, false, 'Within grouping operator: result `done` flag'
);
result = iter.next();
assert.sameValue(
  result.value, undefined, 'Following grouping operator: result `value`'
);
assert.sameValue(
  result.done, true, 'Following grouping operator: result `done` flag'
);

iter = A.prototype.g2();
result = iter.next();
assert.sameValue(result.value, 1, 'Within array literal: result `value`');
assert.sameValue(
  result.done, false, 'Within array literal: result `done` flag'
);
result = iter.next();
assert.sameValue(
  result.value, undefined, 'Following array literal: result `value`'
);
assert.sameValue(
  result.done, true, 'Following array literal: result `done` flag'
);

iter = A.prototype.g3();
result = iter.next();
assert.sameValue(result.value, 1, 'Within object literal: result `value`');
assert.sameValue(
  result.done, false, 'Within object literal: result `done` flag'
);
result = iter.next();
assert.sameValue(
  result.value, undefined, 'Following object literal: result `value`'
);
assert.sameValue(
  result.done, true, 'Following object literal: result `done` flag'
);

iter = A.prototype.g4();
result = iter.next();
assert.sameValue(
  result.value, 1, 'First expression in comma expression: result `value`'
);
assert.sameValue(
  result.done,
  false,
  'First expression in comma expression: result `done` flag'
);
result = iter.next();
assert.sameValue(
  result.value, 2, 'Second expression in comma expression: result `value`'
);
assert.sameValue(
  result.done,
  false,
  'Second expression in comma expression: result `done` flag'
);
result = iter.next();
assert.sameValue(
  result.value, undefined, 'Following comma expression: result `value`'
);
assert.sameValue(
  result.done, true, 'Following comma expression: result `done` flag'
);

iter = A.prototype.g5();
result = iter.next();
assert.sameValue(
  result.value,
  1,
  'Conditional expression in conditional operator: result `value`'
);
assert.sameValue(
  result.done,
  false,
  'Conditional expression in conditional operator: result `done` flag'
);
result = iter.next();
assert.sameValue(
  result.value,
  3,
  'Branch in conditional operator: result `value`'
);
assert.sameValue(
  result.done,
  false,
  'Branch in conditional operator: result `done` flag'
);
result = iter.next();
assert.sameValue(
  result.value, undefined, 'Following conditional operator: result `value`'
);
assert.sameValue(
  result.done, true, 'Following conditional operator: result `done` flag'
);
