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
// - src/invalid-private-names/call-expression-bad-reference.case
// - src/invalid-private-names/default/cls-decl-field-initializer-heritage.template
/*---
description: bad reference in call expression (Invalid private names should throw a SyntaxError, class field initializer in class declaration)
esid: sec-static-semantics-early-errors
features: [class-fields-private, class]
flags: [generated]
negative:
  phase: parse
  type: SyntaxError
info: |
    ScriptBody:StatementList
      It is a Syntax Error if AllPrivateNamesValid of StatementList with an empty List
      as an argument is false unless the source code is eval code that is being
      processed by a direct eval.

    ModuleBody:ModuleItemList
      It is a Syntax Error if AllPrivateNamesValid of ModuleItemList with an empty List
      as an argument is false.

    Static Semantics: AllPrivateNamesValid

    ClassBody : ClassElementList
    1. Let newNames be the concatenation of names with PrivateBoundNames of ClassBody.
    2. Return AllPrivateNamesValid of ClassElementList with the argument newNames.

    For all other grammatical productions, recurse on subexpressions/substatements,
    passing in the names of the caller. If all pieces return true, then return true.
    If any returns false, return false.


    Static Semantics: AllPrivateNamesValid

    MemberExpression : MemberExpression . PrivateName

    1. If StringValue of PrivateName is in names, return true.
    2. Return false.

    CallExpression : CallExpression . PrivateName

    1. If StringValue of PrivateName is in names, return true.
    2. Return false.

---*/



$DONOTEVALUATE();

class Parent {
  #x = 42;
}

class C extends Parent {
  f = (() => {})().#x
}
