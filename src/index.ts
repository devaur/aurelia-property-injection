import { InvocationHandlerWrapper } from './invocation-handler-wrapper';

export function configure(frameworkConfiguration) {
    frameworkConfiguration.container.setHandlerCreatedCallback(handler =>
        new InvocationHandlerWrapper(handler.fn, handler.invoker, handler.dependencies)
    );
}

export * from "./decorators";
