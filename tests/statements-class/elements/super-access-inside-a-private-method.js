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
description: Private method contains proper HomeObject
esid: sec-method-definitions-runtime-semantics-classelementevaluation
info: |
  MethodDefinition : ClassElementName ( UniqueFormalParameters ) { FunctionBody }
    1. Let methodDef be DefineMethod of MethodDefinition with argument homeObject.
    2. ReturnIfAbrupt(methodDef).
    3. Perform ? DefineOrdinaryMethod(methodDef.[[Key]], homeObject, methodDef.[[Closure]], _enumerable).

  MethodDefinition : PropertyName ( UniqueFormalParameters ) { FunctionBody }
    1. Let propKey be the result of evaluating PropertyName.
    2. ReturnIfAbrupt(propKey).
    3. Let scope be the running execution context's LexicalEnvironment.
    4. If functionPrototype is present as a parameter, then
      a. Let kind be Normal.
      b. Let prototype be functionPrototype.
    5. Else,
      a. Let kind be Method.
      b. Let prototype be the intrinsic object %FunctionPrototype%.
    6. Let closure be FunctionCreate(kind, UniqueFormalParameters, FunctionBody, scope, prototype).
    7. Perform MakeMethod(closure, object).
    8. Set closure.[[SourceText]] to the source text matched by MethodDefinition.
    9. Return the Record { [[Key]]: propKey, [[Closure]]: closure }.
features: [class-methods-private, class]
---*/

class A {
  method() {
    return "Test262";
  }
}

class C extends A {
  #m() {
    return super.method();
  }

  access(o) {
    return this.#m.call(o);
  }
}

let c = new C();
assert.sameValue(c.access(c), "Test262");

let o = {};
assert.sameValue(c.access(o), "Test262");