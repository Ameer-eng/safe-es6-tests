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
    class this access restriction 2
---*/
class Base {
  constructor(a, b) {
    var o = new Object();
    o.prp = a + b;
    return o;
  }
}

class Subclass extends Base {
  constructor(a, b) {
    var exn;
    try {
      this.prp1 = 3;
    } catch (e) {
      exn = e;
    }
    assert.sameValue(
      exn instanceof ReferenceError,
      true,
      "The result of `exn instanceof ReferenceError` is `true`"
    );
    super(a, b);
    assert.sameValue(this.prp, a + b, "The value of `this.prp` is `a + b`");
    assert.sameValue(this.prp1, undefined, "The value of `this.prp1` is `undefined`");
    assert.sameValue(
      this.hasOwnProperty("prp1"),
      false,
      "`this.hasOwnProperty(\"prp1\")` returns `false`"
    );
    return this;
  }
}

var b = new Base(1, 2);
assert.sameValue(b.prp, 3, "The value of `b.prp` is `3`");


var s = new Subclass(2, -1);
assert.sameValue(s.prp, 1, "The value of `s.prp` is `1`");
assert.sameValue(s.prp1, undefined, "The value of `s.prp1` is `undefined`");
assert.sameValue(
  s.hasOwnProperty("prp1"),
  false,
  "`s.hasOwnProperty(\"prp1\")` returns `false`"
);

class Subclass2 extends Base {
  constructor(x) {
    super(1,2);

    if (x < 0) return;

    var called = false;
    function tmp() { called = true; return 3; }
    var exn = null;
    try {
      super(tmp(),4);
    } catch (e) { exn = e; }
    assert.sameValue(
      exn instanceof ReferenceError,
      true,
      "The result of `exn instanceof ReferenceError` is `true`"
    );
    assert.sameValue(called, true, "The value of `called` is `true`");
  }
}

var s2 = new Subclass2(1);
assert.sameValue(s2.prp, 3, "The value of `s2.prp` is `3`");

var s3 = new Subclass2(-1);
assert.sameValue(s3.prp, 3, "The value of `s3.prp` is `3`");

assert.throws(TypeError, function() { Subclass.call(new Object(), 1, 2); });
assert.throws(TypeError, function() { Base.call(new Object(), 1, 2); });

class BadSubclass extends Base {
  constructor() {}
}

assert.throws(ReferenceError, function() { new BadSubclass(); });
