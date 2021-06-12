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
es6id: 14.5
description: >
    class methods
---*/
function assertMethodDescriptor(object, name) {
  var desc = Object.getOwnPropertyDescriptor(object, name);
  assert.sameValue(desc.configurable, true, "The value of `desc.configurable` is `true`");
  assert.sameValue(desc.enumerable, false, "The value of `desc.enumerable` is `false`");
  assert.sameValue(desc.writable, true, "The value of `desc.writable` is `true`");
  assert.sameValue(typeof desc.value, 'function', "`typeof desc.value` is `'function'`");
  assert.sameValue('prototype' in desc.value, false, "The result of `'prototype' in desc.value` is `false`");
}

class C {
  method() { return 1; }
  static staticMethod() { return 2; }
  method2() { return 3; }
  static staticMethod2() { return 4; }
}

assertMethodDescriptor(C.prototype, 'method');
assertMethodDescriptor(C.prototype, 'method2');
assertMethodDescriptor(C, 'staticMethod');
assertMethodDescriptor(C, 'staticMethod2');

assert.sameValue(new C().method(), 1, "`new C().method()` returns `1`. Defined as `method() { return 1; }`");
assert.sameValue(C.staticMethod(), 2, "`C.staticMethod()` returns `2`. Defined as `static staticMethod() { return 2; }`");
assert.sameValue(new C().method2(), 3, "`new C().method2()` returns `3`. Defined as `method2() { return 3; }`");
assert.sameValue(C.staticMethod2(), 4, "`C.staticMethod2()` returns `4`. Defined as `static staticMethod2() { return 4; }`");
