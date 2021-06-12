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
// - src/class-elements/field-declaration.case
// - src/class-elements/default/cls-decl.template
/*---
description: Fields are defined (field definitions in a class declaration)
esid: prod-FieldDefinition
features: [class-fields-public, class]
flags: [generated]
includes: [propertyHelper.js]
info: |
    Updated Productions

    ClassElement :
      ...
      FieldDefinition ;

    FieldDefinition :
      ClassElementName Initializer_opt

    ClassElementName :
      PropertyName

    PropertyName :
      LiteralPropertyName
      ComputedPropertyName

    LiteralPropertyName :
      IdentifierName
      StringLiteral
      NumericLiteral

    ClassDefinitionEvaluation:
      ...

      26. Let instanceFields be a new empty List.
      28. For each ClassElement e in order from elements,
        a. If IsStatic of e is false, then
          i. Let field be the result of performing ClassElementEvaluation for e with arguments proto and false.
        b. ...
        c. ...
        d. If field is not empty, append field to instanceFields.

      ...

      30. Set F.[[Fields]] to instanceFields.
      ...

---*/
var computed = 'h';


class C {
  f = 'test262';
  'g';
  0 = 'bar';
  [computed];
}

let c = new C();

assert.sameValue(C.f, undefined);
assert.sameValue(C.g, undefined);
assert.sameValue(C.h, undefined);
assert.sameValue(C[0], undefined);

assert.sameValue(Object.hasOwnProperty.call(C, 'f'), false);
assert.sameValue(Object.hasOwnProperty.call(C, 'g'), false);
assert.sameValue(Object.hasOwnProperty.call(C, 'h'), false);
assert.sameValue(Object.hasOwnProperty.call(C, 0), false);

verifyProperty(c, 'f', {
  value: 'test262',
  enumerable: true,
  writable: true,
  configurable: true
});

verifyProperty(c, 'g', {
  value: undefined,
  enumerable: true,
  writable: true,
  configurable: true
});

verifyProperty(c, 0, {
  value: 'bar',
  enumerable: true,
  writable: true,
  configurable: true
});

verifyProperty(c, 'h', {
  value: undefined,
  enumerable: true,
  writable: true,
  configurable: true
});
