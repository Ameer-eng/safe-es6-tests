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
// - src/function-forms/unscopables-with-in-nested-fn.case
// - src/function-forms/default/arrow-function.template
/*---
description: Symbol.unscopables behavior across scope boundaries (arrow function expression)
esid: sec-arrow-function-definitions-runtime-semantics-evaluation
features: [globalThis, Symbol.unscopables]
flags: [generated, noStrict]
info: |
    ArrowFunction : ArrowParameters => ConciseBody

    [...]
    4. Let closure be FunctionCreate(Arrow, parameters, ConciseBody, scope, strict).
    [...]

    9.2.1 [[Call]] ( thisArgument, argumentsList)

    [...]
    7. Let result be OrdinaryCallEvaluateBody(F, argumentsList).
    [...]

    9.2.1.3 OrdinaryCallEvaluateBody ( F, argumentsList )

    1. Let status be FunctionDeclarationInstantiation(F, argumentsList).
    [...]

    9.2.12 FunctionDeclarationInstantiation(func, argumentsList)

    [...]
    23. Let iteratorRecord be Record {[[iterator]]:
        CreateListIterator(argumentsList), [[done]]: false}.
    24. If hasDuplicates is true, then
        [...]
    25. Else,
        b. Let formalStatus be IteratorBindingInitialization for formals with
           iteratorRecord and env as arguments.
    [...]

    ...
    Let envRec be lex's EnvironmentRecord.
    Let exists be ? envRec.HasBinding(name).

    HasBinding

    ...
    If the withEnvironment flag of envRec is false, return true.
    Let unscopables be ? Get(bindings, @@unscopables).
    If Type(unscopables) is Object, then
       Let blocked be ToBoolean(? Get(unscopables, N)).
       If blocked is true, return false.

    (The `with` Statement) Runtime Semantics: Evaluation

    ...
    Set the withEnvironment flag of newEnv’s EnvironmentRecord to true.
    ...

---*/
let count = 0;
var v = 1;
globalThis[Symbol.unscopables] = {
  v: true,
};

{
  count++;

var callCount = 0;
// Stores a reference `ref` for case evaluation
var ref;
ref = (x) => {
  (function() {
    count++;
    with (globalThis) {
      count++;
      assert.sameValue(v, 1, 'The value of `v` is 1');
    }
  })();
  (function() {
    count++;
    var v = x;
    with (globalThis) {
      count++;
      assert.sameValue(v, 10, 'The value of `v` is 10');
      v = 20;
    }
    assert.sameValue(v, 20, 'The value of `v` is 20');
    assert.sameValue(globalThis.v, 1, 'The value of globalThis.v is 1');
  })();
  assert.sameValue(v, 1, 'The value of `v` is 1');
  assert.sameValue(globalThis.v, 1, 'The value of globalThis.v is 1');
  callCount = callCount + 1;
};

ref(10);
assert.sameValue(callCount, 1, 'arrow function invoked exactly once');

  count++;
}
assert.sameValue(count, 6, 'The value of `count` is 6');
