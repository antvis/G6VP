import GUI from '@ali/react-datav-gui';
import * as React from 'react';
import layoutConfig from './config';

const { valueObj: defaultValueObj, configObj } = layoutConfig;

/** 组件模块 配置面板 */
const LayoutPanel = props => {
  const { value, onChange, data, config, meta, dispatch } = props;
  const { layout } = config;
  const { type, options } = layout.props;

  const valueObj = {
    layout: {
      ...defaultValueObj.layout,
      toggle: type,
      [type]: {
        ...options,
      },
    },
  };

  const handleChange = e => {
    const { rootValue } = e;
    const { components, layout, style } = rootValue;

    /** 布局设置 */
    const { toggle } = layout;
    const layoutType = `${toggle}`;
    const layoutOptions = layout[layoutType];
    dispatch({
      type: 'update:config:layout',
      id: 'Layout',
      name: '官方内置布局',
      props: {
        type: toggle,
        options: layoutOptions,
      },
    });
  };

  return (
    <div>
      <GUI configObj={configObj} valueObj={valueObj} onChange={handleChange} />
    </div>
  );
};

export default LayoutPanel;
