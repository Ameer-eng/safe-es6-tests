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
};// Copyright (C) 2016 the V8 project authors. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
es6id: 25.2.4.2
description: Subclassed GeneratorFunction instances `name` property
info: |
  25.2.4.2 name

  The specification for the name property of Function instances given in
  19.2.4.2 also applies to GeneratorFunction instances.

  19.2.4.2 name

  The value of the name property is an String that is descriptive of the
  function. The name has no semantic significance but is typically a variable or
  property name that is used to refer to the function at its point of definition
  in ECMAScript code. This property has the attributes { [[Writable]]: false,
  [[Enumerable]]: false, [[Configurable]]: true }.

  Anonymous functions objects that do not have a contextual name associated with
  them by this specification do not have a name own property but inherit the
  name property of %FunctionPrototype%.

  19.2.1.1.1 RuntimeSemantics: CreateDynamicFunction(constructor, newTarget,
  kind, args)

  ...
  29. Perform SetFunctionName(F, "anonymous").
  ...
includes: [propertyHelper.js]
---*/

var GeneratorFunction = Object.getPrototypeOf(function* () {}).constructor;

class GFn extends GeneratorFunction {}

var gfn = new GFn('a', 'b', 'return a + b');

assert.sameValue(
  gfn.name, 'anonymous',
  'Dynamic Functions are called anonymous'
);

verifyNotEnumerable(gfn, 'name');
verifyNotWritable(gfn, 'name');
verifyConfigurable(gfn, 'name');
