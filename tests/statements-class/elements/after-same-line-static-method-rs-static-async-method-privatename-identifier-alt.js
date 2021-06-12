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
// - src/class-elements/rs-static-async-method-privatename-identifier-alt.case
// - src/class-elements/productions/cls-decl-after-same-line-static-method.template
/*---
description: Valid Static AsyncMethod PrivateName (field definitions after a static method in the same line)
esid: prod-FieldDefinition
features: [class-static-methods-private, class, class-fields-public]
flags: [generated, async]
includes: [propertyHelper.js]
info: |
    ClassElement :
      MethodDefinition
      static MethodDefinition
      FieldDefinition ;
      static FieldDefinition ;
      ;

    MethodDefinition :
      AsyncMethod

    AsyncMethod :
      async [no LineTerminator here] ClassElementName ( UniqueFormalParameters ){ AsyncFunctionBody }

    ClassElementName :
      PropertyName
      PrivateName

    PrivateName ::
      # IdentifierName

    IdentifierName ::
      IdentifierStart
      IdentifierName IdentifierPart

    IdentifierStart ::
      UnicodeIDStart
      $
      _
      \ UnicodeEscapeSequence

    IdentifierPart::
      UnicodeIDContinue
      $
      \ UnicodeEscapeSequence
      <ZWNJ> <ZWJ>

    UnicodeIDStart::
      any Unicode code point with the Unicode property "ID_Start"

    UnicodeIDContinue::
      any Unicode code point with the Unicode property "ID_Continue"


    NOTE 3
    The sets of code points with Unicode properties "ID_Start" and
    "ID_Continue" include, respectively, the code points with Unicode
    properties "Other_ID_Start" and "Other_ID_Continue".

---*/


class C {
  static m() { return 42; } static async #$(value) {
    return await value;
  }
  static async #_(value) {
    return await value;
  }
  static async #o(value) {
    return await value;
  }
  static async #℘(value) {
    return await value;
  }
  static async #ZW_‌_NJ(value) {
    return await value;
  }
  static async #ZW_‍_J(value) {
    return await value;
  };
  static async $(value) {
    return await this.#$(value);
  }
  static async _(value) {
    return await this.#_(value);
  }
  static async o(value) {
    return await this.#o(value);
  }
  static async ℘(value) { // DO NOT CHANGE THE NAME OF THIS FIELD
    return await this.#℘(value);
  }
  static async ZW_‌_NJ(value) { // DO NOT CHANGE THE NAME OF THIS FIELD
    return await this.#ZW_‌_NJ(value);
  }
  static async ZW_‍_J(value) { // DO NOT CHANGE THE NAME OF THIS FIELD
    return await this.#ZW_‍_J(value);
  }

}

var c = new C();

assert.sameValue(C.m(), 42);
assert.sameValue(Object.hasOwnProperty.call(c, "m"), false);
assert.sameValue(Object.hasOwnProperty.call(C.prototype, "m"), false);

verifyProperty(C, "m", {
  enumerable: false,
  configurable: true,
  writable: true,
});

Promise.all([
  C.$(1),
  C._(1),
  C.o(1),
  C.℘(1), // DO NOT CHANGE THE NAME OF THIS FIELD
  C.ZW_‌_NJ(1), // DO NOT CHANGE THE NAME OF THIS FIELD
  C.ZW_‍_J(1), // DO NOT CHANGE THE NAME OF THIS FIELD
]).then(results => {

  assert.sameValue(results[0], 1);
  assert.sameValue(results[1], 1);
  assert.sameValue(results[2], 1);
  assert.sameValue(results[3], 1);
  assert.sameValue(results[4], 1);
  assert.sameValue(results[5], 1);

}).then($DONE, $DONE);
