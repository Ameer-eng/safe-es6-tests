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
    class numeric property names
---*/
function assertMethodDescriptor(object, name) {
  var desc = Object.getOwnPropertyDescriptor(object, name);
  assert.sameValue(desc.configurable, true, "The value of `desc.configurable` is `true`");
  assert.sameValue(desc.enumerable, false, "The value of `desc.enumerable` is `false`");
  assert.sameValue(desc.writable, true, "The value of `desc.writable` is `true`");
  assert.sameValue(typeof desc.value, 'function', "`typeof desc.value` is `'function'`");
  assert.sameValue('prototype' in desc.value, false, "The result of `'prototype' in desc.value` is `false`");
}

function assertGetterDescriptor(object, name) {
  var desc = Object.getOwnPropertyDescriptor(object, name);
  assert.sameValue(desc.configurable, true, "The value of `desc.configurable` is `true`");
  assert.sameValue(desc.enumerable, false, "The value of `desc.enumerable` is `false`");
  assert.sameValue(typeof desc.get, 'function', "`typeof desc.get` is `'function'`");
  assert.sameValue('prototype' in desc.get, false, "The result of `'prototype' in desc.get` is `false`");
  assert.sameValue(desc.set, undefined, "The value of `desc.set` is `undefined`");
}

function assertSetterDescriptor(object, name) {
  var desc = Object.getOwnPropertyDescriptor(object, name);
  assert.sameValue(desc.configurable, true, "The value of `desc.configurable` is `true`");
  assert.sameValue(desc.enumerable, false, "The value of `desc.enumerable` is `false`");
  assert.sameValue(typeof desc.set, 'function', "`typeof desc.set` is `'function'`");
  assert.sameValue('prototype' in desc.set, false, "The result of `'prototype' in desc.set` is `false`");
  assert.sameValue(desc.get, undefined, "The value of `desc.get` is `undefined`");
}

class B {
  1() { return 1; }
  get 2() { return 2; }
  set 3(_) {}

  static 4() { return 4; }
  static get 5() { return 5; }
  static set 6(_) {}
}

assertMethodDescriptor(B.prototype, '1');
assertGetterDescriptor(B.prototype, '2');
assertSetterDescriptor(B.prototype, '3');

assertMethodDescriptor(B, '4');
assertGetterDescriptor(B, '5');
assertSetterDescriptor(B, '6');

class C extends B {
  1() { return super[1](); }
  get 2() { return super[2]; }
  static 4() { return super[4](); }
  static get 5() { return super[5]; }
}

assert.sameValue(new C()[1](), 1, "`new C()[1]()` returns `1`. Defined as `1() { return super[1](); }`");
assert.sameValue(new C()[2], 2, "The value of `new C()[2]` is `2`. Defined as `get 2() { return super[2]; }`");
assert.sameValue(C[4](), 4, "`C[4]()` returns `4`. Defined as `static 4() { return super[4](); }`");
assert.sameValue(C[5], 5, "The value of `C[5]` is `5`. Defined as `static get 5() { return super[5]; }`");
