define(['exports', 'aurelia-metadata', 'aurelia-dependency-injection'], function (exports, _aureliaMetadata, _aureliaDependencyInjection) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.autoinject = autoinject;
    exports.inject = inject;
    exports.all = all;
    exports.parent = parent;
    exports.lazy = lazy;
    exports.optional = optional;
    exports.factory = factory;
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

    function all(type) {
        return function (target, key, desc) {
            inject(_aureliaDependencyInjection.All.of(type))(target, key, desc ? desc : {});
        };
    }

    function parent(type) {
        return function (target, key, desc) {
            if (type === undefined) {
                type = _aureliaMetadata.metadata.get('design:type', target, key);
            }
            inject(_aureliaDependencyInjection.Parent.of(type))(target, key, desc ? desc : {});
        };
    }

    function lazy(type) {
        return function (target, key, desc) {
            inject(_aureliaDependencyInjection.Lazy.of(type))(target, key, desc ? desc : {});
        };
    }

    function optional(type) {
        return function (target, key, desc) {
            if (type === undefined) {
                type = _aureliaMetadata.metadata.get('design:type', target, key);
            }
            inject(_aureliaDependencyInjection.Optional.of(type))(target, key, desc ? desc : {});
        };
    }

    function factory(type) {
        return function (target, key, desc) {
            inject(_aureliaDependencyInjection.Factory.of(type))(target, key, desc ? desc : {});
        };
    }
});