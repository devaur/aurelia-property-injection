"use strict";

System.register(["aurelia-metadata"], function (_export, _context) {
    var metadata;
    return {
        setters: [function (_aureliaMetadata) {
            metadata = _aureliaMetadata.metadata;
        }],
        execute: function () {
            function autoinject(potentialTarget, potentialKey) {
                var deco = function deco(target, key, descriptor) {
                    if (key === undefined) {
                        target.inject = metadata.getOwn(metadata.paramTypes, target, key) || Object.freeze([]);
                    } else if (descriptor === undefined) {
                        if (target.constructor.injectProperties === undefined) {
                            target.constructor.injectProperties = Object.create(null);
                        }
                        target.constructor.injectProperties[key] = metadata.getOwn("design:type", target, key);
                    }
                };
                return potentialTarget ? deco(potentialTarget, potentialKey) : deco;
            }

            _export("autoinject", autoinject);

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

            _export("inject", inject);
        }
    };
});