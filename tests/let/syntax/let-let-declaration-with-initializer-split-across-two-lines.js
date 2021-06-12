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
};// Copyright (C) 2015 Mozilla Corporation. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
author: Jeff Walden
es6id: 13.3.1.1
description: >
    let: |let let| split across two lines is not subject to automatic semicolon insertion.
info: |
  |let| followed by a name is a lexical declaration.  This is so even if the
  name is on a new line.  ASI applies *only* if an offending token not allowed
  by the grammar is encountered, and there's no [no LineTerminator here]
  restriction in LexicalDeclaration or ForDeclaration forbidding a line break.

  It's a tricky point, but this is true *even if* the name is "let", a name that
  can't be bound by LexicalDeclaration or ForDeclaration.  Per 5.3, static
  semantics early errors are validated *after* determining productions matching
  the source text.

  So in this testcase, the eval text matches LexicalDeclaration.  No ASI occurs,
  because "let\nlet = ..." matches LexicalDeclaration before static semantics
  are considered.  *Then* 13.3.1.1's static semantics for the LexicalDeclaration
  just chosen, per 5.3, are validated to recognize the Script as invalid.  Thus
  the eval script can't be evaluated, and a SyntaxError is thrown.
negative:
  phase: parse
  type: SyntaxError
---*/

$DONOTEVALUATE();

let  // start of a LexicalDeclaration, *not* an ASI opportunity
let = "irrelevant initializer";
