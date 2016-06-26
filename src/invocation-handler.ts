import { Container, InvocationHandler as BaseInvocationHandler } from 'aurelia-dependency-injection';

/**
* Invocation handler to inject properties.
*/
export class InvocationHandler extends BaseInvocationHandler {

  /**
  * Invokes the function.
  * @param container The calling container.
  * @param dynamicDependencies Additional dependencies to use during invocation.
  * @return The result of the function invocation.
  */
  invoke(container: Container, dynamicDependencies?: any[]): any {
    const injectProperties = (<any>this.fn).injectProperties;
    const injectProps = Object.create(null);
    for (let property in injectProperties) {
      injectProps[property] = {
        value: container.get(injectProperties[property])
      };
    }
    // inject properties as soon as object is created, before calling constructor
    const instance = Object.create(this.fn.prototype || null, injectProps);
    let i = this.dependencies.length;
    let args = new Array(i);

    while (i--) {
      args[i] = container.get(this.dependencies[i]);
    }

    if (dynamicDependencies) {
      args = args.concat(dynamicDependencies);
    }

    // call constructor
    this.fn.apply(instance, args);
    return instance;
  }
}
