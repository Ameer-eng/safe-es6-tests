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
};// Copyright (C) 2014 the V8 project authors. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
esid: sec-class-definitions
es6id: 14.5
description: Class methods - "set" accessors
includes: [propertyHelper.js]
---*/

function assertSetterDescriptor(object, name) {
  var descr = Object.getOwnPropertyDescriptor(object, name);
  verifyNotEnumerable(object, name);
  verifyConfigurable(object, name);
  assert.sameValue(typeof descr.set, 'function', "`typeof descr.set` is `'function'`");
  assert.sameValue('prototype' in descr.set, false, "The result of `'prototype' in descr.set` is `false`");
  assert.sameValue(descr.get, undefined, "The value of `descr.get` is `undefined`");
}

var x, staticX, y, staticY;
class C {
  set x(v) { x = v; }
  static set staticX(v) { staticX = v; }
  set y(v) { y = v; }
  static set staticY(v) { staticY = v; }
}

assert.sameValue(new C().x = 1, 1, "`new C().x = 1` is `1`");
assert.sameValue(x, 1, "The value of `x` is `1`");
assert.sameValue(C.staticX = 2, 2, "`C.staticX = 2` is `2`");
assert.sameValue(staticX, 2, "The value of `staticX` is `2`");
assert.sameValue(new C().y = 3, 3, "`new C().y = 3` is `3`");
assert.sameValue(y, 3, "The value of `y` is `3`");
assert.sameValue(C.staticY = 4, 4, "`C.staticY = 4` is `4`");
assert.sameValue(staticY, 4, "The value of `staticY` is `4`");

assertSetterDescriptor(C.prototype, 'x');
assertSetterDescriptor(C.prototype, 'y');
assertSetterDescriptor(C, 'staticX');
assertSetterDescriptor(C, 'staticY');
