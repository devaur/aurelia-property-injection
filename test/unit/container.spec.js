import '../setup';
import {Container} from 'aurelia-dependency-injection';
import {InvocationHandlerWrapper} from '../../src/invocation-handler-wrapper';

describe('container', () => {
  describe('inject-properties', function() {
    class Logger {
      check = false;
    }

    it('uses static injectProperties', function() {
      class App {}

      App.injectProperties = {
        logger: Logger
      };

      let container = new Container();
      container.setHandlerCreatedCallback((handler) => {
          return new InvocationHandlerWrapper(handler.fn, handler.invoker, handler.dependencies);
      });
      let app = container.get(App);
      expect(app.logger).toEqual(jasmine.any(Logger));
    });

    it('calls afterConstructor hook', function() {
      class App {
        afterConstructor() {
          this.logger.check = true;
        }
      }

      App.injectProperties = {
        logger: Logger
      };

      let container = new Container();
      container.setHandlerCreatedCallback((handler) => {
          return new InvocationHandlerWrapper(handler.fn, handler.invoker, handler.dependencies);
      });
      let app = container.get(App);
      expect(app.logger.check).toBe(true);
    });
  });
});
