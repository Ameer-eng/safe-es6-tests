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
};// Copyright (C) 2016 the V8 project authors. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
esid: sec-module-namespace-exotic-objects-getownproperty-p
description: >
    Behavior of the [[GetOwnProperty]] internal method with a string argument
    describing a binding that cannot be found
info: |
    1. If Type(P) is Symbol, return OrdinaryGetOwnProperty(O, P).
    2. Let exports be the value of O's [[Exports]] internal slot.
    3. If P is not an element of exports, return undefined.
flags: [module]
---*/

import * as ns from './get-own-property-str-not-found.js';
var test262;
export { test262 as anotherName };
var desc;

assert.sameValue(
  Object.prototype.hasOwnProperty.call(ns, 'test262'),
  false,
  'hasOwnProperty: test262'
);
desc = Object.getOwnPropertyDescriptor(ns, 'test262');
assert.sameValue(desc, undefined, 'property descriptor for "test262"');

assert.sameValue(
  Object.prototype.hasOwnProperty.call(ns, 'desc'),
  false,
  'hasOwnProperty: desc'
);
desc = Object.getOwnPropertyDescriptor(ns, 'desc');
assert.sameValue(desc, undefined, 'property descriptor for "desc"');

assert.sameValue(
  Object.prototype.hasOwnProperty.call(ns, 'toStringTag'),
  false,
  'hasOwnProperty: toStringTag'
);
desc = Object.getOwnPropertyDescriptor(ns, 'toStringTag');
assert.sameValue(desc, undefined, 'property descriptor for "toStringTag"');

assert.sameValue(
  Object.prototype.hasOwnProperty.call(ns, 'iterator'),
  false,
  'hasOwnProperty: iterator'
);
desc = Object.getOwnPropertyDescriptor(ns, 'iterator');
assert.sameValue(desc, undefined, 'property descriptor for "iterator"');

assert.sameValue(
  Object.prototype.hasOwnProperty.call(ns, '__proto__'),
  false,
  'hasOwnProperty: __proto__'
);
desc = Object.getOwnPropertyDescriptor(ns, '__proto__');
assert.sameValue(desc, undefined, 'property descriptor for "__proto__"');

assert.sameValue(
  Object.prototype.hasOwnProperty.call(ns, 'default'),
  false,
  'hasOwnProperty: default'
);
desc = Object.getOwnPropertyDescriptor(ns, 'default');
assert.sameValue(desc, undefined, 'property descriptor for "default"');
