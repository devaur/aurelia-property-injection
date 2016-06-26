import { InvocationHandler } from './invocation-handler';

export * from './decorators';

export function configure(frameworkConfiguration) {
    frameworkConfiguration.container.setHandlerCreatedCallback(handler =>
        (<any>handler.fn).injectProperties ?
          new InvocationHandler(handler.fn, handler.invoker, handler.dependencies) :
          handler
    );
}
