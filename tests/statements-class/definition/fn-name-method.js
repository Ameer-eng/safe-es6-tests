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
};// Copyright (C) 2015 the V8 project authors. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
es6id: 12.2.6.9
description: Assignment of function `name` attribute (MethodDefinition)
info: |
    6. If IsAnonymousFunctionDefinition(AssignmentExpression) is true, then
       a. Let hasNameProperty be HasOwnProperty(propValue, "name").
       b. ReturnIfAbrupt(hasNameProperty).
       c. If hasNameProperty is false, perform SetFunctionName(propValue,
          propKey).
includes: [propertyHelper.js]
features: [Symbol]
---*/

var namedSym = Symbol('test262');
var anonSym = Symbol();

class A {
  id() {}
  [anonSym]() {}
  [namedSym]() {}
  static id() {}
  static [anonSym]() {}
  static [namedSym]() {}
}

assert.sameValue(A.prototype.id.name, 'id', 'via IdentifierName');
verifyNotEnumerable(A.prototype.id, 'name');
verifyNotWritable(A.prototype.id, 'name');
verifyConfigurable(A.prototype.id, 'name');

assert.sameValue(A.prototype[anonSym].name, '', 'via anonymous Symbol');
verifyNotEnumerable(A.prototype[anonSym], 'name');
verifyNotWritable(A.prototype[anonSym], 'name');
verifyConfigurable(A.prototype[anonSym], 'name');

assert.sameValue(A.prototype[namedSym].name, '[test262]', 'via Symbol');
verifyNotEnumerable(A.prototype[namedSym], 'name');
verifyNotWritable(A.prototype[namedSym], 'name');
verifyConfigurable(A.prototype[namedSym], 'name');

assert.sameValue(A.id.name, 'id', 'static via IdentifierName');
verifyNotEnumerable(A.id, 'name');
verifyNotWritable(A.id, 'name');
verifyConfigurable(A.id, 'name');

assert.sameValue(A[anonSym].name, '', 'static via anonymous Symbol');
verifyNotEnumerable(A[anonSym], 'name');
verifyNotWritable(A[anonSym], 'name');
verifyConfigurable(A[anonSym], 'name');

assert.sameValue(A[namedSym].name, '[test262]', 'static via Symbol');
verifyNotEnumerable(A[namedSym], 'name');
verifyNotWritable(A[namedSym], 'name');
verifyConfigurable(A[namedSym], 'name');
