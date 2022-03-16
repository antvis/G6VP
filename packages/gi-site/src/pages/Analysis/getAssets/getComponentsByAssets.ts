import { extractDefault } from '@ali/react-datav-gui-utils';
import type { TypeAssetInfo } from './typing';
import { getKeysByData } from './utils';

var stringify = function (obj, prop) {
  var placeholder = '____PLACEHOLDER____';
  var fns = [];
  var json = JSON.stringify(
    obj,
    function (key, value) {
      if (typeof value === 'function') {
        fns.push(value);
        return placeholder;
      }
      return value;
    },
    2,
  );
  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function (_) {
    return fns.shift();
  });
  return 'this["' + prop + '"] = ' + json + ';';
};

/**
 *
 * @param assets 服务端拿到的资产: Components
 * @param data 图数据
 * @returns
 */
const getComponentsByAssets = (assets, data, services, config) => {
  let MOCK_SERVICES = [];
  let MOCK_SERVICES_CONFIG = [];
  const GI_CONTAINER_INDEXS = Object.values(assets)
    .filter((item: any) => {
      const info = ((item && item.info) || {}) as TypeAssetInfo;

      return (
        info.type === 'GI_CONTAINER_INDEX' || // 这个是兼容 旧的资产info
        info.type === 'GIAC_MENU' ||
        info.type === 'GIAC' ||
        info.type === 'GIAC_CONTENT'
      );
    })
    .map(item => {
      const { info } = item as any;
      return {
        label: info.name,
        value: info.id,
      };
    });

  const components = Object.keys(assets)
    .map(key => {
      const component = assets[key];
      if (!component) {
        return {
          id: 'NOT_FOUND',
          name: key,
        };
      }
      const {
        registerMeta = () => {
          return {};
        },
        Component,
        mockServices,
        info = {},
      } = component;
      const keys = getKeysByData(data, 'node');

      const configObj = registerMeta({ data, keys, services, config, GI_CONTAINER_INDEXS });
      /** 默认的配置值 */
      const defaultProps = extractDefault({ config: configObj, value: {} });
      const { id, name, category } = info;
      if (mockServices) {
        const sers = mockServices();
        MOCK_SERVICES = [...MOCK_SERVICES, ...sers];
        const sers_config = sers.map(c => {
          return {
            id: c.id,
            mode: 'MOCK',
            name: c.id,
            //@ts-ignore
            content: stringify(c.service),
          };
        });
        MOCK_SERVICES_CONFIG = [...MOCK_SERVICES_CONFIG, ...sers_config];
      }
      return {
        id,
        name,
        category,
        props: defaultProps,
        meta: {
          ...configObj,
        },
      };
    })
    .filter(c => {
      if (c.id === 'NOT_FOUND') {
        console.log('%c !!! 未找到资产包 !!! ', 'color:red', c.name);
      }
      return c.id !== 'NOT_FOUND';
    });

  return { components, mockServices: MOCK_SERVICES, mockServicesConfig: MOCK_SERVICES_CONFIG };
};
export default getComponentsByAssets;
