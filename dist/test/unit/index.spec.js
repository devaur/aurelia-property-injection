"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
require("aurelia-polyfills");
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var index_1 = require("../../main/index");
var invocation_handler_1 = require("../../main/invocation-handler");
function getContainer(config) {
    var container = new aurelia_dependency_injection_1.Container();
    index_1.configure({ container: container }, config);
    return container;
}
describe('property-injection', function () {
    it('uses static injectProperties', function () {
        var Logger = (function () {
            function Logger() {
            }
            return Logger;
        }());
        var App = (function () {
            function App() {
            }
            return App;
        }());
        App.injectProperties = {
            logger: Logger
        };
        spyOn(invocation_handler_1.PropertyInvocationHandler.prototype, 'invoke').and.callThrough();
        var container = getContainer();
        var app = container.get(App);
        expect(invocation_handler_1.PropertyInvocationHandler.prototype.invoke).toHaveBeenCalledWith(container, undefined);
        expect(app).toEqual(jasmine.any(App));
        expect(app.logger).toEqual(jasmine.any(Logger));
    });
    it('calls afterConstructor hook', function () {
        var Logger = (function () {
            function Logger() {
            }
            return Logger;
        }());
        var App = (function () {
            function App() {
            }
            App.prototype.afterConstructor = function () {
                this.logger.check = true;
            };
            return App;
        }());
        App.injectProperties = {
            logger: Logger
        };
        var app = getContainer().get(App);
        expect(app.logger.check).toBe(true);
    });
    describe('configure', function () {
        it('returns original handler if no injectProperties', function () {
            spyOn(invocation_handler_1.PropertyInvocationHandler.prototype, 'invoke');
            var App = (function () {
                function App() {
                }
                return App;
            }());
            var app = getContainer().get(App);
            expect(invocation_handler_1.PropertyInvocationHandler.prototype.invoke).not.toHaveBeenCalled();
            expect(app).toEqual(jasmine.any(App));
        });
        it('uses constructor invocation handler if required', function () {
            spyOn(invocation_handler_1.PropertyInvocationHandler.prototype, 'invoke');
            spyOn(invocation_handler_1.PropertyConstructorInvocationHandler.prototype, 'invoke').and.callThrough();
            var Logger = (function () {
                function Logger() {
                }
                return Logger;
            }());
            var App = (function () {
                function App() {
                }
                return App;
            }());
            App.injectProperties = {
                logger: Logger
            };
            var container = getContainer({
                injectConstructor: true
            });
            var app = container.get(App);
            expect(invocation_handler_1.PropertyInvocationHandler.prototype.invoke).not.toHaveBeenCalled();
            expect(invocation_handler_1.PropertyConstructorInvocationHandler.prototype.invoke).toHaveBeenCalledWith(container, undefined);
            expect(app).toEqual(jasmine.any(App));
            expect(app.logger).toEqual(jasmine.any(Logger));
        });
    });
    describe('with custom decorator', function () {
        describe('@autoinject', function () {
            it('injects dependency in constructor', function () {
                var Logger = (function () {
                    function Logger() {
                    }
                    return Logger;
                }());
                var App = (function () {
                    function App(logger) {
                        this.logger = logger;
                    }
                    return App;
                }());
                __decorate([
                    index_1.autoinject,
                    __metadata("design:type", Logger)
                ], App.prototype, "logger2", void 0);
                App = __decorate([
                    index_1.autoinject,
                    __metadata("design:paramtypes", [Logger])
                ], App);
                var app = getContainer({
                    injectConstructor: true
                }).get(App);
                expect(app.logger).toEqual(jasmine.any(Logger));
                expect(app.logger).toBe(app.logger2);
            });
            it('injects the required dependency', function () {
                var Logger = (function () {
                    function Logger() {
                    }
                    return Logger;
                }());
                var App = (function () {
                    function App() {
                    }
                    return App;
                }());
                __decorate([
                    index_1.autoinject,
                    __metadata("design:type", Logger)
                ], App.prototype, "logger", void 0);
                var app = getContainer().get(App);
                expect(app.logger).toEqual(jasmine.any(Logger));
            });
        });
        describe('@inject', function () {
            it('injects the required dependency', function () {
                var Logger = (function () {
                    function Logger() {
                    }
                    return Logger;
                }());
                var App = (function () {
                    function App() {
                    }
                    return App;
                }());
                __decorate([
                    index_1.inject(Logger),
                    __metadata("design:type", Object)
                ], App.prototype, "logger", void 0);
                var app = getContainer().get(App);
                expect(app.logger).toEqual(jasmine.any(Logger));
            });
        });
        describe('@lazy', function () {
            it('provides a function which, when called, will return the instance', function () {
                var Logger = (function () {
                    function Logger() {
                    }
                    return Logger;
                }());
                var App = (function () {
                    function App() {
                    }
                    return App;
                }());
                __decorate([
                    index_1.lazy(Logger),
                    __metadata("design:type", Object)
                ], App.prototype, "getLogger", void 0);
                var app = getContainer().get(App);
                expect(app.getLogger).toEqual(jasmine.any(Function));
                expect(app.getLogger()).toEqual(jasmine.any(Logger));
            });
        });
        describe('@all', function () {
            it('resolves all matching dependencies as an array of instances', function () {
                var Logger = (function () {
                    function Logger() {
                    }
                    return Logger;
                }());
                var VerboseLogger = (function (_super) {
                    __extends(VerboseLogger, _super);
                    function VerboseLogger() {
                        return _super.apply(this, arguments) || this;
                    }
                    return VerboseLogger;
                }(Logger));
                var LaconicLogger = (function (_super) {
                    __extends(LaconicLogger, _super);
                    function LaconicLogger() {
                        return _super.apply(this, arguments) || this;
                    }
                    return LaconicLogger;
                }(Logger));
                var App = (function () {
                    function App() {
                    }
                    return App;
                }());
                __decorate([
                    index_1.all(Logger),
                    __metadata("design:type", Object)
                ], App.prototype, "loggers", void 0);
                var container = getContainer();
                container.registerSingleton(Logger, VerboseLogger);
                container.registerTransient(Logger, LaconicLogger);
                var app = container.get(App);
                expect(app.loggers).toEqual([
                    jasmine.any(VerboseLogger),
                    jasmine.any(LaconicLogger)
                ]);
            });
        });
        describe('@optional', function () {
            it('injects the instance if its registered in the container', function () {
                var Logger = (function () {
                    function Logger() {
                    }
                    return Logger;
                }());
                var App = (function () {
                    function App() {
                    }
                    return App;
                }());
                __decorate([
                    index_1.optional(Logger),
                    __metadata("design:type", Object)
                ], App.prototype, "logger", void 0);
                var container = getContainer();
                container.registerSingleton(Logger, Logger);
                var app = container.get(App);
                expect(app.logger).toEqual(jasmine.any(Logger));
            });
            it('injects null if key is not registered in the container', function () {
                var Logger = (function () {
                    function Logger() {
                    }
                    return Logger;
                }());
                var VerboseLogger = (function () {
                    function VerboseLogger() {
                    }
                    return VerboseLogger;
                }());
                var App = (function () {
                    function App() {
                    }
                    return App;
                }());
                __decorate([
                    index_1.optional(Logger),
                    __metadata("design:type", Object)
                ], App.prototype, "logger", void 0);
                var container = getContainer();
                container.registerSingleton(VerboseLogger, Logger);
                var app = container.get(App);
                expect(app.logger).toBe(null);
            });
            it('injects null if key nor function is registered in the container', function () {
                var Logger = (function () {
                    function Logger() {
                    }
                    return Logger;
                }());
                var VerboseLogger = (function () {
                    function VerboseLogger() {
                    }
                    return VerboseLogger;
                }());
                var App = (function () {
                    function App() {
                    }
                    return App;
                }());
                __decorate([
                    index_1.optional(Logger),
                    __metadata("design:type", Object)
                ], App.prototype, "logger", void 0);
                var container = getContainer();
                var app = container.get(App);
                expect(app.logger).toBe(null);
            });
        });
        describe('@parent', function () {
            it('bypasses the current container and injects instance from parent container', function () {
                var Logger = (function () {
                    function Logger() {
                    }
                    return Logger;
                }());
                var App = (function () {
                    function App() {
                    }
                    return App;
                }());
                __decorate([
                    index_1.parent(Logger),
                    __metadata("design:type", Object)
                ], App.prototype, "logger", void 0);
                var parentContainer = getContainer();
                var parentInstance = new Logger();
                parentContainer.registerInstance(Logger, parentInstance);
                var childContainer = parentContainer.createChild();
                var childInstance = new Logger();
                childContainer.registerInstance(Logger, childInstance);
                childContainer.registerSingleton(App, App);
                var app = childContainer.get(App);
                expect(childContainer.get(Logger)).toBe(childInstance);
                expect(app.logger).toBe(parentInstance);
            });
            it('returns null when no parent container exists', function () {
                var Logger = (function () {
                    function Logger() {
                    }
                    return Logger;
                }());
                var App = (function () {
                    function App() {
                    }
                    return App;
                }());
                __decorate([
                    index_1.parent(Logger),
                    __metadata("design:type", Object)
                ], App.prototype, "logger", void 0);
                var container = getContainer();
                var instance = new Logger();
                container.registerInstance(Logger, instance);
                var app = container.get(App);
                expect(app.logger).toBeNull();
            });
        });
        describe('@factory', function () {
            var data = 'test';
            var Service = (function () {
                function Service(data) {
                    this.data = data;
                }
                return Service;
            }());
            var App = (function () {
                function App() {
                }
                App.prototype.afterConstructor = function () {
                    this.service = new this.GetService(data);
                };
                return App;
            }());
            App.injectProperties = {};
            __decorate([
                index_1.factory(Service),
                __metadata("design:type", Object)
            ], App.prototype, "GetService", void 0);
            it('provides a function which, when called, will return the instance', function () {
                var app = getContainer().get(App);
                var service = app.GetService;
                expect(service()).toEqual(jasmine.any(Service));
            });
            it('passes data in to the constructor as the second argument', function () {
                var app = getContainer().get(App);
                expect(app.service.data).toBe(data);
            });
        });
        describe('@newInstance', function () {
            it('provides a new instance of the dependency', function () {
                var Logger = (function () {
                    function Logger() {
                    }
                    return Logger;
                }());
                var App = (function () {
                    function App() {
                    }
                    return App;
                }());
                __decorate([
                    index_1.newInstance(Logger),
                    __metadata("design:type", Object)
                ], App.prototype, "fooLogger", void 0);
                __decorate([
                    index_1.newInstance(Logger),
                    __metadata("design:type", Object)
                ], App.prototype, "barLogger", void 0);
                var app = getContainer().get(App);
                expect(app.fooLogger).toEqual(jasmine.any(Logger));
                expect(app.barLogger).toEqual(jasmine.any(Logger));
                expect(app.fooLogger).not.toBe(app.barLogger);
            });
            it('provides a new instance of the dependency with dynamics dependencies', function () {
                var Logger = (function () {
                    function Logger(dep) {
                        this.dep = dep;
                    }
                    return Logger;
                }());
                var Dependency = (function () {
                    function Dependency() {
                    }
                    return Dependency;
                }());
                var App = (function () {
                    function App() {
                    }
                    return App;
                }());
                __decorate([
                    index_1.newInstance(Logger, Dependency),
                    __metadata("design:type", Object)
                ], App.prototype, "fooLogger", void 0);
                __decorate([
                    index_1.newInstance(Logger, aurelia_dependency_injection_1.Lazy.of(Dependency)),
                    __metadata("design:type", Object)
                ], App.prototype, "barLogger", void 0);
                var app = getContainer().get(App);
                expect(app.fooLogger.dep).toEqual(jasmine.any(Dependency));
                expect(app.barLogger.dep()).toEqual(jasmine.any(Dependency));
            });
        });
    });
});

//# sourceMappingURL=index.spec.js.map
