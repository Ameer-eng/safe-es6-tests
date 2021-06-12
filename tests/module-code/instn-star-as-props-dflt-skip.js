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
};// Copyright (C) 2018 Valerie Young. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
description: >
  Default exports are included in an imported module namespace object when module exported with `* as namespace`
esid: sec-moduledeclarationinstantiation
info: |
  [...]
  4. Let result be InnerModuleInstantiation(module, stack, 0).
  [...]

  InnerModuleInstantiation( module, stack, index )
  [...]
  10. Perform ? ModuleDeclarationEnvironmentSetup(module).
  [...]

  ModuleDeclarationEnvironmentSetup( module )
  [...]
    c. If in.[[ImportName]] is "*", then
    [...]
    d. Else,
      i. Let resolution be ? importedModule.ResolveExport(in.[[ImportName]], « »).
      ii. If resolution is null or "ambiguous", throw a SyntaxError exception.
      iii. If resolution.[[BindingName]] is "*namespace*", then
        1. Let namespace be ? GetModuleNamespace(resolution.[[Module]]).
    [...]

  15.2.1.18 Runtime Semantics: GetModuleNamespace

  [...]
  3. If namespace is undefined, then
  a. Let exportedNames be ? module.GetExportedNames(« »).
  [...]

  15.2.1.16.2 GetExportedNames

  [...]
  7. For each ExportEntry Record e in module.[[StarExportEntries]], do
  [...]
  c. For each element n of starNames, do
  i. If SameValue(n, "default") is false, then
  [...]
flags: [module]
features: [export-star-as-namespace-from-module]
 ---*/

import {named} from './instn-star-props-dflt-skip-star-as-named_FIXTURE.js';
import {production} from './instn-star-props-dflt-skip-star-as-prod_FIXTURE.js';

assert('namedOther' in named);
assert.sameValue(
  'default' in named, true, 'default specified via identifier'
);

assert('productionOther' in production);
assert.sameValue(
  'default' in production, true, 'default specified via dedicated production'
);
