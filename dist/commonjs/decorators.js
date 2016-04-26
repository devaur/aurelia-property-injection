"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.autoinject = autoinject;
exports.inject = inject;

var _aureliaMetadata = require("aurelia-metadata");

function autoinject(potentialTarget, potentialKey) {
    var deco = function deco(target, key, descriptor) {
        if (key === undefined) {
            target.inject = _aureliaMetadata.metadata.getOwn(_aureliaMetadata.metadata.paramTypes, target, key) || Object.freeze([]);
        } else if (descriptor === undefined) {
            if (target.constructor.injectProperties === undefined) {
                target.constructor.injectProperties = Object.create(null);
            }
            target.constructor.injectProperties[key] = _aureliaMetadata.metadata.getOwn("design:type", target, key);
        }
    };
    return potentialTarget ? deco(potentialTarget, potentialKey) : deco;
}

function inject() {
    for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
        rest[_key] = arguments[_key];
    }

    return function (target, key, descriptor) {
        if (key !== undefined) {
            if (descriptor.configurable) {
                var fn = descriptor.value;
                fn.inject = rest;
            } else {
                if (target.constructor.injectProperties === undefined) {
                    target.constructor.injectProperties = Object.create(null);
                }
                target.constructor.injectProperties[key] = rest[0];
                descriptor.writable = true;
            }
        } else {
            target.inject = rest;
        }
    };
}