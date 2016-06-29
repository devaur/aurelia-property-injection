/// <reference path="../../typings/globals/jasmine/index.d.ts" />

import "aurelia-polyfills";
import { Container } from 'aurelia-dependency-injection';
import { configure, autoinject, inject, all, parent, optional, lazy, factory, newInstance } from '../../src/index';
import { PropertyInvocationHandler, PropertyConstructorInvocationHandler } from '../../src/invocation-handler';

function getContainer(config?: any) {
    const container = new Container()
    configure({container}, config);
    return container;
}

describe('property-injection', () => {

    it('uses static injectProperties', () => {
        class Logger {}

        class App {
            static injectProperties = {
                logger: Logger
            };
        }

        spyOn(PropertyInvocationHandler.prototype, 'invoke').and.callThrough();

        const container = getContainer();
        const app = container.get(App);

        expect(PropertyInvocationHandler.prototype.invoke).toHaveBeenCalledWith(container, undefined);
        expect(app).toEqual(jasmine.any(App));
        expect(app.logger).toEqual(jasmine.any(Logger));
    });

    it('calls afterConstructor hook', () => {
        class Logger {
            check;
        }

        class App {
            static injectProperties = {
                logger: Logger
            };

            logger: Logger;

            afterConstructor() {
                this.logger.check = true;
            }
        }

        let app = getContainer().get(App);

        expect(app.logger.check).toBe(true);
    });

    describe('configure', () => {
        it('returns original handler if no injectProperties', () => {
          spyOn(PropertyInvocationHandler.prototype, 'invoke');

          class App {}

          const app = getContainer().get(App);

          expect(PropertyInvocationHandler.prototype.invoke).not.toHaveBeenCalled();
          expect(app).toEqual(jasmine.any(App));
        });

        it('uses constructor invocation handler if required', () => {
          spyOn(PropertyInvocationHandler.prototype, 'invoke');
          spyOn(PropertyConstructorInvocationHandler.prototype, 'invoke').and.callThrough();

          class Logger {}

          class App {
            static injectProperties = {
                logger: Logger
            }
          }

          const container = getContainer({
            injectConstructor: true
          });
          const app = container.get(App);

          expect(PropertyInvocationHandler.prototype.invoke).not.toHaveBeenCalled();
          expect(PropertyConstructorInvocationHandler.prototype.invoke).toHaveBeenCalledWith(container, undefined);
          expect(app).toEqual(jasmine.any(App));
          expect(app.logger).toEqual(jasmine.any(Logger));
        });

    });

    describe('with custom decorator', () => {

        describe('@autoinject', () => {
            it('injects dependency in constructor', () => {
                class Logger {}

                @autoinject
                class App {
                  @autoinject logger2: Logger;
                  constructor (public logger: Logger) {}
                }

                let app = getContainer({
                    injectConstructor: true
                }).get(App);

                expect(app.logger).toEqual(jasmine.any(Logger));
                expect(app.logger).toBe(app.logger2);
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

                expect(app.loggers).toEqual([
                    jasmine.any(VerboseLogger),
                    jasmine.any(LaconicLogger)
                ]);
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

                const app = childContainer.get(App);

                expect(childContainer.get(Logger)).toBe(childInstance);
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

                expect(app.logger).toBeNull();
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
                static injectProperties = {};

                @factory(Service) GetService;

                service: Service;

                afterConstructor() {
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
                expect(app.service.data).toBe(data);
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
