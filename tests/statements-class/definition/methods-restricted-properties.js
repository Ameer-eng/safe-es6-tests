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
};// Copyright (C) 2015 Caitlin Potter. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: >
    Functions created using MethodDefinition syntactic form do not have own
    properties "caller" or "arguments", but inherit them from
    %FunctionPrototype%.
es6id: 16.1
---*/

class Class {
  method() {}
  get accessor() {}
  set accessor(x) {}
};

var instance = new Class;
var accessor = Object.getOwnPropertyDescriptor(Class.prototype, "accessor");

assert.sameValue(
  instance.method.hasOwnProperty('caller'),
  false,
  'No "caller" own property (method)'
);
assert.sameValue(
  instance.method.hasOwnProperty('arguments'),
  false,
  'No "arguments" own property (method)'
);
assert.sameValue(
  accessor.get.hasOwnProperty('caller'),
  false,
  'No "caller" own property ("get" accessor)'
);
assert.sameValue(
  accessor.get.hasOwnProperty('arguments'),
  false,
  'No "arguments" own property ("get" accessor)'
);
assert.sameValue(
  accessor.set.hasOwnProperty('caller'),
  false,
  'No "caller" own property ("set" accessor)'
);
assert.sameValue(
  accessor.set.hasOwnProperty('arguments'),
  false,
  'No "arguments" own property ("set" accessor)'
);

// --- Test method restricted properties throw

assert.throws(TypeError, function() {
  return instance.method.caller;
});

assert.throws(TypeError, function() {
  instance.method.caller = {};
});

assert.throws(TypeError, function() {
  return instance.method.arguments;
});

assert.throws(TypeError, function() {
  instance.method.arguments = {};
});

// --- Test getter restricted properties throw

assert.throws(TypeError, function() {
  return accessor.get.caller;
});

assert.throws(TypeError, function() {
  accessor.get.caller = {};
});

assert.throws(TypeError, function() {
  return accessor.get.arguments;
});

assert.throws(TypeError, function() {
  accessor.get.arguments = {};
});

// --- Test setter restricted properties throw

assert.throws(TypeError, function() {
  return accessor.set.caller;
});

assert.throws(TypeError, function() {
  accessor.set.caller = {};
});

assert.throws(TypeError, function() {
  return accessor.set.arguments;
});

assert.throws(TypeError, function() {
  accessor.set.arguments = {};
});
