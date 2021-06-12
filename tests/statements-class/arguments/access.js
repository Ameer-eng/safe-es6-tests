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
};// Copyright (C) 2014 the V8 project authors. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
es6id: 14.5
description: >
    class arguments access
---*/
var constructCounts = {
  base: 0,
  subclass: 0,
  subclass2: 0
};

class Base {
  constructor() {
    constructCounts.base++;
    assert.sameValue(arguments.length, 2, "The value of `arguments.length` is `2`");
    assert.sameValue(arguments[0], 1, "The value of `arguments[0]` is `1`");
    assert.sameValue(arguments[1], 2, "The value of `arguments[1]` is `2`");
  }
}

var b = new Base(1, 2);

class Subclass extends Base {
  constructor() {
    constructCounts.subclass++;
    assert.sameValue(arguments.length, 2, "The value of `arguments.length` is `2`");
    assert.sameValue(arguments[0], 3, "The value of `arguments[0]` is `3`");
    assert.sameValue(arguments[1], 4, "The value of `arguments[1]` is `4`");
    super(1, 2);
  }
}

var s = new Subclass(3, 4);
assert.sameValue(Subclass.length, 0, "The value of `Subclass.length` is `0`, because there are 0 formal parameters");

class Subclass2 extends Base {
  constructor(x, y) {
    constructCounts.subclass2++;
    assert.sameValue(arguments.length, 2, "The value of `arguments.length` is `2`");
    assert.sameValue(arguments[0], 3, "The value of `arguments[0]` is `3`");
    assert.sameValue(arguments[1], 4, "The value of `arguments[1]` is `4`");
    super(1, 2);
  }
}

var s2 = new Subclass2(3, 4);
assert.sameValue(Subclass2.length, 2, "The value of `Subclass2.length` is `2`, because there are 2 formal parameters");


assert.sameValue(constructCounts.base, 3, "The value of `constructCounts.base` is `3`");
assert.sameValue(constructCounts.subclass, 1, "The value of `constructCounts.subclass` is `1`");
assert.sameValue(constructCounts.subclass2, 1, "The value of `constructCounts.subclass2` is `1`");
