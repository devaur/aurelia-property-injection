/// <reference path="../../typings/globals/jasmine/index.d.ts" />

import "aurelia-polyfills";
import { decorators } from 'aurelia-metadata';
import { Container, Lazy } from 'aurelia-dependency-injection';
import { configure, autoinject, inject, all, parent, optional, lazy, factory, newInstance } from '../../src/index';

function getContainer() {
    const config = {
      container: new Container()
    };
    configure(config);
    return config.container;
}

describe('property-injection', () => {

    it('uses static injectProperties', () => {
        class Logger {}

        class App {
          static injectProperties: any;
        }

        App.injectProperties = {
            logger: Logger
        };

        let container = getContainer();
        let app = container.get(App);

        expect(app).toEqual(jasmine.any(App));
        expect(app.logger).toEqual(jasmine.any(Logger));
    });

    describe('with custom decorator', () => {

        describe('@autoinject', () => {
            it('injects dependency in constructor', () => {
                class Logger {}

                @autoinject
                class App {
                  constructor (public logger: Logger) {}
                }

                let app = getContainer().get(App);

                expect(app.logger).toEqual(jasmine.any(Logger));
            });

            it('injects the required dependency', () => {
                class Logger {}

                class App {
                    @autoinject logger: Logger;
                }

                let app = getContainer().get(App);

                expect(app.logger).toEqual(jasmine.any(Logger));
            });
        });

        describe('@inject', () => {
            it('injects the required dependency', () => {
                class Logger {}

                class App {
                    @inject(Logger) logger;
                }

                let app = getContainer().get(App);

                expect(app.logger).toEqual(jasmine.any(Logger));
            });
        });

        describe('@lazy', () => {
            it('provides a function which, when called, will return the instance', () => {
                class Logger {}

                class App {
                    @lazy(Logger) getLogger;
                }

                let app = getContainer().get(App);

                expect(app.getLogger).toEqual(jasmine.any(Function));
                expect(app.getLogger()).toEqual(jasmine.any(Logger));
            });
        });

        describe('@all', () => {
            it('resolves all matching dependencies as an array of instances', () => {
                class Logger {}

                class VerboseLogger extends Logger {}

                class LaconicLogger extends Logger {}

                class App {
                    @all(Logger) loggers;
                }

                let container = getContainer();
                container.registerSingleton(Logger, VerboseLogger);
                container.registerTransient(Logger, LaconicLogger);
                let app = container.get(App);

                expect(app.loggers).toEqual(jasmine.any(Array));
                expect(app.loggers.length).toBe(2);
                expect(app.loggers[0]).toEqual(jasmine.any(VerboseLogger));
                expect(app.loggers[1]).toEqual(jasmine.any(LaconicLogger));
            });
        });

        describe('@optional', () => {
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
                class Logger {}

                class VerboseLogger {}

                class App {
                    @optional(Logger) logger;
                }

                let container = getContainer();
                container.registerSingleton(VerboseLogger, Logger);
                let app = container.get(App);

                expect(app.logger).toBe(null);
            });

            it('injects null if key nor function is registered in the container', () => {
                class Logger {}

                class VerboseLogger {}

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


        describe('@parent', () => {
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

        describe('@factory', () => {
            let data = 'test';

            class Service {
                data: any;

                constructor(data) {
                    this.data = data;
                }
            }

            class App {
                @factory(Service) GetService;

                service;

                constructor() {
                    this.service = new this.GetService(data);
                }
            }

            it('provides a function which, when called, will return the instance', () => {
                const app = getContainer().get(App);
                const service = app.GetService;
                expect(service()).toEqual(jasmine.any(Service));
            });

            it('passes data in to the constructor as the second argument', () => {
                const app = getContainer().get(App);
                expect(app.service.data).toEqual(data);
            });
        });

        describe('@newInstance', () => {
            it('provides a new instance of the dependency', () => {
                class Logger {}

                class App {
                    @newInstance(Logger) fooLogger;
                    @newInstance(Logger) barLogger;
                }

                let app = getContainer().get(App);

                expect(app.fooLogger).toEqual(jasmine.any(Logger));
                expect(app.barLogger).toEqual(jasmine.any(Logger));
                expect(app.fooLogger).not.toBe(app.barLogger);
            });
        });

    });
});
