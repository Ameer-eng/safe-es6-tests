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
    There are no restrictions on the number of cycles during module traversal
    during indirect export resolution, given unique export names.
esid: sec-moduledeclarationinstantiation
info: |
    [...]
    12. For each ImportEntry Record in in module.[[ImportEntries]], do
        a. Let importedModule be ? HostResolveImportedModule(module,
           in.[[ModuleRequest]]).
        b. If in.[[ImportName]] is "*", then
           i. Let namespace be ? GetModuleNamespace(importedModule).
           ii. Perform ! envRec.CreateImmutableBinding(in.[[LocalName]], true).
           iii. Call envRec.InitializeBinding(in.[[LocalName]], namespace).
        [...]

    15.2.1.16.3 ResolveExport( exportName, resolveSet, exportStarSet )

    2. For each Record {[[Module]], [[ExportName]]} r in resolveSet, do:
       a. If module and r.[[Module]] are the same Module Record and
          SameValue(exportName, r.[[ExportName]]) is true, then
          i. Assert: this is a circular import request.
          ii. Return null.
    3. Append the Record {[[Module]]: module, [[ExportName]]: exportName} to resolveSet.
    [...]
    5. For each ExportEntry Record e in module.[[IndirectExportEntries]], do
       a. If SameValue(exportName, e.[[ExportName]]) is true, then
          i. Assert: module imports a specific binding for this export.
          ii. Let importedModule be ? HostResolveImportedModule(module,
              e.[[ModuleRequest]]).
          iii. Let indirectResolution be ?
               importedModule.ResolveExport(e.[[ImportName]], resolveSet,
               exportStarSet).
          iv. If indirectResolution is not null, return indirectResolution.
flags: [module]
---*/

import * as ns from './instn-star-iee-cycle-2_FIXTURE.js';
export { c as b } from './instn-star-iee-cycle-2_FIXTURE.js';
export { e as d } from './instn-star-iee-cycle-2_FIXTURE.js';
export { g as f } from './instn-star-iee-cycle-2_FIXTURE.js';
export { i as h } from './instn-star-iee-cycle-2_FIXTURE.js';
export { k as j } from './instn-star-iee-cycle-2_FIXTURE.js';
export { m as l } from './instn-star-iee-cycle-2_FIXTURE.js';
export { o as n } from './instn-star-iee-cycle-2_FIXTURE.js';
export { q as p } from './instn-star-iee-cycle-2_FIXTURE.js';
export { s as r } from './instn-star-iee-cycle-2_FIXTURE.js';
export { u as t } from './instn-star-iee-cycle-2_FIXTURE.js';
export { w as v } from './instn-star-iee-cycle-2_FIXTURE.js';
export { y as x } from './instn-star-iee-cycle-2_FIXTURE.js';
export var z = 23;

assert.sameValue(ns.a, 23);
