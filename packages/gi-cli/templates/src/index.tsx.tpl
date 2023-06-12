import * as components from './components';
import * as elements from './elements';
import services from './services';
import * as templates from './templates';

const beforeload = () => {
  return new Promise<void>(resolve => {
    console.log('Before {{{ name }}} load');
    resolve();
  });
};

const afterload = () => {
  return new Promise<void>(resolve => {
    console.log('After {{{ name }}} load');
    resolve();
  });
};

export { components, elements, services, templates, beforeload, afterload };
