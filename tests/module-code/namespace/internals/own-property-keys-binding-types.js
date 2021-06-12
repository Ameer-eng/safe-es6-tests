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
esid: sec-module-namespace-exotic-objects-ownpropertykeys
description: >
    The [[OwnPropertyKeys]] internal method includes entries for all binding
    types
info: |
    1. Let exports be a copy of the value of O's [[Exports]] internal slot.
    2. Let symbolKeys be ! OrdinaryOwnPropertyKeys(O).
    3. Append all the entries of symbolKeys to the end of exports.
    4. Return exports.

    Note: identifiers have been selected such that runtimes which do not sort
    the [[Exports]] list may still pass. A separate test is dedicated to sort
    order.
flags: [module]
features: [Reflect, Symbol.toStringTag, let]
---*/

import * as ns from './own-property-keys-binding-types.js';
export var a_local1;
var local2;
export { local2 as b_renamed };
export { a_local1 as e_indirect } from './own-property-keys-binding-types.js';
export * from './own-property-keys-binding-types_FIXTURE.js';

var stringKeys = Object.getOwnPropertyNames(ns);

assert.sameValue(stringKeys.length, 10);
assert.sameValue(stringKeys[0], 'a_local1');
assert.sameValue(stringKeys[1], 'b_renamed');
assert.sameValue(stringKeys[2], 'c_localUninit1');
assert.sameValue(stringKeys[3], 'd_renamedUninit');
assert.sameValue(stringKeys[4], 'default');
assert.sameValue(stringKeys[5], 'e_indirect');
assert.sameValue(stringKeys[6], 'f_indirectUninit');
assert.sameValue(stringKeys[7], 'g_star');
assert.sameValue(stringKeys[8], 'h_starRenamed');
assert.sameValue(stringKeys[9], 'i_starIndirect');

var symbolKeys = Object.getOwnPropertySymbols(ns);

assert(
  symbolKeys.length > 0,
  'at least as many Symbol keys as defined by the specification'
);
assert(
  symbolKeys.indexOf(Symbol.toStringTag) > -1,
  'Symbol keys array includes Symbol.toStringTag'
);

var allKeys = Reflect.ownKeys(ns);

assert(
  allKeys.length >= 11,
  'at least as many keys as defined by the module and the specification'
);
assert.sameValue(allKeys[0], 'a_local1');
assert.sameValue(allKeys[1], 'b_renamed');
assert.sameValue(allKeys[2], 'c_localUninit1');
assert.sameValue(allKeys[3], 'd_renamedUninit');
assert.sameValue(allKeys[4], 'default');
assert.sameValue(allKeys[5], 'e_indirect');
assert.sameValue(allKeys[6], 'f_indirectUninit');
assert.sameValue(allKeys[7], 'g_star');
assert.sameValue(allKeys[8], 'h_starRenamed');
assert.sameValue(allKeys[9], 'i_starIndirect');
assert(
  allKeys.indexOf(Symbol.toStringTag) > 9,
  'keys array includes Symbol.toStringTag'
);

export let c_localUninit1;
let localUninit2;
export { localUninit2 as d_renamedUninit };
export { c_localUninit1 as f_indirectUninit } from './own-property-keys-binding-types.js';
export default null;
