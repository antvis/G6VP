import GUI from '@ali/react-datav-gui';
import * as React from 'react';
import './index.less';

/** 根据用户的组件Meta信息，得到默认的defaultvalue值 */
const getDefaultValues = meta => {
  const { children } = meta;
  const keys = Object.keys(children);
  const values = {};
  keys.forEach(key => {
    const { default: defaultValue } = children[key];
    values[key] = defaultValue;
  });
  return values;
};

/** 组件模块 配置面板 */
const ComponentPanel = props => {
  const { value, onChange, data, config, meta } = props;
  const { components } = config;
  const valueObj = {
    components: {
      analysis: {},
      interaction: {},
    },
  };

  let keys = ['id'];
  try {
    keys = Object.keys(data.nodes[0].data);
  } catch (error) {}

  const analysis = {
    name: '分析组件',
    mode: 'single',
    children: {},
  };

  const interaction = {
    name: '交互组件',
    mode: 'single',
    children: {},
  };

  components.forEach(element => {
    const { id, props } = element;
    const defaultFunction = params => {
      return {
        categoryId: 'components-analysis',
        id: id,
        type: 'group', //这个可以不写
        fold: false, // 这个可以不写
        name: id,
        children: {},
      };
    };
    const metaFunction = meta[id] || defaultFunction;
    const componentMeta = metaFunction({ data, keys });

    componentMeta.children['giEnable'] = {
      name: '是否加载',
      type: 'switch',
      default: true,
      statusText: true,
    };
    /** 获取自定义组件meta信息里的defaultvalue */
    const defaultValues = getDefaultValues(componentMeta);

    const { categoryId } = componentMeta;
    /** 分析组件 */
    if (categoryId === 'components-analysis') {
      analysis.children = {
        ...analysis.children,
        [id]: componentMeta,
      };
      valueObj.components.analysis = {
        ...valueObj.components.analysis,
        [id]: {
          ...defaultValues,
          ...props,
        },
      };
    }
    /** 交互组件 */
    if (categoryId === 'components-interaction') {
      interaction.children = {
        ...interaction.children,
        [id]: componentMeta,
      };
      valueObj.components.interaction = {
        ...valueObj.components.interaction,
        [id]: {
          ...defaultValues,
          ...props,
        },
      };
    }
  });

  /** 手动构建ConfigObject信息 */
  const configObj = {
    components: {
      type: 'menu',
      name: 'components',
      children: {
        analysis,
        interaction,
      },
    },
  };
  console.log('%c  **** components', 'color:red', configObj.components, valueObj);

  return (
    <div>
      <GUI configObj={configObj} valueObj={valueObj} onChange={onChange} />
      {/* <h5>高级配置</h5> */}
    </div>
  );
};

export default ComponentPanel;
