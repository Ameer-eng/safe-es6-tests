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
esid: sec-module-namespace-exotic-objects-delete-p
description: >
    [[Delete]] behavior for a key that describes an uninitialized exported
    binding
info: |
    [...]
    2. Let exports be the value of O's [[Exports]] internal slot.
    3. If P is an element of exports, return false.
flags: [module]
features: [Reflect, let]
---*/

import * as ns from './delete-exported-uninit.js';

assert.throws(TypeError, function() {
  delete ns.local1;
}, 'delete: local1');
assert.sameValue(
  Reflect.deleteProperty(ns, 'local1'), false, 'Reflect.deleteProperty: local1'
);
assert.throws(ReferenceError, function() {
  ns.local1;
}, 'binding unmodified: local1');

assert.throws(TypeError, function() {
  delete ns.renamed;
}, 'delete: renamed');
assert.sameValue(
  Reflect.deleteProperty(ns, 'renamed'), false, 'Reflect.deleteProperty: renamed'
);
assert.throws(ReferenceError, function() {
  ns.renamed;
}, 'binding unmodified: renamed');

assert.throws(TypeError, function() {
  delete ns.indirect;
}, 'delete: indirect');
assert.sameValue(
  Reflect.deleteProperty(ns, 'indirect'),
  false,
  'Reflect.deleteProperty: indirect'
);
assert.throws(ReferenceError, function() {
  ns.indirect;
}, 'binding unmodified: indirect');

assert.throws(TypeError, function() {
  delete ns.default;
}, 'delete: default');
assert.sameValue(
  Reflect.deleteProperty(ns, 'default'),
  false,
  'Reflect.deleteProperty: default'
);
assert.throws(ReferenceError, function() {
  ns.default;
}, 'binding unmodified: default');

export let local1 = 23;
let local2 = 45;
export { local2 as renamed };
export { local1 as indirect } from './delete-exported-uninit.js';
export default null;
