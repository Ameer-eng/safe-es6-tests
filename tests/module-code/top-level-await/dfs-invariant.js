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
};// Copyright (C) 2021 the V8 project authors. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
description: Parent completion orderings match the synchronous module behavior
info: |
  6.2.4 AsyncModuleExecutionFulfilled ( module )

  [...]
  5. Let _execList_ be a new empty List.
  6. Perform ! GatherAsyncParentCompletions(_module_, _execList_).
  7. Let _sortedExecList_ be a List of elements that are the elements of
     _execList_, in the order in which they had their [[AsyncEvaluating]]
     fields set to *true* in InnerModuleEvaluation.
  8. Assert: All elements of _sortedExecList_ have their [[AsyncEvaluating]]
     field set to *true*, [[PendingAsyncDependencies]] field set to 0 and
     [[EvaluationError]] field set to *undefined*.
  [...]

  Dependency graph for this test:

                             dfs-invariant.js
  .-----------------------------------+-------.
  |                                   |       v
  |                                   |       dfs-invariant-indirect_FIXTURE.js
  |                               .---|----------------------'
  v                               v   v
  dfs-invariant-direct-1_FIXTURE.js   dfs-invariant-direct-2_FIXTURE.js
            '--------.                            .--------'
                     v                            v
                     dfs-invariant-async_FIXTURE.js
esid: sec-moduleevaluation
flags: [module]
features: [top-level-await, globalThis]
---*/

import './dfs-invariant-direct-1_FIXTURE.js';
import './dfs-invariant-direct-2_FIXTURE.js';
import './dfs-invariant-indirect_FIXTURE.js';

assert.sameValue(globalThis.test262, 'async:direct-1:direct-2:indirect');
