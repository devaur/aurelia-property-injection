'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InvocationHandlerWrapper = undefined;
exports.autoinject = autoinject;
exports.inject = inject;
exports.all = all;
exports.parent = parent;
exports.lazy = lazy;
exports.optional = optional;
exports.factory = factory;

var _aureliaMetadata = require('aurelia-metadata');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InvocationHandlerWrapper = exports.InvocationHandlerWrapper = function (_InvocationHandler) {
    _inherits(InvocationHandlerWrapper, _InvocationHandler);

    function InvocationHandlerWrapper() {
        _classCallCheck(this, InvocationHandlerWrapper);

        return _possibleConstructorReturn(this, _InvocationHandler.apply(this, arguments));
    }

    InvocationHandlerWrapper.prototype.invoke = function invoke(container, dynamicDependencies) {
        var instance = _InvocationHandler.prototype.invoke.call(this, container, dynamicDependencies);
        return this.injectProperties(container, instance);
    };

    InvocationHandlerWrapper.prototype.injectProperties = function injectProperties(container, instance) {
        if ("injectProperties" in this.fn) {
            var dependencies = this.fn["injectProperties"];
            for (var property in dependencies) {
                instance[property] = container.get(dependencies[property]);
            }
            if ("afterConstructor" in instance) {
                instance.afterConstructor.call(instance);
            }
        }
        return instance;
    };

    return InvocationHandlerWrapper;
}(_aureliaDependencyInjection.InvocationHandler);

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