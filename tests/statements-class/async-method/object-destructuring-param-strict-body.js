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
// - src/function-forms/object-destructuring-param-strict-body.case
// - src/function-forms/syntax/cls-decl-async-meth.template
/*---
description: ObjectBindingPattern and Use Strict Directive are not allowed to coexist for the same function. (class declaration async method)
esid: sec-class-definitions-runtime-semantics-evaluation
features: [rest-parameters]
flags: [generated]
negative:
  phase: parse
  type: SyntaxError
info: |
    ClassDeclaration : class BindingIdentifier ClassTail

    1. Let className be StringValue of BindingIdentifier.
    2. Let value be the result of ClassDefinitionEvaluation of ClassTail with
       argument className.
    [...]

    14.5.14 Runtime Semantics: ClassDefinitionEvaluation

    21. For each ClassElement m in order from methods
        a. If IsStatic of m is false, then
           i. Let status be the result of performing
              PropertyDefinitionEvaluation for m with arguments proto and
              false.
        [...]

    Runtime Semantics: PropertyDefinitionEvaluation

    AsyncMethod : async PropertyName ( UniqueFormalParameters ) { AsyncFunctionBody }

    1. Let propKey be the result of evaluating PropertyName.
    2. ReturnIfAbrupt(propKey).
    3. If the function code for this AsyncMethod is strict mode code, let strict be true. Otherwise
       let strict be false.
    4. Let scope be the LexicalEnvironment of the running execution context.
    5. Let closure be ! AsyncFunctionCreate(Method, UniqueFormalParameters, AsyncFunctionBody,
       scope, strict).
    [...]


    13.3.3.4 Static Semantics: IsSimpleParameterList

    BindingElement : BindingPattern

    1. Return false.

    14.1.2 Static Semantics: Early Errors

    FunctionDeclaration : function BindingIdentifier ( FormalParameters ) { FunctionBody }
    FunctionDeclaration : function ( FormalParameters ) { FunctionBody }
    FunctionExpression : function BindingIdentifier ( FormalParameters ) { FunctionBody }

    - It is a Syntax Error if ContainsUseStrict of FunctionBody is true and
      IsSimpleParameterList of FormalParameters is false.

    14.2.1 Static Semantics: Early Errors

    ArrowFunction : ArrowParameters => ConciseBody

    - It is a Syntax Error if ContainsUseStrict of ConciseBody is true and
      IsSimpleParameterList of ArrowParameters is false.

    14.3.1 Static Semantics: Early Errors

    MethodDefinition : PropertyName ( UniqueFormalParameters ) { FunctionBody }

    - It is a Syntax Error if ContainsUseStrict of FunctionBody is true and
      IsSimpleParameterList of UniqueFormalParameters is false.

    MethodDefinition : set PropertyName ( PropertySetParameterList ) { FunctionBody }

    - It is a Syntax Error if ContainsUseStrict of FunctionBody is true and
      IsSimpleParameterList of PropertySetParameterList is false.

    14.4.1 Static Semantics: Early Errors

    GeneratorMethod : * PropertyName ( UniqueFormalParameters ) { GeneratorBody }

    - It is a Syntax Error if ContainsUseStrict of GeneratorBody is true and
      IsSimpleParameterList of UniqueFormalParameters is false.

    GeneratorDeclaration : function * BindingIdentifier ( FormalParameters ) { GeneratorBody }
    GeneratorDeclaration : function * ( FormalParameters ) { GeneratorBody }
    GeneratorExpression : function * BindingIdentifier ( FormalParameters ) { GeneratorBody }

    - It is a Syntax Error if ContainsUseStrict of GeneratorBody is true and
      IsSimpleParameterList of UniqueFormalParameters is false.

    14.5.1 Static Semantics: Early Errors

    AsyncGeneratorMethod : async * PropertyName ( UniqueFormalParameters ) { AsyncGeneratorBody }

    - It is a Syntax Error if ContainsUseStrict of AsyncGeneratorBody is true and
      IsSimpleParameterList of UniqueFormalParameters is false.

    AsyncGeneratorDeclaration : async function * BindingIdentifier ( FormalParameters ) { AsyncGeneratorBody }
    AsyncGeneratorDeclaration : async function * ( FormalParameters ) { AsyncGeneratorBody }
    AsyncGeneratorExpression : async function * BindingIdentifier ( FormalParameters ) { AsyncGeneratorBody }

    - It is a Syntax Error if ContainsUseStrict of AsyncGeneratorBody is true and
      IsSimpleParameterList of FormalParameters is false.

    14.7.1 Static Semantics: Early Errors

    AsyncMethod : async PropertyName ( UniqueFormalParameters ) { AsyncFunctionBody }

    - It is a Syntax Error if ContainsUseStrict of AsyncFunctionBody is true and
      IsSimpleParameterList of UniqueFormalParameters is false.

    AsyncFunctionDeclaration : async function BindingIdentifier ( FormalParameters ) { AsyncFunctionBody }
    AsyncFunctionDeclaration : async function ( FormalParameters ) { AsyncFunctionBody }
    AsyncFunctionExpression : async function ( FormalParameters ) { AsyncFunctionBody }
    AsyncFunctionExpression : async function BindingIdentifier ( FormalParameters ) { AsyncFunctionBody }

    - It is a Syntax Error if ContainsUseStrict of AsyncFunctionBody is true and
      IsSimpleParameterList of FormalParameters is false.

    14.8.1 Static Semantics: Early Errors

    AsyncArrowFunction : CoverCallExpressionAndAsyncArrowHead => AsyncConciseBody

    - It is a Syntax Error if ContainsUseStrict of AsyncConciseBody is true and
      IsSimpleParameterList of CoverCallExpressionAndAsyncArrowHead is false.

---*/
$DONOTEVALUATE();


class C {
  async method({property}) {
    "use strict";
  }
}
