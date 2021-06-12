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
// - src/class-elements/prod-private-generator.case
// - src/class-elements/private-methods/cls-decl.template
/*---
description: Private Generator (private method definitions in a class declaration)
esid: prod-MethodDefinition
features: [generators, class, class-methods-private]
flags: [generated]
info: |
    ClassElement :
      MethodDefinition
      ...
      ;

    ClassElementName :
      PropertyName
      PrivateName

    PrivateName ::
      # IdentifierName

    MethodDefinition :
      ClassElementName ( UniqueFormalParameters ) { FunctionBody }
      GeneratorMethod
      AsyncMethod
      AsyncGeneratorMethod 
      get ClassElementName () { FunctionBody }
      set ClassElementName ( PropertySetParameterList ) { FunctionBody }

    GeneratorMethod :
      * ClassElementName ( UniqueFormalParameters ){GeneratorBody}

    AsyncMethod :
      async [no LineTerminator here] ClassElementName ( UniqueFormalParameters ) { AsyncFunctionBody }

    AsyncGeneratorMethod :
      async [no LineTerminator here]* ClassElementName ( UniqueFormalParameters ) { AsyncGeneratorBody }

    ---

    InitializeClassElements ( F, proto )

    ...
    5. For each item element in order from elements,
      a. Assert: If element.[[Placement]] is "prototype" or "static", then element.[[Key]] is not a Private Name.
      b. If element.[[Kind]] is "method" and element.[[Placement]] is "static" or "prototype",
        i. Let receiver be F if element.[[Placement]] is "static", else let receiver be proto.
        ii. Perform ? DefineClassElement(receiver, element).

    InitializeInstanceElements ( O, constructor )

    ...
    3. Let elements be the value of F's [[Elements]] internal slot.
    4. For each item element in order from elements,
      a. If element.[[Placement]] is "own" and element.[[Kind]] is "method",
        i. Perform ? DefineClassElement(O, element).

    DefineClassElement (receiver, element)

    ...
    6. If key is a Private Name,
      a. Perform ? PrivateFieldDefine(receiver, key, descriptor).

    PrivateFieldDefine (P, O, desc)

    ...
    6. Append { [[PrivateName]]: P, [[PrivateFieldDescriptor]]: desc } to O.[[PrivateFieldDescriptors]].

---*/


/*** template notes
 * method should always be #m
 * the template provides c.ref() for external reference
 */

function hasProp(obj, name, expected, msg) {
  var hasOwnProperty = Object.prototype.hasOwnProperty.call(obj, name);
  assert.sameValue(hasOwnProperty, expected, msg);

  var hasProperty = Reflect.has(obj, name);
  assert.sameValue(hasProperty, expected, msg);
}

class C {
  * #m() { return 42; }


  get ref() { return this.#m; }

  constructor() {
    hasProp(this, '#m', false, 'private methods are defined in an special internal slot and cannot be found as own properties');
    assert.sameValue(typeof this.#m, 'function');
    assert.sameValue(this.ref, this.#m, 'returns the same value');
    assert.sameValue(this.#m, (() => this)().#m, 'memberexpression and call expression forms');

    var res = this.#m().next();
    assert.sameValue(res.value, 42, 'return from generator method, inside ctor');
    assert.sameValue(res.done, true, 'iterator is done, inside ctor');
    assert.sameValue(this.#m.name, '#m', 'function name inside constructor');

  }
}

var c = new C();
var other = new C();

hasProp(C.prototype, '#m', false, 'method is not defined in the prototype');
hasProp(C, '#m', false, 'method is not defined in the contructor');
hasProp(c, '#m', false, 'method cannot be seen outside of the class');

/***
 * MethodDefinition : ClassElementName ( UniqueFormalParameters ) { FunctionBody }
 * 
 * 1. Let methodDef be DefineMethod of MethodDefinition with argument homeObject.
 * ...
 */
assert.sameValue(c.ref, other.ref, 'The method is defined once, and reused on every new instance');

// gets the returned iterator from #m
var res = c.ref().next();
assert.sameValue(res.value, 42, 'return from generator method');
assert.sameValue(res.done, true, 'iterator is done');
assert.sameValue(c.ref.name, '#m', 'function name is preserved external reference');
