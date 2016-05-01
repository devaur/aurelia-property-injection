import '../setup';
import { decorators } from 'aurelia-metadata';
import { Container, Lazy } from 'aurelia-dependency-injection';
import { InvocationHandlerWrapper } from '../../src/invocation-handler-wrapper';
import { inject, all, parent, optional, lazy, factory } from '../../src/decorators';

function getContainer() {
    let container = new Container();
    container.setHandlerCreatedCallback((handler) => {
        return new InvocationHandlerWrapper(handler.fn, handler.invoker, handler.dependencies);
    });
    return container;
}

describe('container', () => {
    describe('inject-properties', () => {
        class Logger {
            check = false;
        }

        it('uses static injectProperties', () => {
            class App {}

            App.injectProperties = {
                logger: Logger
            };

            let container = getContainer();
            let app = container.get(App);
            expect(app.logger).toEqual(jasmine.any(Logger));
        });

        it('calls afterConstructor hook', () => {
            class App {
                afterConstructor() {
                    this.logger.check = true;
                }
            }

            App.injectProperties = {
                logger: Logger
            };

            let app = getContainer().get(App);
            expect(app.logger.check).toBe(true);
        });

        describe('Custom resolvers', () => {

            describe('Lazy', () => {
                it('provides a function which, when called, will return the instance', () => {
                    class Logger {
                        check = false;
                    }
                    class App {
                        @lazy(Logger) getLogger;
                    }

                    let app = getContainer().get(App);

                    expect(app.getLogger).toEqual(jasmine.any(Function));
                    expect(app.getLogger()).toEqual(jasmine.any(Logger));
                });
            });

            describe('All', () => {
                it('resolves all matching dependencies as an array of instances', () => {
                    class LoggerBase {}

                    class VerboseLogger extends LoggerBase {}

                    class Logger extends LoggerBase {}

                    class App {
                        @all(LoggerBase) loggers;
                    }

                    let container = getContainer();
                    container.registerSingleton(LoggerBase, VerboseLogger);
                    container.registerTransient(LoggerBase, Logger);
                    let app = container.get(App);

                    expect(app.loggers).toEqual(jasmine.any(Array));
                    expect(app.loggers.length).toBe(2);
                    expect(app.loggers[0]).toEqual(jasmine.any(VerboseLogger));
                    expect(app.loggers[1]).toEqual(jasmine.any(Logger));
                });
            });

            describe('Optional', () => {
                it('injects the instance if its registered in the container', () => {
                    class Logger {}

                    class App {
                        @optional(Logger) logger;
                    }

                    let container = getContainer()
                    container.registerSingleton(Logger, Logger);
                    let app = container.get(App);

                    expect(app.logger).toEqual(jasmine.any(Logger));
                });

                it('injects null if key is not registered in the container', () => {
                    class VerboseLogger {}
                    class Logger {}

                    class App {
                        @optional(Logger) logger;
                    }

                    let container = getContainer();
                    container.registerSingleton(VerboseLogger, Logger);
                    let app = container.get(App);

                    expect(app.logger).toBe(null);
                });

                it('injects null if key nor function is registered in the container', () => {
                    class VerboseLogger {}
                    class Logger {}

                    class App {
                        @optional(Logger) logger;
                    }

                    let container = getContainer();
                    let app = container.get(App);

                    expect(app.logger).toBe(null);
                });

                it('doesn\'t check the parent container hierarchy', () => {
                    class Logger {}

                    class App {
                        @optional(Logger) logger;
                    }

                    let parentContainer = getContainer();
                    parentContainer.registerSingleton(Logger, Logger);

                    let childContainer = parentContainer.createChild();
                    childContainer.registerSingleton(App, App);

                    let app = childContainer.get(App);

                    expect(app.logger).toBe(null);
                });

            });


            describe('Parent', () => {
                it('bypasses the current container and injects instance from parent container', () => {
                    class Logger {}

                    class App {
                        @parent(Logger) logger;
                    }

                    let parentContainer = getContainer();
                    let parentInstance = new Logger();
                    parentContainer.registerInstance(Logger, parentInstance);

                    let childContainer = parentContainer.createChild();
                    let childInstance = new Logger();
                    childContainer.registerInstance(Logger, childInstance);
                    childContainer.registerSingleton(App, App);

                    let app = childContainer.get(App);

                    expect(app.logger).toBe(parentInstance);
                });

                it('returns null when no parent container exists', () => {
                    class Logger {}

                    class App {
                        @parent(Logger) logger;
                    }

                    let container = getContainer();
                    let instance = new Logger();
                    container.registerInstance(Logger, instance);

                    let app = container.get(App);

                    expect(app.logger).toBe(null);
                });
            });

            describe('Factory', () => {
                let container;
                let app;
                let logger;
                let service;
                let data = 'test';

                class Logger {}

                class Service {
                    @factory(Logger) getLogger;
                    constructor(data) {
                        this.data = data;
                    }
                }

                class App {
                    @factory(Service) GetService;
                    afterConstructor() {
                        this.service = new this.GetService(data);
                    }
                }

                beforeEach(() => {
                    container = getContainer();
                });

                it('provides a function which, when called, will return the instance', () => {
                    app = container.get(App);
                    service = app.GetService;
                    expect(service()).toEqual(jasmine.any(Service));
                });

                it('passes data in to the constructor as the second argument', () => {
                    app = container.get(App);
                    expect(app.service.data).toEqual(data);
                });
            });

        });
    });
});
