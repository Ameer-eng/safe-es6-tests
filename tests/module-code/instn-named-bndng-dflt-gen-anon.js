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
};// Copyright (C) 2016 the V8 project authors. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
description: >
    Imported binding reflects state of exported default binding ("anonymous"
    generator function declaration)
esid: sec-moduledeclarationinstantiation
info: |
    [...]
    17. For each element d in lexDeclarations do
        a. For each element dn of the BoundNames of d do
           i. If IsConstantDeclaration of d is true, then
              [...]
           ii. Else,
               1. Perform ! envRec.CreateMutableBinding(dn, false).
           iii. If d is a GeneratorDeclaration production or a
                FunctionDeclaration production, then
                1. Let fo be the result of performing InstantiateFunctionObject
                   for d with argument env.
                2. Call envRec.InitializeBinding(dn, fo).
    [...]

    14.4.12 Runtime Semantics: InstantiateFunctionObject

    GeneratorDeclaration : function * ( FormalParameters ) { GeneratorBody }

    1. If the function code for GeneratorDeclaration is strict mode code, let
       strict be true. Otherwise let strict be false.
    2. Let F be GeneratorFunctionCreate(Normal, FormalParameters,
       GeneratorBody, scope, strict).
    3. Let prototype be ObjectCreate(%GeneratorPrototype%).
    4. Perform DefinePropertyOrThrow(F, "prototype",
       PropertyDescriptor{[[Value]]: prototype, [[Writable]]: true,
       [[Enumerable]]: false, [[Configurable]]: false}).
    5. Perform SetFunctionName(F, "default").
    6. Return F.

    14.4 Generator Function Definitions

    Syntax

    GeneratorDeclaration[Yield, Default] :
         function * BindingIdentifier[?Yield] ( FormalParameters[Yield] ) { GeneratorBody }
         [+Default] function * ( FormalParameters[Yield] ) { GeneratorBody }
flags: [module]
features: [generators]
---*/

assert.sameValue(g().next().value, 23, 'generator function value is hoisted');
assert.sameValue(g.name, 'default', 'correct name is assigned');

import g from './instn-named-bndng-dflt-gen-anon.js';
export default function* () { return 23; };
