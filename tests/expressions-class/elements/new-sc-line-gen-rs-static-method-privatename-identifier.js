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
// - src/class-elements/rs-static-method-privatename-identifier.case
// - src/class-elements/productions/cls-expr-new-sc-line-generator.template
/*---
description: Valid Static Method PrivateName (field definitions followed by a method in a new line with a semicolon)
esid: prod-FieldDefinition
features: [class-static-methods-private, class, class-fields-public, generators]
flags: [generated]
includes: [propertyHelper.js]
info: |
    ClassElement :
      MethodDefinition
      static MethodDefinition
      FieldDefinition ;
      static FieldDefinition ;
      ;

    MethodDefinition :
      ClassElementName ( UniqueFormalParameters ){ FunctionBody }

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


var C = class {
  static #$(value) {
    return value;
  }
  static #_(value) {
    return value;
  }
  static #\u{6F}(value) {
    return value;
  }
  static #\u2118(value) {
    return value;
  }
  static #ZW_\u200C_NJ(value) {
    return value;
  }
  static #ZW_\u200D_J(value) {
    return value;
  };
  *m() { return 42; }
  static $(value) {
    return this.#$(value);
  }
  static _(value) {
    return this.#_(value);
  }
  static \u{6F}(value) {
    return this.#\u{6F}(value);
  }
  static \u2118(value) {
    return this.#\u2118(value);
  }
  static ZW_\u200C_NJ(value) {
    return this.#ZW_\u200C_NJ(value);
  }
  static ZW_\u200D_J(value) {
    return this.#ZW_\u200D_J(value);
  }

}

var c = new C();

assert.sameValue(c.m().next().value, 42);
assert.sameValue(c.m, C.prototype.m);
assert.sameValue(Object.hasOwnProperty.call(c, "m"), false);

verifyProperty(C.prototype, "m", {
  enumerable: false,
  configurable: true,
  writable: true,
});

assert.sameValue(C.$(1), 1);
assert.sameValue(C._(1), 1);
assert.sameValue(C.\u{6F}(1), 1);
assert.sameValue(C.\u2118(1), 1);
assert.sameValue(C.ZW_\u200C_NJ(1), 1);
assert.sameValue(C.ZW_\u200D_J(1), 1);

