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
// - src/async-generators/yield-star-sync-throw.case
// - src/async-generators/default/async-class-decl-static-private-method.template
/*---
description: execution order for yield* with sync iterator and throw() (Static async generator method as a ClassDeclaration element)
esid: prod-AsyncGeneratorPrivateMethod
features: [Symbol.iterator, async-iteration, class-static-methods-private]
flags: [generated, async]
info: |
    ClassElement :
      static PrivateMethodDefinition

    MethodDefinition :
      AsyncGeneratorMethod

    Async Generator Function Definitions

    AsyncGeneratorMethod :
      async [no LineTerminator here] * PropertyName ( UniqueFormalParameters ) { AsyncGeneratorBody }


    YieldExpression: yield * AssignmentExpression

    ...
    6. Repeat
      ...
      b. Else if received.[[Type]] is throw, then
        i. Let throw be ? GetMethod(iterator, "throw").
        ii. If throw is not undefined, then
          1. Let innerResult be ? Call(throw, iterator, « received.[[Value]] »).
          2. If generatorKind is async, then set innerResult to
             ? Await(innerResult).
          ...
          5. Let done be ? IteratorComplete(innerResult).
          6. If done is true, then
            a. Return ? IteratorValue(innerResult).
          7. Let received be GeneratorYield(innerResult).
      ...

    %AsyncFromSyncIteratorPrototype%.throw ( value )

    ...
    5. Let throw be GetMethod(syncIterator, "throw").
    ...
    8. Let throwResult be Call(throw, syncIterator, « value »).
    ...
    11. Let throwValue be IteratorValue(throwResult).
    ...
    13. Let throwDone be IteratorComplete(throwResult).
    ...
    16. Perform ! Call(valueWrapperCapability.[[Resolve]], undefined,
        « throwValue »).
    ...
    18. Set onFulfilled.[[Done]] to throwDone.
    19. Perform ! PerformPromiseThen(valueWrapperCapability.[[Promise]],
        onFulfilled, undefined, promiseCapability).
    ...

---*/
var log = [];
var obj = {
  [Symbol.iterator]() {
    var throwCount = 0;
    return {
      name: "syncIterator",
      get next() {
        log.push({ name: "get next" });
        return function() {
          return {
            value: "next-value-1",
            done: false
          };
        };
      },
      get throw() {
        log.push({
          name: "get throw",
          thisValue: this
        });
        return function() {
          log.push({
            name: "call throw",
            thisValue: this,
            args: [...arguments]
          });

          throwCount++;
          if (throwCount == 1) {
            return {
              name: "throw-result-1",
              get value() {
                log.push({
                  name: "get throw value (1)",
                  thisValue: this
                });
                return "throw-value-1";
              },
              get done() {
                log.push({
                  name: "get throw done (1)",
                  thisValue: this
                });
                return false;
              }
            };
          }

          return {
            name: "throw-result-2",
            get value() {
              log.push({
                name: "get throw value (2)",
                thisValue: this
              });
              return "throw-value-2";
            },
            get done() {
              log.push({
                name: "get throw done (2)",
                thisValue: this
              });
              return true;
            }
          };
        };
      }
    };
  }
};



var callCount = 0;

class C {
    static async *#gen() {
        callCount += 1;
        log.push({ name: "before yield*" });
          var v = yield* obj;
          log.push({
            name: "after yield*",
            value: v
          });
          return "return-value";

    }
    static get gen() { return this.#gen; }
}

// Test the private fields do not appear as properties before set to value
assert.sameValue(Object.hasOwnProperty.call(C.prototype, "#gen"), false, 'Object.hasOwnProperty.call(C.prototype, "#gen")');
assert.sameValue(Object.hasOwnProperty.call(C, "#gen"), false, 'Object.hasOwnProperty.call(C, "#gen")');

var iter = C.gen();

assert.sameValue(log.length, 0, "log.length");

iter.next().then(v => {
  assert.sameValue(log[0].name, "before yield*");

  assert.sameValue(log[1].name, "get next");

  assert.sameValue(v.value, "next-value-1");
  assert.sameValue(v.done, false);

  assert.sameValue(log.length, 2, "log.length");

  iter.throw("throw-arg-1").then(v => {
    assert.sameValue(log[2].name, "get throw");
    assert.sameValue(log[2].thisValue.name, "syncIterator", "get throw thisValue");

    assert.sameValue(log[3].name, "call throw");
    assert.sameValue(log[3].thisValue.name, "syncIterator", "throw thisValue");
    assert.sameValue(log[3].args.length, 1, "throw args.length");
    assert.sameValue(log[3].args[0], "throw-arg-1", "throw args[0]");

    assert.sameValue(log[4].name, "get throw done (1)");
    assert.sameValue(log[4].thisValue.name, "throw-result-1", "get throw done thisValue");

    assert.sameValue(log[5].name, "get throw value (1)");
    assert.sameValue(log[5].thisValue.name, "throw-result-1", "get throw value thisValue");

    assert.sameValue(v.value, "throw-value-1");
    assert.sameValue(v.done, false);

    assert.sameValue(log.length, 6, "log.length");

    iter.throw().then(v => {
      assert.sameValue(log[6].name, "get throw");
      assert.sameValue(log[6].thisValue.name, "syncIterator", "get throw thisValue");

      assert.sameValue(log[7].name, "call throw");
      assert.sameValue(log[7].thisValue.name, "syncIterator", "throw thisValue");
      assert.sameValue(log[7].args.length, 1, "throw args.length");
      assert.sameValue(log[7].args[0], undefined, "throw args[0]");

      assert.sameValue(log[8].name, "get throw done (2)");
      assert.sameValue(log[8].thisValue.name, "throw-result-2", "get throw done thisValue");

      assert.sameValue(log[9].name, "get throw value (2)");
      assert.sameValue(log[9].thisValue.name, "throw-result-2", "get throw value thisValue");

      assert.sameValue(log[10].name, "after yield*");
      assert.sameValue(log[10].value, "throw-value-2");

      assert.sameValue(v.value, "return-value");
      assert.sameValue(v.done, true);

      assert.sameValue(log.length, 11, "log.length");
    }).then($DONE, $DONE);
  }).catch($DONE);
}).catch($DONE);

assert.sameValue(callCount, 1);

// Test the private fields do not appear as properties after set to value
assert.sameValue(Object.hasOwnProperty.call(C.prototype, "#gen"), false, 'Object.hasOwnProperty.call(C.prototype, "#gen")');
assert.sameValue(Object.hasOwnProperty.call(C, "#gen"), false, 'Object.hasOwnProperty.call(C, "#gen")');