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
// - src/class-elements/static-field-anonymous-function-name.case
// - src/class-elements/default/cls-decl.template
/*---
description: Anonymous function receives the name of static fields (field definitions in a class declaration)
esid: prod-FieldDefinition
features: [class-static-fields-private, class-static-fields-public, class]
flags: [generated]
info: |
    Updated Productions

    ClassElement :
      ...
      static FieldDefinition ;

    FieldDefinition :
      ClassElementName Initializer_opt

    ClassDefinitionEvaluation:
      ...

      27. Let staticFields be a new empty List.
      28. For each ClassElement e in order from elements,
        a. If IsStatic of e is false, then
        ...
        b. Else,
          i. Let field be the result of performing PropertyDefinitionEvaluation for m ClassElementEvaluation for e with arguments F and false.
        c. If field is an abrupt completion, then
          ...
        d. If field is not empty,
          i. If IsStatic of e is false, append field to instanceFields.
          ii. Otherwise, append field to staticFields.

      34. For each item fieldRecord in order from staticFields,
        a. Perform ? DefineField(F, field).
      ...

    DefineField(receiver, fieldRecord)
      1. Assert: Type(receiver) is Object.
      2. Assert: fieldRecord is a Record as created by ClassFieldDefinitionEvaluation.
      3. Let name be fieldRecord.[[Name]].
      4. Let initializer be fieldRecord.[[Initializer]].
      5. If initializer is not empty, then
        a. Let initValue be ? Call(initializer, receiver).
      6. Else, let initValue be undefined.
      7. If fieldRecord.[[IsAnonymousFunctionDefinition]] is true, then
        a. Let hasNameProperty be ? HasOwnProperty(initValue, "name").
        b. If hasNameProperty is false, perform SetFunctionName(initValue, fieldName).
      8. If fieldName is a Private Name,
        a. Perform ? PrivateFieldAdd(fieldName, receiver, initValue).
      9. Else,
        a. Assert: IsPropertyKey(fieldName) is true.
        b. Perform ? CreateDataPropertyOrThrow(receiver, fieldName, initValue).
      10. Return.

---*/


class C {
  static #field = () => 'Test262';
  static field = function() { return 42; };

  static accessPrivateField() {
    return this.#field;
  }

}

assert.sameValue(C.accessPrivateField().name, "#field");
assert.sameValue(C.field.name, "field");
