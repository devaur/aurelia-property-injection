import { Container, InvocationHandler } from 'aurelia-dependency-injection';

/**
* Wraps the core `InvocationHandler` to inject into properties.
*/
export class InvocationHandlerWrapper extends InvocationHandler {

    /**
    * Invokes the function.
    * @param container The calling container.
    * @param dynamicDependencies Additional dependencies to use during invocation.
    * @return The result of the function invocation.
    */
    invoke(container: Container, dynamicDependencies?: any[]): any {
        return (<any>this.fn).injectProperties ?
                invoke(container, this.fn, this.dependencies, dynamicDependencies) :
                super.invoke(container, dynamicDependencies)
    }
}

function invoke (container, fn, staticDependencies, dynamicDependencies) {
  const injectProperties = fn.injectProperties;
  const injectProps = Object.create(null);
  for (let property in injectProperties) {
    injectProps[property] = {
      value: container.get(injectProperties[property])
    };
  }
  // inject properties as soon as object is created, before calling constructor
  let instance = Object.create(fn.prototype || null, injectProps);
  let i = staticDependencies.length;
  let args = new Array(i);

  while (i--) {
    args[i] = container.get(staticDependencies[i]);
  }

  if (dynamicDependencies) {
    args = args.concat(dynamicDependencies);
  }

  // call constructor
  fn.apply(instance, args);
  return instance;
}
