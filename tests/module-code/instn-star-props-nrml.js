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

import * as ns from './instn-star-props-nrml-1_FIXTURE.js';

// Export entries defined by a directly-imported module
assert('localVarDecl' in ns, 'localVarDecl');
assert('localLetDecl' in ns, 'localLetDecl');
assert('localConstDecl' in ns, 'localConstDecl');
assert('localFuncDecl' in ns, 'localFuncDecl');
assert('localGenDecl' in ns, 'localGenDecl');
assert('localClassDecl' in ns, 'localClassDecl');
assert('localBindingId' in ns, 'localBindingId');
assert('localIdName' in ns, 'localIdName');
assert('indirectIdName' in ns, 'indirectIdName');
assert('indirectIdName2' in ns, 'indirectIdName2');
assert('namespaceBinding' in ns, 'namespaceBinding');

// Export entries defined by a re-exported module
assert('starVarDecl' in ns, 'starVarDecl');
assert('starLetDecl' in ns, 'starLetDecl');
assert('starConstDecl' in ns, 'starConstDecl');
assert('starFuncDecl' in ns, 'starFuncDecl');
assert('starGenDecl' in ns, 'starGenDecl');
assert('starClassDecl' in ns, 'starClassDecl');
assert('starBindingId' in ns, 'starBindingId');
assert('starIdName' in ns, 'starIdName');
assert('starIndirectIdName' in ns, 'starIndirectIdName');
assert('starIndirectIdName2' in ns, 'starIndirectIdName2');
assert('starIndirectNamespaceBinding' in ns, 'starIndirectNamespaceBinding');

// Bindings that were not exported from any module
assert.sameValue('nonExportedVar1' in ns, false, 'nonExportedVar1');
assert.sameValue('nonExportedVar2' in ns, false, 'nonExportedVar2');
assert.sameValue('nonExportedLet1' in ns, false, 'nonExportedLet1');
assert.sameValue('nonExportedLet2' in ns, false, 'nonExportedLet2');
assert.sameValue('nonExportedConst1' in ns, false, 'nonExportedConst1');
assert.sameValue('nonExportedConst2' in ns, false, 'nonExportedConst2');
assert.sameValue('nonExportedFunc1' in ns, false, 'nonExportedFunc1');
assert.sameValue('nonExportedFunc2' in ns, false, 'nonExportedFunc2');
assert.sameValue('nonExportedGen1' in ns, false, 'nonExportedGen1');
assert.sameValue('nonExportedGen2' in ns, false, 'nonExportedGen2');
assert.sameValue('nonExportedClass1' in ns, false, 'nonExportedClass1');
assert.sameValue('nonExportedClass2' in ns, false, 'nonExportedClass2');
