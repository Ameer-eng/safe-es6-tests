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
// - src/class-elements/redeclaration.case
// - src/class-elements/default/cls-expr.template
/*---
description: Redeclaration of public fields with the same name (field definitions in a class expression)
esid: prod-FieldDefinition
features: [class-fields-public, computed-property-names, class]
flags: [generated]
includes: [propertyHelper.js, compareArray.js]
info: |
    2.13.2 Runtime Semantics: ClassDefinitionEvaluation

    ...
    30. Set the value of F's [[Fields]] internal slot to fieldRecords.
    ...

    2.14 [[Construct]] ( argumentsList, newTarget)

    ...
    8. If kind is "base", then
      ...
      b. Let result be InitializeInstanceFields(thisArgument, F).
    ...

    2.9 InitializeInstanceFields ( O, constructor )

    3. Let fieldRecords be the value of constructor's [[Fields]] internal slot.
    4. For each item fieldRecord in order from fieldRecords,
      a. If fieldRecord.[[static]] is false, then
        i. Perform ? DefineField(O, fieldRecord).

---*/
var x = [];


var C = class {
  y = (x.push("a"), "old_value");
  ["y"] = (x.push("b"), "another_value");
  "y" = (x.push("c"), "same_value");
  y = (x.push("d"), "same_value");
}

var c = new C();

assert.sameValue(Object.hasOwnProperty.call(C.prototype, "y"), false);
assert.sameValue(Object.hasOwnProperty.call(C, "y"), false);

verifyProperty(c, "y", {
  value: "same_value",
  enumerable: true,
  writable: true,
  configurable: true
});

assert(compareArray(x, ["a", "b", "c", "d"]));
