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
};// Copyright (C) 2019 Caio Lima (Igalia SL). All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: PrivateName of a class is visible in its ComputetProperty scope
esid: prod-ClassTail
info: |
  ClassTail : ClassHeritage { ClassBody }
    1. Let lex be the LexicalEnvironment of the running execution context.
    2. Let classScope be NewDeclarativeEnvironment(lex).
    3. Let classScopeEnvRec be classScope's EnvironmentRecord.
    ...
    8. If ClassBodyopt is present, then
        a. For each element dn of the PrivateBoundIdentifiers of ClassBodyopt,
          i. Perform classPrivateEnvRec.CreateImmutableBinding(dn, true).
          ii. Let privateName be NewPrivateName(dn).
          iii. Perform ! classPrivateEnvRec.InitializeBinding(dn, dn).
    ...
    15. Set the running execution context's LexicalEnvironment to classScope.
    16. Set the running execution context's PrivateEnvironment to classPrivateEnvironment.
    ...
    27. For each ClassElement e in order from elements
      a. If IsStatic of e is false, then
        i. Let field be the result of ClassElementEvaluation for e with arguments proto and false.
    ...

  GetValue ( V )
    ...
    5. If IsPropertyReference(V), then
      ...
      b. If IsPrivateReference(V), then
        i. Return ? PrivateFieldGet(GetReferencedName(V), base).

  PrivateFieldGet ( P, O )
    ...
    4. If entry is empty, throw a TypeError exception.
    ...

features: [class-fields-private, class-fields-public, class]
---*/

const self = this;
assert.throws(TypeError, function() {
  class C {
    [self.#f] = 'Test262';
    #f = 'foo';
  }
}, 'access to a not defined private field in object should throw a TypeError');

