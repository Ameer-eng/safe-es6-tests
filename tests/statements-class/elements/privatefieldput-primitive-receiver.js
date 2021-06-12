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
};// Copyright (C) 2020 Caio Lima (Igalia S.L). All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: PrivateField calls ToObject when receiver is a primitive
esid: sec-putvalue
info: |
  PutValue ( V, W )
    ...
    6. If IsPropertyReference(V), then
      a. If HasPrimitiveBase(V), then
        i. Assert: In this case, base will never be null or undefined.
        ii. Let base be ToObject(base).
      b. If IsPrivateReference(V), then
        i. Return ? PrivateFieldSet(field, base, W).
    ...

  PrivateFieldSet (P, O, value )
    1. Assert: P is a Private Name.
    2. Assert: Type(O) is Object.
    3. Let entry be PrivateFieldFind(P, O).
    4. If entry is empty, throw a TypeError exception.
    5. Set entry.[[PrivateFieldValue]] to value.

features: [class, class-fields-private, BigInt]
---*/

let count = 0;

class C {
  #p = 1;

  method(v) {
    count++;
    try {
      count++;
      this.#p = v;
    } catch (e) {
      count++;
      if (e instanceof TypeError) {
        throw new Test262Error();
      }
    }
  }
}

assert.throws(Test262Error, () => {
  new C().method.call(15, 0);
});
assert.sameValue(count, 3);

assert.throws(Test262Error, () => {
  new C().method.call('Test262', 0);
});
assert.sameValue(count, 6);

assert.throws(Test262Error, () => {
  new C().method.call(Symbol('Test262'), 0);
});
assert.sameValue(count, 9);

assert.throws(Test262Error, () => {
  new C().method.call(15n, 0);
});
assert.sameValue(count, 12);

assert.throws(Test262Error, () => {
  new C().method.call(null, 0);
});
assert.sameValue(count, 15);

assert.throws(Test262Error, () => {
  new C().method.call(undefined, 0);
});
assert.sameValue(count, 18);

