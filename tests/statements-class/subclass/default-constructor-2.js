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
    class default constructor 2
---*/
class Base1 { }
assert.throws(TypeError, function() { Base1(); });

class Subclass1 extends Base1 { }

assert.throws(TypeError, function() { Subclass1(); });

var s1 = new Subclass1();
assert.sameValue(
  Subclass1.prototype,
  Object.getPrototypeOf(s1),
  "The value of `Subclass1.prototype` is `Object.getPrototypeOf(s1)`, after executing `var s1 = new Subclass1();`"
);

class Base2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Subclass2 extends Base2 {};

var s2 = new Subclass2(1, 2);

assert.sameValue(
  Subclass2.prototype,
  Object.getPrototypeOf(s2),
  "The value of `Subclass2.prototype` is `Object.getPrototypeOf(s2)`, after executing `var s2 = new Subclass2(1, 2);`"
);
assert.sameValue(s2.x, 1, "The value of `s2.x` is `1`");
assert.sameValue(s2.y, 2, "The value of `s2.y` is `2`");

var f = Subclass2.bind({}, 3, 4);
var s2prime = new f();
assert.sameValue(
  Subclass2.prototype,
  Object.getPrototypeOf(s2prime),
  "The value of `Subclass2.prototype` is `Object.getPrototypeOf(s2prime)`"
);
assert.sameValue(s2prime.x, 3, "The value of `s2prime.x` is `3`");
assert.sameValue(s2prime.y, 4, "The value of `s2prime.y` is `4`");


var obj = {};
class Base3 {
  constructor() {
    return obj;
  }
}

class Subclass3 extends Base3 {};

var s3 = new Subclass3();
assert.sameValue(s3, obj, "The value of `s3` is `obj`");

