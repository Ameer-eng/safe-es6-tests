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
};// Copyright (C) 2021 Alexey Shvayka. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
esid: sec-module-namespace-exotic-objects
description: >
  Internal methods of module namespace exotic objects are correct
  with non-Identifier bindings that are integer indices.
info: |
  [[HasProperty]] ( P )

  [...]
  3. If P is an element of exports, return true.
  4. Return false.

  [[Get]] ( P, Receiver )

  [...]
  13. Return ? targetEnv.GetBindingValue(binding.[[BindingName]], true).

  [[Set]] ( P, V, Receiver )

  1. Return false.

  [[Delete]] ( P )

  [...]
  4. If P is an element of exports, return false.
  5. Return true.
flags: [module]
features: [arbitrary-module-namespace-names, Reflect]
---*/
import * as ns from "./export-expname-binding-index_FIXTURE.js";

assert.sameValue(ns[0], 0);
assert.sameValue(Reflect.get(ns, 1), 1);
assert.sameValue(ns[2], undefined);

assert.throws(TypeError, () => { ns[0] = 1; });
assert(!Reflect.set(ns, 1, 1));
assert.throws(TypeError, () => { ns[2] = 2; });

assert(0 in ns);
assert(Reflect.has(ns, 1));
assert(!(2 in ns));

assert.throws(TypeError, () => { delete ns[0]; });
assert(!Reflect.deleteProperty(ns, 1));
assert(delete ns[2]);
