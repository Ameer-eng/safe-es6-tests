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
};// Copyright (C) 2019 Caio Lima (Igalia SL). All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Subclass can access private methods of a superclass (private getter)
esid: sec-privatefieldget
info: |
  SuperCall : super Arguments
    ...
    10. Perform ? InitializeInstanceElements(result, F).
    ...

  InitializeInstanceFieldsElements ( O, constructor )
    1. Assert: Type ( O ) is Object.
    2. Assert: Assert constructor is an ECMAScript function object.
    3. If constructor.[[PrivateBrand]] is not undefined,
      a. Perform ? PrivateBrandAdd(O, constructor.[[PrivateBrand]]).
    4. Let fieldRecords be the value of constructor's [[Fields]] internal slot.
    5. For each item fieldRecord in order from fieldRecords,
      a. Perform ? DefineField(O, fieldRecord).
    6. Return.
features: [class, class-methods-private]
---*/

class S {
  get #m() { return 'super class'; }
  
  superAccess() { return this.#m; }
}

class C extends S {
  get #m() { return 'test262'; }
  
  access() {
    return this.#m;
  }
}
  
let c = new C();

assert.sameValue(c.access(), 'test262');
assert.sameValue(c.superAccess(), 'super class');

let s = new S();
assert.sameValue(s.superAccess(), 'super class');
assert.throws(TypeError, function() {
  c.access.call(s);
}, 'invalid access of C private method');
