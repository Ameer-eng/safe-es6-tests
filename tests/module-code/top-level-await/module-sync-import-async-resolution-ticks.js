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
};// Copyright (C) 2019 Leo Balter. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-moduleevaluation
description: >
  Ticks from sync module (no TLA) loading async module
info: |
  Table 3: Additional Fields of Cyclic Module Records

  [[Async]]

  ...
  Having an asynchronous dependency does not make the module asynchronous. This field must not change after the module is parsed.

  Evaluate ( ) Concrete Method

  ...
  6. Let capability be ! NewPromiseCapability(%Promise%).
  7. Set module.[[TopLevelCapability]] to capability.
  8. Let result be InnerModuleEvaluation(module, stack, 0).
  9. If result is an abrupt completion, then
    ...
    d. Perform ! Call(capability.[[Reject]], undefined, «result.[[Value]]»).
  10. Otherwise,
    ...
    b. If module.[[AsyncEvaluating]] is false, then
      i. Perform ! Call(capability.[[Resolve]], undefined, «undefined»).
    ...
  11. Return undefinedcapability.[[Promise]].

  InnerModuleEvaluation( module, stack, index )

  ...
  14. If module.[[PendingAsyncDependencies]] is > 0, set module.[[AsyncEvaluating]] to true.
  15. Otherwise, if module.[[Async]] is true, perform ! ExecuteAsyncModule(module).
  16. Otherwise, perform ? module.ExecuteModule().

  ExecuteAsyncModule ( module )

  1. Assert: module.[[Status]] is "evaluating" or "evaluated".
  2. Assert: module.[[Async]] is true.
  3. Set module.[[AsyncEvaluating]] to true.
  4. Let capability be ! NewPromiseCapability(%Promise%).
  5. Let stepsFulfilled be the steps of a CallAsyncModuleFulfilled function as specified below.
  ...
  8. Let stepsRejected be the steps of a CallAsyncModuleRejected function as specified below.
  ...
  11. Perform ! PerformPromiseThen(capability.[[Promise]], onFulfilled, onRejected).
  12. Perform ! module.ExecuteModule(capability).
  13. Return.

  ExecuteModule ( [ capability ] )

  ...
  11. If module.[[Async]] is false, then
    a. Assert: capability was not provided.
    b. Push moduleCxt on to the execution context stack; moduleCxt is now the running execution context.
    c. Let result be the result of evaluating module.[[ECMAScriptCode]].
    d. Suspend moduleCxt and remove it from the execution context stack.
    e. Resume the context that is now on the top of the execution context stack as the running execution context.
    f. Return Completion(result).
  12. Otherwise,
    a. Assert: capability is a PromiseCapability Record.
    b. Perform ! AsyncBlockStart(capability, module.[[ECMAScriptCode]], moduleCxt).
    c. Return.
flags: [module, async]
features: [top-level-await]
---*/

var x = 'synchronous evaluation';

Promise.resolve().then(() => x = 'tick in the async evaluation');

import foo from './module-import-resolution_FIXTURE.js';
assert.sameValue(foo, 42);
assert.sameValue(x, 'synchronous evaluation');

Promise.resolve().then(() => {
  assert.sameValue(x, 'tick in the async evaluation');
}).then($DONE, $DONE);
