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
    class this check ordering
---*/
var baseCalled = 0;
class Base {
  constructor() { baseCalled++ }
}

var fCalled = 0;
function f() { fCalled++; return 3; }

class Subclass1 extends Base {
  constructor() {
    baseCalled = 0;
    super();
    assert.sameValue(baseCalled, 1, "The value of `baseCalled` is `1`");
    var obj = this;

    var exn = null;
    baseCalled = 0;
    fCalled = 0;
    try {
      super(f());
    } catch (e) { exn = e; }
    assert.sameValue(
      exn instanceof ReferenceError,
      true,
      "The result of `exn instanceof ReferenceError` is `true`"
    );
    assert.sameValue(fCalled, 1, "The value of `fCalled` is `1`");
    assert.sameValue(baseCalled, 1, "The value of `baseCalled` is `1`");
    assert.sameValue(this, obj, "`this` is `obj`");

    exn = null;
    baseCalled = 0;
    fCalled = 0;
    try {
      super(super(), f());
    } catch (e) { exn = e; }
    assert.sameValue(
      exn instanceof ReferenceError,
      true,
      "The result of `exn instanceof ReferenceError` is `true`"
    );
    assert.sameValue(fCalled, 0, "The value of `fCalled` is `0`");
    assert.sameValue(baseCalled, 1, "The value of `baseCalled` is `1`");
    assert.sameValue(this, obj, "`this` is `obj`");

    exn = null;
    baseCalled = 0;
    fCalled = 0;
    try {
      super(f(), super());
    } catch (e) { exn = e; }
    assert.sameValue(
      exn instanceof ReferenceError,
      true,
      "The result of `exn instanceof ReferenceError` is `true`"
    );
    assert.sameValue(fCalled, 1, "The value of `fCalled` is `1`");
    assert.sameValue(baseCalled, 1, "The value of `baseCalled` is `1`");
    assert.sameValue(this, obj, "`this` is `obj`");
  }
}

new Subclass1();
