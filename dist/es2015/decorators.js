import { metadata } from 'aurelia-metadata';
import { All, Parent, Lazy, Optional, Factory } from 'aurelia-dependency-injection';

export function autoinject(potentialTarget, potentialKey) {
    let deco = function (target, key, descriptor) {
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

export function inject(...rest) {
    return function (target, key, descriptor) {
        if (key !== undefined) {
            if (descriptor.configurable) {
                const fn = descriptor.value;
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

export function all(type) {
    return function (target, key, desc) {
        inject(All.of(type))(target, key, desc ? desc : {});
    };
}

export function parent(type) {
    return function (target, key, desc) {
        if (type === undefined) {
            type = metadata.get('design:type', target, key);
        }
        inject(Parent.of(type))(target, key, desc ? desc : {});
    };
}

export function lazy(type) {
    return function (target, key, desc) {
        inject(Lazy.of(type))(target, key, desc ? desc : {});
    };
}

export function optional(type) {
    return function (target, key, desc) {
        if (type === undefined) {
            type = metadata.get('design:type', target, key);
        }
        inject(Optional.of(type))(target, key, desc ? desc : {});
    };
}

export function factory(type) {
    return function (target, key, desc) {
        inject(Factory.of(type))(target, key, desc ? desc : {});
    };
}