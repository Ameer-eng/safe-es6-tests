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
description: Modules have distinct environment records
esid: sec-moduledeclarationinstantiation
info: |
    [...]
    6. Let env be NewModuleEnvironment(realm.[[GlobalEnv]]).
    7. Set module.[[Environment]] to env.
    [...]

    8.1.2.6 NewModuleEnvironment (E)

    1. Let env be a new Lexical Environment.
    [...]
flags: [module]
features: [generators]
---*/

import './instn-uniq-env-rec-other_FIXTURE.js'
var first = 1;
let second = 2;
const third = 3;
class fourth {}
function fifth() { return 'fifth'; }
function* sixth() { return 'sixth'; }

assert.sameValue(first, 1);
assert.sameValue(second, 2);
assert.sameValue(third, 3);
assert.sameValue(typeof fourth, 'function', 'class declaration');
assert.sameValue(typeof fifth, 'function', 'function declaration');
assert.sameValue(fifth(), 'fifth');
assert.sameValue(typeof sixth, 'function', 'generator function declaration');
assert.sameValue(sixth().next().value, 'sixth');

// Two separate mechanisms are required to ensure that no binding has been
// created for a given identifier. A "bare" reference should produce a
// ReferenceError for non-existent bindings and uninitialized bindings. A
// reference through the `typeof` operator should succeed for non-existent
// bindings and initialized bindings.  Only non-existent bindings satisfy both
// tests.
typeof seventh;
assert.throws(ReferenceError, function() {
  seventh;
});

typeof eight;
assert.throws(ReferenceError, function() {
  eighth;
});

typeof ninth;
assert.throws(ReferenceError, function() {
  ninth;
});

typeof tenth;
assert.throws(ReferenceError, function() {
  tenth;
});

typeof eleventh;
assert.throws(ReferenceError, function() {
  eleventh;
});

typeof twelfth;
assert.throws(ReferenceError, function() {
  twelfth;
});
