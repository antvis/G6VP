import { extra } from '@antv/gi-sdk';
import info from './info';
const { deepClone, GIAC_CONTENT_METAS } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);

metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.tooltip.default =
  info.desc;

const registerMeta = () => {
  const schema = {
    url: {
      title: 'Socket URL',
      type: 'string',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
      default: 'ws://localhost:9003',
    },
    ...metas,
  };
  return schema;
};

export default registerMeta;
