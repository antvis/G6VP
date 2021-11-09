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
    color: {
      name: '颜色',
      type: 'group',
      children: {
        value: {
          name: '颜色',
          type: 'fill',
          default: '#333',
        },
      },
    },
    label: {
      name: '标签',
      type: 'group',
      children: {
        key: {
          name: '映射字段',
          type: 'select',
          useFont: true,
          default: 'type',
          options,
        },
      },
    },
  };
};

const configObj = registerMeta({ data: {}, keys: ['id'] });
export const defaultProps = extractDefault({ config: configObj, value: {} });
export default registerMeta;
