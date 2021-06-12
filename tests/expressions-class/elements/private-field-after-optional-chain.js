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
// - src/class-elements/private-field-after-optional-chain.case
// - src/class-elements/default/cls-expr.template
/*---
description: OptionalChain.PrivateIdentifier is a valid syntax (field definitions in a class expression)
esid: prod-FieldDefinition
features: [class-fields-private, optional-chaining, class]
flags: [generated]
info: |
    Updated Productions

    OptionalChain[Yield, Await] :
      `?.` `[` Expression[+In, ?Yield, ?Await] `]`
      `?.` IdentifierName
      `?.` Arguments[?Yield, ?Await]
      `?.` TemplateLiteral[?Yield, ?Await, +Tagged]
      OptionalChain[?Yield, ?Await]  `[` Expression[+In, ?Yield, ?Await] `]`
      OptionalChain[?Yield, ?Await] `.` IdentifierName
      OptionalChain[?Yield, ?Await] Arguments[?Yield, ?Await]
      OptionalChain[?Yield, ?Await] TemplateLiteral[?Yield, ?Await, +Tagged]
      OptionalChain[?Yield, ?Await] `.` PrivateIdentifier

---*/


var C = class {
  #f = 'Test262';

  method(o) {
    return o?.c.#f;
  }
}

let c = new C();
let o = {c: c};
assert.sameValue(c.method(o), 'Test262');

assert.sameValue(c.method(null), undefined);
assert.sameValue(c.method(undefined), undefined);

o = {c: new Object()};
assert.throws(TypeError, function() {
  c.method(o);
}, 'accessed private field from an ordinary object');
