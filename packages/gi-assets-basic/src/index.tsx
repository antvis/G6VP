import * as components from './components';
import * as elements from './elements';
import * as layouts from './layouts';
import services from './services';
import * as templates from './templates';

const beforeload = () => {
  return new Promise<void>(resolve => {
    console.log('Before gi-assets-basic load');
    resolve();
  });
};

const afterload = () => {
  return new Promise<void>(resolve => {
    console.log('After gi-assets-basic load');
    resolve();
  });
};

export { components, elements, layouts, services, templates, beforeload, afterload };
