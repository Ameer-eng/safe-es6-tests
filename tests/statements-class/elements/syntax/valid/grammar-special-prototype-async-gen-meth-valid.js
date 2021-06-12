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
// - src/class-elements/grammar-special-prototype-async-gen-meth-valid.case
// - src/class-elements/syntax/valid/cls-decl-elements-valid-syntax.template
/*---
description: Async Generator Methods can be named "prototype" (class declaration)
esid: prod-ClassElement
features: [async-iteration, class]
flags: [generated]
includes: [propertyHelper.js]
info: |
    Runtime Semantics: ClassDefinitionEvaluation

    ClassTail : ClassHeritage_opt { ClassBody_opt }

    [...]
    6. Let proto be OrdinaryObjectCreate(protoParent).
    [...]
    14. Perform MakeConstructor(F, false, proto).
    [...]
    20. For each ClassElement m in order from methods, do
        a. If IsStatic of m is false, then
            i. Let status be PropertyDefinitionEvaluation of m with arguments proto and false.
    [...]

    Runtime Semantics: PropertyDefinitionEvaluation

    With parameters object and enumerable.

    AsyncGeneratorMethod : async * PropertyName ( UniqueFormalParameters ) { AsyncGeneratorBody }

    [...]
    10. Let desc be PropertyDescriptor { [[Value]]: closure, [[Writable]]: true, [[Enumerable]]: enumerable, [[Configurable]]: true }.
    11. Return ? DefinePropertyOrThrow(object, propKey, desc).

---*/


class C {
  async * prototype() {}
}

assert(C.hasOwnProperty('prototype'));
assert(C.prototype.hasOwnProperty('prototype'));
assert.notSameValue(C.prototype.prototype, C.prototype);
verifyProperty(C.prototype, 'prototype', {
    writable: true,
    enumerable: false,
    configurable: true,
});
