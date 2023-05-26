import * as components from '../../src';

describe('id check', () => {
  it('要求组件导出 id 与 info.id 一致', () => {
    Object.entries(components.components).forEach(([key, component]) => {
      expect(component.info.id).toEqual(key);
      return true;
    });
  });
});
