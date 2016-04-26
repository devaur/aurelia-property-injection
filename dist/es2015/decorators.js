import { metadata } from 'aurelia-metadata';

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