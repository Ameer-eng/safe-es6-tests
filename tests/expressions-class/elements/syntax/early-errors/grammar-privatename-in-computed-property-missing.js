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
// - src/class-elements/grammar-privatename-in-computed-property-missing.case
// - src/class-elements/syntax/invalid/cls-expr-elements-invalid-syntax.template
/*---
description: Use of undeclared PrivateName in ComputedProperty is a syntax error (class expression)
esid: prod-ClassElement
features: [class-fields-private, class-fields-public, class]
flags: [generated]
negative:
  phase: parse
  type: SyntaxError
info: |
    ClassElementName:
      PropertyName
      PrivateIdentifier

    PropertyName:
      LiteralPropertyName
      ComputedPropertyName

    ComputedPropertyName:
      [ AssignmentExpression ]

    AssignmentExpression ... MemberExpression

    MemberExpression:
      MemberExpression . PrivateName

    Static Semantics: AllPrivateIdentifiersValid
      AllPrivateIdentifiersValid is an abstract operation which takes names as an argument.

      MemberExpression : MemberExpression . PrivateIdentifier
        1. If StringValue of PrivateIdentifier is in names, return true.
        2. Return false.

      ClassBody : ClassElementList
        1. Let newNames be the concatenation of names with PrivateBoundIdentifiers of ClassBody.
        2. Return AllPrivateIdentifiersValid of ClassElementList with the argument newNames.

    Static Semantics: Early Errors

    ScriptBody : StatementList
      It is a Syntax Error if AllPrivateIdentifiersValid of StatementList with an empty List as an argument is false unless the source code is eval code that is being processed by a direct eval.

---*/


$DONOTEVALUATE();

var C = class {
  [this.#f] = 'Test262'
};
