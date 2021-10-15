import GUI from '@ali/react-datav-gui';
import React, { useState } from 'react';
import ComponentMarket from '../ComponentMarket';
import Group from '../../../../components/DataVGui/Group';

const extensions = {
  group: Group,
  test: Group,
};

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

const getComponentsByMap = componentMap => {
  const componentKeys = Object.keys(componentMap);
  return componentKeys.map(id => {
    const props = componentMap[id];
    const { giEnable } = props;
    return {
      id,
      props,
      enable: giEnable,
    };
  });
};

/** 组件模块 配置面板 */
const ComponentPanel = props => {
  const { value, onChange, data, config, meta, services, dispatch, components } = props;

  const { components: choosedComponents } = config;

  const [state, setState] = useState({
    isModalVisible: false,
  });

  /** 手动构建ConfigObject信息 */
  const configObj = {};
  const valueObj = {};

  choosedComponents.forEach(element => {
    const { id, props, enable } = element;
    const defaultFunction = params => {
      return {
        categoryId: 'components',
        id: id,
        type: 'group', //这个可以不写
        fold: false, // 这个可以不写
        name: id,
        children: {},
      };
    };
    const defaultComponent = components.find(c => c.id === id);
    if (!defaultComponent) {
      return;
    }
    const { meta: defaultConfigObj, props: defaultProps, name: defaultName } = defaultComponent;

    valueObj[id] = {
      ...defaultProps,
      ...props,
      giEnable: enable,
    };

    configObj[id] = {
      name: defaultName,
      type: 'test',
      fold: false,
      children: {
        ...defaultConfigObj,
        giEnable: {
          name: '是否加载',
          type: 'switch',
          default: true,
          statusText: true,
        },
      },
    };
  });

  const handleChange = e => {
    const { rootValue } = e;
    const com = getComponentsByMap(rootValue);

    dispatch({
      type: 'update:config:components',
      components: com,
    });
  };

  return (
    <div>
      <ComponentMarket components={components} dispatch={dispatch} config={config} />
      <GUI configObj={configObj} valueObj={valueObj} onChange={handleChange} extensions={extensions} />
    </div>
  );
};

export default ComponentPanel;
