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
    throw (message);
}

assert._isSameValue = function (a, b) {
    if (a === b) {
        // Handle +/-0 vs. -/+0
        return a !== 0 || 1 / a === 1 / b;
    }

    // Handle NaN vs. NaN
    return a !== a && b !== b;
};

assert.sameValue = function (actual, expected, message) {
    try {
        if (assert._isSameValue(actual, expected)) {
            return;
        }
    } catch (error) {
        throw (message + ' (_isSameValue operation threw) ' + error);
    }

    if (message === undefined) {
        message = '';
    } else {
        message += ' ';
    }

    message += 'Expected SameValue(«' + assert._toString(actual) + '», «' + assert._toString(expected) + '») to be true';

    throw (message);
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

    throw (message);
};

assert.throws = function (expectedErrorConstructor, func, message) {
    if (typeof func !== "function") {
        throw ('assert.throws requires two arguments: the error constructor ' +
            'and a function to run');
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
            throw (message);
        } else if (thrown.constructor !== expectedErrorConstructor) {
            message += 'Expected a ' + expectedErrorConstructor.name + ' but got a ' + thrown.constructor.name;
            throw (message);
        }
        return;
    }

    message += 'Expected a ' + expectedErrorConstructor.name + ' to be thrown but no exception was thrown at all';
    throw (message);
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
};

// Copyright (C) 2017 Ecma International.  All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
description: |
    Collection of functions used to safely verify the correctness of
    property descriptors.
defines:
  - verifyProperty
  - verifyEqualTo
  - verifyWritable
  - verifyNotWritable
  - verifyEnumerable
  - verifyNotEnumerable
  - verifyConfigurable
  - verifyNotConfigurable
---*/

// @ts-check

/**
 * @param {object} obj
 * @param {string|symbol} name
 * @param {PropertyDescriptor|undefined} desc
 * @param {object} [options]
 * @param {boolean} [options.restore]
 */
function verifyProperty(obj, name, desc, options) {
    assert(
        arguments.length > 2,
        'verifyProperty should receive at least 3 arguments: obj, name, and descriptor'
    );

    var originalDesc = Object.getOwnPropertyDescriptor(obj, name);
    var nameStr = String(name);

    // Allows checking for undefined descriptor if it's explicitly given.
    if (desc === undefined) {
        assert.sameValue(
            originalDesc,
            undefined,
            "obj['" + nameStr + "'] descriptor should be undefined"
        );

        // desc and originalDesc are both undefined, problem solved;
        return true;
    }

    assert(
        Object.prototype.hasOwnProperty.call(obj, name),
        "obj should have an own property " + nameStr
    );

    assert.notSameValue(
        desc,
        null,
        "The desc argument should be an object or undefined, null"
    );

    assert.sameValue(
        typeof desc,
        "object",
        "The desc argument should be an object or undefined, " + String(desc)
    );

    var failures = [];

    if (Object.prototype.hasOwnProperty.call(desc, 'value')) {
        if (!isSameValue(desc.value, originalDesc.value)) {
            failures.push("descriptor value should be " + desc.value);
        }
    }

    if (Object.prototype.hasOwnProperty.call(desc, 'enumerable')) {
        if (desc.enumerable !== originalDesc.enumerable ||
            desc.enumerable !== isEnumerable(obj, name)) {
            failures.push('descriptor should ' + (desc.enumerable ? '' : 'not ') + 'be enumerable');
        }
    }

    if (Object.prototype.hasOwnProperty.call(desc, 'writable')) {
        if (desc.writable !== originalDesc.writable ||
            desc.writable !== isWritable(obj, name)) {
            failures.push('descriptor should ' + (desc.writable ? '' : 'not ') + 'be writable');
        }
    }

    if (Object.prototype.hasOwnProperty.call(desc, 'configurable')) {
        if (desc.configurable !== originalDesc.configurable ||
            desc.configurable !== isConfigurable(obj, name)) {
            failures.push('descriptor should ' + (desc.configurable ? '' : 'not ') + 'be configurable');
        }
    }

    assert(!failures.length, failures.join('; '));

    if (options && options.restore) {
        Object.defineProperty(obj, name, originalDesc);
    }

    return true;
}

function isConfigurable(obj, name) {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    try {
        delete obj[name];
    } catch (e) {
        if (!(e instanceof TypeError)) {
            throw ("Expected TypeError, got " + e)
        }
    }
    return !hasOwnProperty.call(obj, name);
}

function isEnumerable(obj, name) {
    var stringCheck = false;

    if (typeof name === "string") {
        for (var x in obj) {
            if (x === name) {
                stringCheck = true;
                break;
            }
        }
    } else {
        // skip it if name is not string, works for Symbol names.
        stringCheck = true;
    }

    return stringCheck &&
        Object.prototype.hasOwnProperty.call(obj, name) &&
        Object.prototype.propertyIsEnumerable.call(obj, name);
}

function isSameValue(a, b) {
    if (a === 0 && b === 0) return 1 / a === 1 / b;
    if (a !== a && b !== b) return true;

    return a === b;
}

var __isArray = Array.isArray;
function isWritable(obj, name, verifyProp, value) {
    var unlikelyValue = __isArray(obj) && name === "length" ?
        Math.pow(2, 32) - 1 :
        "unlikelyValue";
    var newValue = value || unlikelyValue;
    var hadValue = Object.prototype.hasOwnProperty.call(obj, name);
    var oldValue = obj[name];
    var writeSucceeded;

    try {
        obj[name] = newValue;
    } catch (e) {
        if (!(e instanceof TypeError)) {
            throw ("Expected TypeError, got " + e);
        }
    }

    writeSucceeded = isSameValue(obj[verifyProp || name], newValue);

    // Revert the change only if it was successful (in other cases, reverting
    // is unnecessary and may trigger exceptions for certain property
    // configurations)
    if (writeSucceeded) {
        if (hadValue) {
            obj[name] = oldValue;
        } else {
            delete obj[name];
        }
    }

    return writeSucceeded;
}

function verifyEqualTo(obj, name, value) {
    if (!isSameValue(obj[name], value)) {
        throw ("Expected obj[" + String(name) + "] to equal " + value +
            ", actually " + obj[name]);
    }
}

function verifyWritable(obj, name, verifyProp, value) {
    if (!verifyProp) {
        assert(Object.getOwnPropertyDescriptor(obj, name).writable,
            "Expected obj[" + String(name) + "] to have writable:true.");
    }
    if (!isWritable(obj, name, verifyProp, value)) {
        throw ("Expected obj[" + String(name) + "] to be writable, but was not.");
    }
}

function verifyNotWritable(obj, name, verifyProp, value) {
    if (!verifyProp) {
        assert(!Object.getOwnPropertyDescriptor(obj, name).writable,
            "Expected obj[" + String(name) + "] to have writable:false.");
    }
    if (isWritable(obj, name, verifyProp)) {
        throw ("Expected obj[" + String(name) + "] NOT to be writable, but was.");
    }
}

function verifyEnumerable(obj, name) {
    assert(Object.getOwnPropertyDescriptor(obj, name).enumerable,
        "Expected obj[" + String(name) + "] to have enumerable:true.");
    if (!isEnumerable(obj, name)) {
        throw ("Expected obj[" + String(name) + "] to be enumerable, but was not.");
    }
}

function verifyNotEnumerable(obj, name) {
    assert(!Object.getOwnPropertyDescriptor(obj, name).enumerable,
        "Expected obj[" + String(name) + "] to have enumerable:false.");
    if (isEnumerable(obj, name)) {
        throw ("Expected obj[" + String(name) + "] NOT to be enumerable, but was.");
    }
}

function verifyConfigurable(obj, name) {
    assert(Object.getOwnPropertyDescriptor(obj, name).configurable,
        "Expected obj[" + String(name) + "] to have configurable:true.");
    if (!isConfigurable(obj, name)) {
        throw ("Expected obj[" + String(name) + "] to be configurable, but was not.");
    }
}

function verifyNotConfigurable(obj, name) {
    assert(!Object.getOwnPropertyDescriptor(obj, name).configurable,
        "Expected obj[" + String(name) + "] to have configurable:false.");
    if (isConfigurable(obj, name)) {
        throw ("Expected obj[" + String(name) + "] NOT to be configurable, but was.");
    }
}

function Test262Error(message) {
    this.message = message || "";
}

Test262Error.prototype.toString = function () {
    return "Test262Error: " + this.message;
};

// Copyright (C) 2017 Ecma International.  All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
description: |
    Compare the contents of two arrays
defines: [compareArray]
---*/

function compareArray(a, b) {
    if (b.length !== a.length) {
        return false;
    }

    for (var i = 0; i < a.length; i++) {
        if (!compareArray.isSameValue(b[i], a[i])) {
            return false;
        }
    }
    return true;
}

compareArray.isSameValue = function (a, b) {
    if (a === 0 && b === 0) return 1 / a === 1 / b;
    if (a !== a && b !== b) return true;

    return a === b;
};

compareArray.format = function (array) {
    return "[" + array.map(String).join(', ') + "]";
};

assert.compareArray = function (actual, expected, message) {
    assert(actual != null, "First argument shouldn't be nullish. " + message);
    assert(expected != null, "Second argument shouldn't be nullish. " + message);
    var format = compareArray.format;
    assert(
        compareArray(actual, expected),
        "Expected " + format(actual) + " and " + format(expected) + " to have the same contents. " + message
    );
};
// Copyright (C) 2019 Leo Balter. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-moduleevaluation
description: >
  Evaluate imported rejected module
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
flags: [module]
features: [top-level-await]
negative:
  phase: runtime
  type: TypeError
---*/

import foo from './module-import-rejection-body_FIXTURE.js';

throw new Test262Error('this should be unreachable');
