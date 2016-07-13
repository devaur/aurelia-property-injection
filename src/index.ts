import { PropertyInvocationHandler, PropertyConstructorInvocationHandler } from './invocation-handler';

export * from './decorators';

export function configure(frameworkConfiguration, config) {
    const Handler = config && config.injectConstructor ? PropertyConstructorInvocationHandler : PropertyInvocationHandler;
    frameworkConfiguration.container.setHandlerCreatedCallback(handler => {
        return handler.fn.injectProperties ? new Handler(handler.fn, handler.invoker, handler.dependencies) : handler;
    });
}
