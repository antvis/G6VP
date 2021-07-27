import { extractDefault } from '@ali/react-datav-gui-utils';

const registerMeta = context => {
  const { data, keys } = context;
  const options = keys.map(c => {
    return {
      value: c,
      label: c,
    };
  });
  return {
    mappingKey: {
      name: '映射字段',
      type: 'select',
      useFont: true,
      default: 'type',
      options,
    },
    fill: {
      name: '颜色',
      type: 'fill',
      default: '#333',
    },
  };
};

const configObj = registerMeta({ data: {}, keys: ['id'] });
export const defaultProps = extractDefault({ config: configObj, value: {} });
export default registerMeta;
