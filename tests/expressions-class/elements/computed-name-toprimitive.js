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
// - src/class-elements/computed-name-toprimitive.case
// - src/class-elements/default/cls-expr.template
/*---
description: ToPrimitive evaluation in the ComputedPropertyName (field definitions in a class expression)
esid: prod-FieldDefinition
features: [class-fields-public, computed-property-names, Symbol.toPrimitive, class]
flags: [generated]
includes: [propertyHelper.js]
info: |
    Runtime Semantics: ClassDefinitionEvaluation

    ...
    27. For each ClassElement e in order from elements
      a. If IsStatic of me is false, then
        i. Let fields be the result of performing ClassElementEvaluation for e with arguments proto and false.
      b. Else,
        i. Let fields be the result of performing ClassElementEvaluation for e with arguments F and false.
      c. If fields is an abrupt completion, then
        i. Set the running execution context's LexicalEnvironment to lex.
        ii. Set the running execution context's PrivateNameEnvironment to outerPrivateEnvironment.
        iii. Return Completion(status).
    ...

    Runtime Semantics: ClassElementEvaluation

    ClassElement: FieldDefinition;
      Return ClassFieldDefinitionEvaluation of FieldDefinition with parameter false and object.

    Runtime Semantics: ClassFieldDefinitionEvaluation
      With parameters isStatic and homeObject.

    1. Let fieldName be the result of evaluating ClassElementName.
    2. ReturnIfAbrupt(fieldName).
    ...

    Runtime Semantics: Evaluation
      ComputedPropertyName: [ AssignmentExpression ]

    1. Let exprValue be the result of evaluating AssignmentExpression.
    2. Let propName be ? GetValue(exprValue).
    3. Return ? ToPropertyKey(propName).

---*/
var err = function() { throw new Test262Error(); };
var obj1 = {
  [Symbol.toPrimitive]: function() { return "d"; },
  toString: err,
  valueOf: err
};

var obj2 = {
  toString: function() { return "e"; },
  valueOf: err
};

var obj3 = {
  toString: undefined,
  valueOf: function() { return "f"; }
};



var C = class {
  [obj1] = 42;
  [obj2] = 43;
  [obj3] = 44;
}

var c = new C();

assert.sameValue(Object.hasOwnProperty.call(C.prototype, "d"), false);
assert.sameValue(Object.hasOwnProperty.call(C, "d"), false);

verifyProperty(c, "d", {
  value: 42,
  enumerable: true,
  writable: true,
  configurable: true
});

assert.sameValue(Object.hasOwnProperty.call(C.prototype, "e"), false);
assert.sameValue(Object.hasOwnProperty.call(C, "e"), false);

verifyProperty(c, "e", {
  value: 43,
  enumerable: true,
  writable: true,
  configurable: true
});

assert.sameValue(Object.hasOwnProperty.call(C.prototype, "f"), false);
assert.sameValue(Object.hasOwnProperty.call(C, "f"), false);

verifyProperty(c, "f", {
  value: 44,
  enumerable: true,
  writable: true,
  configurable: true
});