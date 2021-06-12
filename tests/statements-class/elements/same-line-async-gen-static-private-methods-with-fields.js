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
// - src/class-elements/static-private-methods-with-fields.case
// - src/class-elements/productions/cls-decl-after-same-line-async-gen.template
/*---
description: static private methods with fields (field definitions after an async generator in the same line)
esid: prod-FieldDefinition
features: [class-static-methods-private, class-static-fields-private, class, class-fields-public, async-iteration]
flags: [generated, async]
includes: [propertyHelper.js]
info: |
    ClassElement :
      ...
      static FieldDefinition ;

    FieldDefinition :
      ClassElementName Initializer_opt

    ClassElementName :
      PrivateName

    PrivateName :
      # IdentifierName

---*/


class C {
  async *m() { return 42; } static #xVal; static #yVal;
  static #x(value) {
    this.#xVal = value;
    return this.#xVal;
  }
  static #y(value) {
    this.#yVal = value;
    return this.#yVal;
  }
  static x() {
    return this.#x(42);
  }
  static y() {
    return this.#y(43);
  }
}

var c = new C();

assert.sameValue(Object.hasOwnProperty.call(c, "m"), false);
assert.sameValue(c.m, C.prototype.m);

verifyProperty(C.prototype, "m", {
  enumerable: false,
  configurable: true,
  writable: true,
}, {restore: true});

c.m().next().then(function(v) {
  assert.sameValue(v.value, 42);
  assert.sameValue(v.done, true);

  function assertions() {
    // Cover $DONE handler for async cases.
    function $DONE(error) {
      if (error) {
        throw new Test262Error('Test262:AsyncTestFailure')
      }
    }
    // Test the private methods do not appear as properties before set to value
    assert.sameValue(Object.hasOwnProperty.call(C.prototype, "#x"), false, "test 1");
    assert.sameValue(Object.hasOwnProperty.call(C, "#x"), false, "test 2");
    assert.sameValue(Object.hasOwnProperty.call(c, "#x"), false, "test 3");

    assert.sameValue(Object.hasOwnProperty.call(C.prototype, "#y"), false, "test 4");
    assert.sameValue(Object.hasOwnProperty.call(C, "#y"), false, "test 5");
    assert.sameValue(Object.hasOwnProperty.call(c, "#y"), false, "test 6");

    assert.sameValue(Object.hasOwnProperty.call(C.prototype, "#xVal"), false, "test 7");
    assert.sameValue(Object.hasOwnProperty.call(C, "#xVal"), false, "test 8");
    assert.sameValue(Object.hasOwnProperty.call(c, "#xVal"), false, "test 9");

    assert.sameValue(Object.hasOwnProperty.call(C.prototype, "#yVal"), false, "test 10");
    assert.sameValue(Object.hasOwnProperty.call(C, "#yVal"), false, "test 11");
    assert.sameValue(Object.hasOwnProperty.call(c, "#yVal"), false, "test 12");

    // Test if private fields can be sucessfully accessed and set to value
    assert.sameValue(C.x(), 42, "test 13");
    assert.sameValue(C.y(), 43, "test 14");

    // Test the private fields do not appear as properties before after set to value
    assert.sameValue(Object.hasOwnProperty.call(C, "#x"), false, "test 15");
    assert.sameValue(Object.hasOwnProperty.call(C, "#y"), false, "test 16");

    assert.sameValue(Object.hasOwnProperty.call(C, "#xVal"), false, "test 17");
    assert.sameValue(Object.hasOwnProperty.call(C, "#yVal"), false, "test 18");
  }

  return Promise.resolve(assertions());
}).then($DONE, $DONE);
