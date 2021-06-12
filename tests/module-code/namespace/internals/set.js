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
esid: sec-module-namespace-exotic-objects-set-p-v-receiver
description: The [[Set]] internal method consistently returns `false`
info: |
    1. Return false.
flags: [module]
features: [Reflect, Symbol, Symbol.toStringTag]
---*/

import * as ns from './set.js';
export var local1 = null;
var local2 = null;
export { local2 as renamed };
export { local1 as indirect } from './set.js';
var sym = Symbol('test262');

assert.sameValue(Reflect.set(ns, 'local1'), false, 'Reflect.set: local1');
assert.throws(TypeError, function() {
  ns.local1 = null;
}, 'AssignmentExpression: local1');

assert.sameValue(Reflect.set(ns, 'local2'), false, 'Reflect.set: local2');
assert.throws(TypeError, function() {
  ns.local2 = null;
}, 'AssignmentExpression: local2');

assert.sameValue(Reflect.set(ns, 'renamed'), false, 'Reflect.set: renamed');
assert.throws(TypeError, function() {
  ns.renamed = null;
}, 'AssignmentExpression: renamed');

assert.sameValue(Reflect.set(ns, 'indirect'), false, 'Reflect.set: indirect');
assert.throws(TypeError, function() {
  ns.indirect = null;
}, 'AssignmentExpression: indirect');

assert.sameValue(Reflect.set(ns, 'default'), false, 'Reflect.set: default');
assert.throws(TypeError, function() {
  ns.default = null;
}, 'AssignmentExpression: default');

assert.sameValue(
  Reflect.set(ns, Symbol.toStringTag),
  false,
  'Reflect.set: Symbol.toStringTag'
);
assert.throws(TypeError, function() {
  ns[Symbol.toStringTag] = null;
}, 'AssignmentExpression: Symbol.toStringTag');

assert.sameValue(Reflect.set(ns, sym), false, 'Reflect.set: sym');
assert.throws(TypeError, function() {
  ns[sym] = null;
}, 'AssignmentExpression: sym');
