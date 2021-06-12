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
// - src/class-elements/intercalated-static-non-static-computed-fields.case
// - src/class-elements/default/cls-decl.template
/*---
description: Computed class fields are executed in the order they are delcared, regardless it is static or instance field (field definitions in a class declaration)
esid: prod-FieldDefinition
features: [class-static-fields-public, class-fields-public, class]
flags: [generated]
includes: [propertyHelper.js]
info: |
    ClassTail : ClassHeritage { ClassBody }
      ...
      28. For each ClassElement e in order from elements,
        a. If IsStatic of e is false, then
          i. Let field be the result of performing ClassElementEvaluation for e with arguments proto and false.
        b. Else,
          i. Let field be the result of performing PropertyDefinitionEvaluation for mClassElementEvaluation for e with arguments F and false.
        c. If field is an abrupt completion, then
          ...
        d. If field is not empty,
          i. If IsStatic of e is false, append field to instanceFields.
          ii. Otherwise, append field to staticFields.
       ...
       34. For each item fieldRecord in order from staticFields,
         a. Perform ? DefineField(F, field).
       ...

    [[Construct]] (argumentsList, newTarget)
      ...
      8. If kind is "base", then
        a. Perform OrdinaryCallBindThis(F, calleeContext, thisArgument).
        b. Let result be InitializeInstanceFields(thisArgument, F).
        c. If result is an abrupt completion, then
          i. Remove calleeContext from execution context stack and restore callerContext as the running execution context.
          ii. Return Completion(result).

---*/

let i = 0;


class C {
  [i++] = i++;
  static [i++] = i++;
  [i++] = i++;
}

let c = new C();

// It is important to notice that static field initializer will run before any instance initializer
verifyProperty(c, "0", {
  value: 4,
  enumerable: true,
  writable: true,
  configurable: true
});

verifyProperty(c, "2", {
  value: 5,
  enumerable: true,
  writable: true,
  configurable: true
});

verifyProperty(C, "1", {
  value: 3,
  enumerable: true,
  writable: true,
  configurable: true
});

assert.sameValue(i, 6);
assert.sameValue(c.hasOwnProperty('1'), false);
assert.sameValue(C.hasOwnProperty('0'), false);
assert.sameValue(C.hasOwnProperty('2'), false);

