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
};// This file was procedurally generated from the following sources:
// - src/class-elements/fields-anonymous-function-length.case
// - src/class-elements/default/cls-decl.template
/*---
description: Anonymous functions in field initializer have length properly set (field definitions in a class declaration)
esid: prod-FieldDefinition
features: [class-fields-private, class-fields-public, class]
flags: [generated]
info: |
    Updated Productions

    FieldDefinition :
      ClassElementName Initializer_opt

    InitializeInstanceFields ( O, constructor )
      1. Assert: Type ( O ) is Object.
      2. Assert: constructor is an ECMAScript function object.
      3. Let fields be the value of constructor.[[Fields]].
      4. For each item fieldRecord in order from fields,
        a. Perform ? DefineField(O, fieldRecord).
      5. Return.

    DefineField(receiver, fieldRecord)
      1. Assert: Type(receiver) is Object.
      2. Assert: fieldRecord is a Record as created by ClassFieldDefinitionEvaluation.
      3. Let name be fieldRecord.[[Name]].
      4. Let initializer be fieldRecord.[[Initializer]].
      5. If initializer is not empty, then
        a. Let initValue be ? Call(initializer, receiver).
      ...

---*/


class C {
  field = function() {};
  #field = (a, b, c, d) => undefined;

  accessPrivateField() {
    return this.#field;
  }
}

let c = new C();
assert.sameValue(c.accessPrivateField().length, 4);
assert.sameValue(c.field.length, 0);
