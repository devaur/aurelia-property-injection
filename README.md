# aurelia-inject-properties

This plugin enables the core Aurelia's DI Container to inject dependencies into class instance properties,
lifting the constructor from being the dependency bearer and decoupling child classes from parent dependencies.

The implementation follows the _Convention over configuration_ paradigm, assuming the presence of a static `injectProperties` enumeration of `property: Type` to satisfy dependencies. For example, having a class like this:

```javascript
import {Router} from 'aurelia-router';

export class MyClass {

  static injectProperties = {
    router: Router
  };

}
```
the container will produce an instance of `MyClass` with the current `Router` available in the `router` property.

It also provides extended implementations of the core `inject` and `autoinject` decorators, e.g.

```javascript
import {inject} from 'aurelia-inject-properties';
import {Router} from 'aurelia-router';

export class MyClass {

  @inject(Router)
  router;

}
```

and for TypeScript

```typescript
import {autoinject} from 'aurelia-inject-properties';

export class MyClass {

  @autoinject
  private router: Router;

}
```

Like in other languages DI implementations (e.g. Java CDI), injection into properties cannot make
the dependencies available inside the constructor, so this plugin will also instruct the Container
to invoke a conventional `afterConstructor` callback right after the injection occurs; i.e.

```javascript
import {inject} from 'aurelia-inject-properties';
import {Router} from 'aurelia-router';

export class MyClass {

  @inject(Router)
  router;

  constructor() {
      console.log(this.router); // => undefined
  }

  afterConstructor() {
      console.log(this.router); // => the current Router instance
  }

}
```

## Installing the plugin

Install the plugin via JSPM:

```shell
jspm install aurelia-inject-properties=github:heruan/inject-properties
```

## Enabling the plugin

To enable the plugin, simply `use` it in the Aurelia's main configuration of your application:

```javascript
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-inject-properties');

  aurelia.start().then(() => aurelia.setRoot());
}
```
