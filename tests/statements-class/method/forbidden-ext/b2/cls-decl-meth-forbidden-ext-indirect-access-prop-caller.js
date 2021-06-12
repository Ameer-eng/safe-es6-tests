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
// - src/function-forms/forbidden-ext-indirect-access-prop-caller.case
// - src/function-forms/forbidden-extensions/bullet-two/cls-decl-meth.template
/*---
description: Forbidden extension, o.caller (class expression method)
esid: sec-runtime-semantics-bindingclassdeclarationevaluation
features: [class]
flags: [generated, noStrict]
info: |
    ClassDeclaration : class BindingIdentifier ClassTail


    If an implementation extends any function object with an own property named "caller" the value of
    that property, as observed using [[Get]] or [[GetOwnProperty]], must not be a strict function
    object. If it is an accessor property, the function that is the value of the property's [[Get]]
    attribute must never return a strict function when called.

---*/
var CALLER_OWN_PROPERTY_DOES_NOT_EXIST = Symbol();
function inner() {
  // This property may exist, but is forbidden from having a value that is a strict function object
  return inner.hasOwnProperty("caller")
    ? inner.caller
    : CALLER_OWN_PROPERTY_DOES_NOT_EXIST;
}

var callCount = 0;
class C {
  method() {
    /* implicit strict */
    // This and the following conditional value is set in the test's .case file.
    // For every test that has a "true" value here, there is a
    // corresponding test that has a "false" value here.
    // They are generated from two different case files, which use
    let descriptor = Object.getOwnPropertyDescriptor(inner, "caller");
    if (descriptor && descriptor.configurable && false) {
      Object.defineProperty(inner, "caller", {});
    }
    var result = inner();
    if (descriptor && descriptor.configurable && false) {
      assert.sameValue(result, 1, 'If this test defined an own "caller" property on the inner function, then it should be accessible and should return the value it was set to.');
    }

    // "CALLER_OWN_PROPERTY_DOES_NOT_EXIST" is from
    // forbidden-ext-indirect-access-prop-caller.case
    //
    // If the function object "inner" has an own property
    // named "caller", then its value will be returned.
    //
    // If the function object "inner" DOES NOT have an
    // own property named "caller", then the symbol
    // CALLER_OWN_PROPERTY_DOES_NOT_EXIST will be returned.
    if (result !== CALLER_OWN_PROPERTY_DOES_NOT_EXIST) {
      assert.notSameValue(result, this.method);
    }
    callCount++;
  }
}

C.prototype.method();
assert.sameValue(callCount, 1, 'method body evaluated');
