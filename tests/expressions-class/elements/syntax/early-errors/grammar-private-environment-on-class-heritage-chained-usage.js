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
// - src/class-elements/grammar-private-environment-on-class-heritage-chained-usage.case
// - src/class-elements/syntax/invalid/cls-expr-elements-invalid-syntax.template
/*---
description: It's a SyntaxError if a class expression evaluated on ClassHeritage uses an private name declared on subclass. (class expression)
esid: prod-ClassElement
features: [class-fields-private, class-fields-public, class]
flags: [generated]
negative:
  phase: parse
  type: SyntaxError
info: |
    Runtime Semantics: ClassDefinitionEvaluation

    ClassTail : ClassHeritage { ClassBody }
        ...
        5. Let outerPrivateEnvironment be the PrivateEnvironment of the running execution context.
        6. Let classPrivateEnvironment be NewDeclarativeEnvironment(outerPrivateEnvironment).
        7. Let classPrivateEnvRec be classPrivateEnvironment's EnvironmentRecord.
        8. If ClassBodyopt is present, then
            a. For each element dn of the PrivateBoundIdentifiers of ClassBodyopt,
              i. Perform classPrivateEnvRec.CreateImmutableBinding(dn, true).
        9. If ClassHeritageopt is not present, then
            a. Let protoParent be the intrinsic object %ObjectPrototype%.
            b. Let constructorParent be the intrinsic object %FunctionPrototype%.
        10. Else,
            a. Set the running execution context's LexicalEnvironment to classScope.
            b. NOTE: The running execution context's PrivateEnvironment is outerPrivateEnvironment when evaluating ClassHeritage.
        ...

---*/


$DONOTEVALUATE();

var C = class extends class extends class extends class { x = this.#foo; } { #foo; x = this.#bar; } { #bar; x = this.#fuz; }
{
  #fuz;
};
