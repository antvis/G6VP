import { extractDefault } from '@ali/react-datav-gui-utils';

const componentPanel = ({ name, children, data, meta }) => {
  let childConfig = {};
  let keys = ['id'];
  try {
    keys = Object.keys(data.nodes[0].data);
  } catch (error) {}

  children.forEach(element => {
    const finalMeta = meta[element.id]({ data, keys });
    console.log('finalMeta', element, finalMeta);

    finalMeta.children['enable'] = {
      name: '是否加载',
      type: 'switch',
      default: true,
      statusText: true,
    };
    childConfig[element.id] = finalMeta;
  });

  const analysis = {
    name: '分析组件',
    mode: 'single',
    children: { ...childConfig },
  };

  const interaction = {
    name: '交互组件',
    mode: 'single',
    children: {},
  };

  const configObj = {};
  configObj['components'] = {
    type: 'menu',
    name: 'components',
    children: {
      analysis,
      interaction,
    },
  };

  const valueObj = extractDefault({ config: configObj });
  const props = { configObj, valueObj };

  return props;
};

export default componentPanel;
