import fs from 'fs';
import { GIAC_CONTENT_METAS, GIAC_METAS, GI_CONTAINER_METAS } from './const.bak.mjs';
const formatConfig2Formily = configObj => {
  return Object.keys(configObj).reduce((config, key) => {
    const { children, name, default: defaultValue, type, ...componentProps } = configObj[key];
    config[key] =
      type === 'group'
        ? {
            type: 'void',
            'x-decorator': 'FormItem',
            'x-component': 'FormCollapse',
            properties: {
              [key]: {
                type: 'object',
                'x-component': 'FormCollapse.CollapsePanel',
                'x-component-props': {
                  header: name,
                },
                properties: formatConfig2Formily(children),
              },
            },
          }
        : {
            title: name,
            type: 'string',
            'x-component': `${type[0].toUpperCase()}${type.slice(1)}`,
            'x-component-props': componentProps,
            default: defaultValue,
          };
    return config;
  }, {});
};

fs.writeFileSync('./TRANS_JSON/GIAC_METAS.json', JSON.stringify(formatConfig2Formily(GIAC_METAS), null, 2));
fs.writeFileSync(
  './TRANS_JSON/GIAC_CONTENT_METAS.json',
  JSON.stringify(formatConfig2Formily(GIAC_CONTENT_METAS), null, 2),
);
fs.writeFileSync(
  './TRANS_JSON/GI_CONTAINER_METAS.json',
  JSON.stringify(formatConfig2Formily(GI_CONTAINER_METAS), null, 2),
);
