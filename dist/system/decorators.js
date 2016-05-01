'use strict';

System.register(['aurelia-metadata', 'aurelia-dependency-injection'], function (_export, _context) {
    var metadata, All, Parent, Lazy, Optional, Factory;
    return {
        setters: [function (_aureliaMetadata) {
            metadata = _aureliaMetadata.metadata;
        }, function (_aureliaDependencyInjection) {
            All = _aureliaDependencyInjection.All;
            Parent = _aureliaDependencyInjection.Parent;
            Lazy = _aureliaDependencyInjection.Lazy;
            Optional = _aureliaDependencyInjection.Optional;
            Factory = _aureliaDependencyInjection.Factory;
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

            _export('autoinject', autoinject);

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

            _export('inject', inject);

            function all(type) {
                return function (target, key, desc) {
                    inject(All.of(type))(target, key, desc ? desc : {});
                };
            }

            _export('all', all);

            function parent(type) {
                return function (target, key, desc) {
                    if (type === undefined) {
                        type = metadata.get('design:type', target, key);
                    }
                    inject(Parent.of(type))(target, key, desc ? desc : {});
                };
            }

            _export('parent', parent);

            function lazy(type) {
                return function (target, key, desc) {
                    inject(Lazy.of(type))(target, key, desc ? desc : {});
                };
            }

            _export('lazy', lazy);

            function optional(type) {
                return function (target, key, desc) {
                    if (type === undefined) {
                        type = metadata.get('design:type', target, key);
                    }
                    inject(Optional.of(type))(target, key, desc ? desc : {});
                };
            }

            _export('optional', optional);

            function factory(type) {
                return function (target, key, desc) {
                    inject(Factory.of(type))(target, key, desc ? desc : {});
                };
            }

            _export('factory', factory);
        }
    };
});