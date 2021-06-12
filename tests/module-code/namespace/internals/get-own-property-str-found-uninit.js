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
    describing an uninitialized binding
info: |
    1. If Type(P) is Symbol, return OrdinaryGetOwnProperty(O, P).
    2. Let exports be the value of O's [[Exports]] internal slot.
    3. If P is not an element of exports, return undefined.
    4. Let value be ? O.[[Get]](P, O).
flags: [module]
features: [let]
---*/

import * as ns from './get-own-property-str-found-uninit.js';

assert.throws(ReferenceError, function() {
  Object.prototype.hasOwnProperty.call(ns, 'local1');
}, 'hasOwnProperty: local1');
assert.throws(ReferenceError, function() {
  Object.getOwnPropertyDescriptor(ns, 'local1');
}, 'getOwnPropertyDescriptor: local1');

assert.throws(ReferenceError, function() {
  Object.prototype.hasOwnProperty.call(ns, 'renamed');
}, 'hasOwnProperty: renamed');
assert.throws(ReferenceError, function() {
  Object.getOwnPropertyDescriptor(ns, 'renamed');
}, 'getOwnPropertyDescriptor: renamed');

assert.throws(ReferenceError, function() {
  Object.prototype.hasOwnProperty.call(ns, 'indirect');
}, 'hasOwnProperty: indirect');
assert.throws(ReferenceError, function() {
  Object.getOwnPropertyDescriptor(ns, 'indirect');
}, 'getOwnPropertyDescriptor: indirect');

assert.throws(ReferenceError, function() {
  Object.prototype.hasOwnProperty.call(ns, 'default');
}, 'hasOwnProperty: default');
assert.throws(ReferenceError, function() {
  Object.getOwnPropertyDescriptor(ns, 'default');
}, 'getOwnPropertyDescriptor: default');

export let local1 = 23;
let local2 = 45;
export { local2 as renamed };
export { local1 as indirect } from './get-own-property-str-found-uninit.js';
export default null;
