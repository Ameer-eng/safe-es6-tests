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
};// Copyright (C) 2019 Caio Lima (Igalia SL). All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Private getter contains proper HomeObject
esid: sec-method-definitions-runtime-semantics-classelementevaluation
info: |
  MethodDefinition : get ClassElementName () { FunctionBody }
    1. Let key be the result of evaluating ClassElementName.
    2. ReturnIfAbrupt(key).
    3. If the function code for this MethodDefinition is strict mode code, let strict be true. Otherwise let strict be false.
    4. Let scope be the running execution context's LexicalEnvironment.
    5. Let formalParameterList be an instance of the production FormalParameters:[empty] .
    6. Let closure be FunctionCreate(Method, formalParameterList, FunctionBody, scope, strict).
    7. Perform MakeMethod(closure, homeObject).
    8. Perform SetFunctionName(closure, key, "get").
    9. If key is a Private Name,
      a. If key has a [[Kind]] field,
        i. Assert: key.[[Kind]] is "accessor".
        ii. Assert: key.[[Brand]] is homeObject.
        iii. Assert: key does not have a [[Get]] field.
        iv. Set key.[[Get]] to closure.
      b. Otherwise,
        i. Set key.[[Kind]] to "accessor".
        ii. Set key.[[Brand]] to homeObject.
        iii. Set key.[[Get]] to closure.
    10. Else,
      a. Let desc be the PropertyDescriptor{[[Get]]: closure, [[Enumerable]]: enumerable, [[Configurable]]: true}.
      b. Perform ? DefinePropertyOrThrow(homeObject, key, desc).
features: [class-methods-private, class]
---*/

class A {
  method() {
    return "Test262";
  }
}

class C extends A {
  get #m() {
    return super.method();
  }

  access() {
    return this.#m;
  }
}

let c = new C();
assert.sameValue(c.access(), "Test262");
