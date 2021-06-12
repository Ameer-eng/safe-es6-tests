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
esid: sec-functiondeclarationinstantiation
description: >
    Creation of new lexical environment (distinct from the variable
    environment) for the function body outside of strict mode
info: |
    [...]
    29. If strict is false, then
        a. Let lexEnv be NewDeclarativeEnvironment(varEnv).
        b. NOTE: Non-strict functions use a separate lexical Environment Record
           for top-level lexical declarations so that a direct eval can
           determine whether any var scoped declarations introduced by the eval
           code conflict with pre-existing top-level lexically scoped
           declarations.  This is not needed for strict functions because a
           strict direct eval always places all declarations into a new
           Environment Record.
    [...]

    18.2.1.3 Runtime Semantics: EvalDeclarationInstantiation

    [...]
    5. If strict is false, then
       [...]
       b. Let thisLex be lexEnv.
       c. Assert: The following loop will terminate.
       d. Repeat while thisLex is not the same as varEnv,
          i. Let thisEnvRec be thisLex's EnvironmentRecord.
          ii. If thisEnvRec is not an object Environment Record, then
              1. NOTE: The environment of with statements cannot contain any
                 lexical declaration so it doesn't need to be checked for
                 var/let hoisting conflicts.
              2. For each name in varNames, do
                 a. If thisEnvRec.HasBinding(name) is true, then
                    i. Throw a SyntaxError exception.
                    ii. NOTE: Annex B.3.5 defines alternate semantics for the
                        above step.
                 b. NOTE: A direct eval will not hoist var declaration over a
                    like-named lexical declaration.
          iii. Let thisLex be thisLex's outer environment reference.
flags: [noStrict]
features: [let]
---*/

var a = () => { let x; eval('var x;'); };

assert.throws(SyntaxError, a);
