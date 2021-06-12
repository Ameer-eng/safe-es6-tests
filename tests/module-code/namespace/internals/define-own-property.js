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
esid: sec-module-namespace-exotic-objects-defineownproperty-p-desc
description: >
    The [[DefineOwnProperty]] internal method returns `true` if no change is
    requested, and `false` otherwise.
flags: [module]
features: [Symbol.iterator, Reflect, Symbol, Symbol.toStringTag]
---*/

import * as ns from './define-own-property.js';
export var local1;
var local2;
export { local2 as renamed };
export { local1 as indirect } from './define-own-property.js';
var sym = Symbol('test262');

const exported = ['local1', 'renamed', 'indirect'];


// Non-existant properties.

for (const key of ['local2', 0, sym, Symbol.iterator]) {
  assert.sameValue(
    Reflect.defineProperty(ns, key, {}),
    false,
    'Reflect.defineProperty: ' + key.toString()
  );
  assert.throws(TypeError, function() {
    Object.defineProperty(ns, key, {});
  }, 'Object.defineProperty: ' + key.toString());
}


// Own properties. No change requested.

for (const key of ([...exported, Symbol.toStringTag])) {
  assert.sameValue(
    Reflect.defineProperty(ns, key, {}),
    true,
    'Reflect.defineProperty: ' + key.toString()
  );
  assert.sameValue(
    Object.defineProperty(ns, key, {}),
    ns,
    'Object.defineProperty: ' + key.toString()
  );

}

assert.sameValue(
  Reflect.defineProperty(ns, 'indirect',
      {writable: true, enumerable: true, configurable: false}),
  true,
  'Reflect.defineProperty: indirect'
);
assert.sameValue(
  Object.defineProperty(ns, 'indirect',
      {writable: true, enumerable: true, configurable: false}),
  ns,
  'Object.defineProperty: indirect'
);

assert.sameValue(
  Reflect.defineProperty(ns, Symbol.toStringTag,
      {value: "Module", writable: false, enumerable: false,
       configurable: false}),
  true,
  'Reflect.defineProperty: Symbol.toStringTag'
);
assert.sameValue(
  Object.defineProperty(ns, Symbol.toStringTag,
      {value: "Module", writable: false, enumerable: false,
       configurable: false}),
  ns,
  'Object.defineProperty: Symbol.toStringTag'
);


// Own properties. Change requested.

for (const key of ([...exported, Symbol.toStringTag])) {
  assert.sameValue(
    Reflect.defineProperty(ns, key, {value: 123}),
    false,
    'Reflect.defineProperty: ' + key.toString()
  );
  assert.throws(TypeError, function() {
    Object.defineProperty(ns, key, {value: 123});
  }, 'Object.defineProperty: ' + key.toString());
}

assert.sameValue(
  Reflect.defineProperty(ns, 'indirect',
      {writable: true, enumerable: true, configurable: true}),
  false,
  'Reflect.defineProperty: indirect'
);
assert.throws(TypeError, function() {
  Object.defineProperty(ns, 'indirect',
      {writable: true, enumerable: true, configurable: true});
}, 'Object.defineProperty: indirect');

assert.sameValue(
  Reflect.defineProperty(ns, Symbol.toStringTag,
      {value: "module", writable: false, enumerable: false,
       configurable: false}),
  false,
  'Reflect.defineProperty: Symbol.toStringTag'
);
assert.throws(TypeError, function() {
  Object.defineProperty(ns, Symbol.toStringTag,
      {value: "module", writable: false, enumerable: false,
       configurable: false});
}, 'Object.defineProperty: Symbol.toStringTag');
