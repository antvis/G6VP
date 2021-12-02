import { deepClone, defaultMeta } from '../const';
export default () => {
  const newMeta = deepClone(defaultMeta);
  newMeta.GIAC_CONTENT.children.title.default = '时序分析';
  newMeta.GIAC_CONTENT.children.icon.default = 'icon-Field-time';
  return newMeta;
};
