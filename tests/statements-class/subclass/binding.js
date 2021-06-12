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
    class subclass binding
---*/
class Base {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

var obj = {};
class Subclass extends Base {
  constructor(x, y) {
    super(x,y);
    assert.sameValue(this !== obj, true, "The result of `this !== obj` is `true`");
  }
}

var f = Subclass.bind(obj);
assert.throws(TypeError, function () { f(1, 2); });
var s = new f(1, 2);
assert.sameValue(s.x, 1, "The value of `s.x` is `1`");
assert.sameValue(s.y, 2, "The value of `s.y` is `2`");
assert.sameValue(
  Object.getPrototypeOf(s),
  Subclass.prototype,
  "`Object.getPrototypeOf(s)` returns `Subclass.prototype`"
);

var s1 = new f(1);
assert.sameValue(s1.x, 1, "The value of `s1.x` is `1`");
assert.sameValue(s1.y, undefined, "The value of `s1.y` is `undefined`");
assert.sameValue(
  Object.getPrototypeOf(s1),
  Subclass.prototype,
  "`Object.getPrototypeOf(s1)` returns `Subclass.prototype`"
);

var g = Subclass.bind(obj, 1);
assert.throws(TypeError, function () { g(8); });
var s2 = new g(8);
assert.sameValue(s2.x, 1, "The value of `s2.x` is `1`");
assert.sameValue(s2.y, 8, "The value of `s2.y` is `8`");
assert.sameValue(
  Object.getPrototypeOf(s),
  Subclass.prototype,
  "`Object.getPrototypeOf(s)` returns `Subclass.prototype`"
);
