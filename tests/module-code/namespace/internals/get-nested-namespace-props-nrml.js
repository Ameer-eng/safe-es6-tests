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
};// Copyright (C) 2016 the V8 project authors. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
description: >
    Module namespace object reports properties for all ExportEntries of all
    dependencies.
esid: sec-moduledeclarationinstantiation
info: |
  [...]
  12. For each ImportEntry Record in in module.[[ImportEntries]], do
      a. Let importedModule be ? HostResolveImportedModule(module,
         in.[[ModuleRequest]]).
      b. If in.[[ImportName]] is "*", then
         i. Let namespace be ? GetModuleNamespace(importedModule).
  [...]

  Runtime Semantics: GetModuleNamespace
    3. If namespace is undefined, then
       a. Let exportedNames be ? module.GetExportedNames(« »).
       b. Let unambiguousNames be a new empty List.
       c. For each name that is an element of exportedNames,
          i. Let resolution be ? module.ResolveExport(name, « », « »).
          ii. If resolution is null, throw a SyntaxError exception.
          iii. If resolution is not "ambiguous", append name to
               unambiguousNames.
       d. Let namespace be ModuleNamespaceCreate(module, unambiguousNames).
flags: [module]
features: [export-star-as-namespace-from-module]
---*/

import * as ns from './get-nested-namespace-props-nrml-1_FIXTURE.js';

// Export entries defined by a re-exported as exportns module
assert('starAsVarDecl' in ns.exportns, 'starssVarDecl');
assert('starAsLetDecl' in ns.exportns, 'starSsLetDecl');
assert('starAsConstDecl' in ns.exportns, 'starSsConstDecl');
assert('starAsFuncDecl' in ns.exportns, 'starAsFuncDecl');
assert('starAsGenDecl' in ns.exportns, 'starAsGenDecl');
assert('starAsClassDecl' in ns.exportns, 'starAsClassDecl');
assert('starAsBindingId' in ns.exportns, 'starAsBindingId');
assert('starIdName' in ns.exportns, 'starIdName');
assert('starAsIndirectIdName' in ns.exportns, 'starAsIndirectIdName');
assert('starAsIndirectIdName2' in ns.exportns, 'starAsIndirectIdName2');
assert('namespaceBinding' in ns.exportns, 'namespaceBinding');

// Bindings that were not exported from any module
assert.sameValue('nonExportedVar' in ns.exportns, false, 'nonExportedVar');
assert.sameValue('nonExportedLet' in ns.exportns, false, 'nonExportedLet');
assert.sameValue('nonExportedConst' in ns.exportns, false, 'nonExportedConst');
assert.sameValue('nonExportedFunc' in ns.exportns, false, 'nonExportedFunc');
assert.sameValue('nonExportedGen' in ns.exportns, false, 'nonExportedGen');
assert.sameValue('nonExportedClass' in ns.exportns, false, 'nonExportedClass');
