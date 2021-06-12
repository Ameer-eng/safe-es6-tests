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
};// Copyright (C) 2017 Leo Balter. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
description: static class fields forbid PropName 'constructor' (no early error -- PropName of ComputedPropertyName not forbidden value)
esid: sec-class-definitions-static-semantics-early-errors
features: [class, class-static-fields-public]
info: |
    Static Semantics: PropName
    ...
    ComputedPropertyName : [ AssignmentExpression ]
      Return empty.

    This test file tests the following early error is only valid for a matching PropName:

    Static Semantics: Early Errors

    ClassElement : static FieldDefinition;
        It is a Syntax Error if PropName of FieldDefinition is "prototype" or "constructor".

    -- IDK what is calling InitializeClassElements but I guess it's supposed to be called to
    -- set the fields

    InitializeClassElements(F, proto)

    ...
    6. For each item element in order from elements,
      a. If element.[[Kind]] is "field" and element.[[Placement]] is "static" or "prototype",
        ...
        ii. Let receiver be F if element.[[Placement]] is "static", else let receiver be proto.
        iii. Perform ? DefineClassElement(receiver, element).

    -- DefineClassElement is probably DefineField in the class fields proposal

    DefineField(receiver, fieldRecord)

    ...
    8. If fieldName is a Private Name,
      ...
    9. Else,
      a. ...
      b. Perform ? CreateDataPropertyOrThrow(receiver, fieldName, initValue).

    CreateDataPropertyOrThrow ( O, P, V )

    ...
    3. Let success be ? CreateDataProperty(O, P, V).
    4. If success is false, throw a TypeError exception.
    ...

    CreateDataProperty ( O, P, V )

    ...
    3. Let newDesc be the PropertyDescriptor { [[Value]]: V, [[Writable]]: true, [[Enumerable]]: true,
      [[Configurable]]: true }.
    4. Return ? O.[[DefineOwnProperty]](P, newDesc).
includes: [propertyHelper.js]
---*/

var x = 'constructor';
class C1 {
  static [x];
}

verifyProperty(C1, 'constructor', {
  value: undefined,
  configurable: true,
  writable: true,
  enumerable: true,
});

class C2 {
  static [x] = 42;
}

verifyProperty(C2, 'constructor', {
  value: 42,
  configurable: true,
  writable: true,
  enumerable: true,
});
