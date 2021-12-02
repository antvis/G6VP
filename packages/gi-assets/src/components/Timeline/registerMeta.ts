import { deepClone, defaultMeta } from '../const';
export default () => {
  const newMeta = deepClone(defaultMeta);
  newMeta.GI_CONTAINER_ITEM.children.title.default = '时序分析';
  newMeta.GI_CONTAINER_ITEM.children.icon.default = 'icon-Field-time';
  return newMeta;
};
