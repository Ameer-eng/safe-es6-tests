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
esid: sec-class-definitions-runtime-semantics-evaluation
description: Assignment of function `name` attribute
info: |
    ClassExpression : class ClassTail

    1. Let value be ? ClassDefinitionEvaluation of ClassTail with arguments
       undefined and "".
    ...
    4. Return value.

    ClassExpression : class BindingIdentifier ClassTail

    1. Let className be StringValue of BindingIdentifier.
    2. Let value be ? ClassDefinitionEvaluation of ClassTail with arguments
       className and className.
    ...
    4. Return value.

    14.6.13 Runtime Semantics: ClassDefinitionEvaluation

    ...
    12. Let constructorInfo be DefineMethod of constructor with arguments proto,
        className as the optional name argument, and constructorParent.
    ...

    14.3.7 Runtime Semantics: DefineMethod

    ...
    7. Let closure be FunctionCreate(kind, UniqueFormalParameters, FunctionBody,
       scope, name, prototype).
    ...

includes: [propertyHelper.js]
---*/

verifyProperty(class {}, "name", {
  value: "", writable: false, enumerable: false, configurable: true
});

verifyProperty(class cls {}, "name", {
  value: "cls", writable: false, enumerable: false, configurable: true
});

verifyProperty(class { constructor() {} }, "name", {
  value: "", writable: false, enumerable: false, configurable: true
});

verifyProperty(class cls { constructor() {} }, "name", {
  value: "cls", writable: false, enumerable: false, configurable: true
});
