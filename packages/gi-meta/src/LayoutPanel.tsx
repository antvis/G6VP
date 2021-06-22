import GUI from '@ali/react-datav-gui';
import * as React from 'react';
import './index.less';
import layoutConfig from './layout/layout';

const { valueObj: defaultValueObj, configObj } = layoutConfig;
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
const LayoutPanel = props => {
  const { value, onChange, data, config, meta } = props;
  const { layout } = config;
  const { type, options } = layout.props;

  const layoutTypeName = `${type}Group`;
  const valueObj = {
    layout: {
      ...defaultValueObj.layout,
      toggle: type,
      [layoutTypeName]: {
        ...options,
      },
    },
  };
  console.log('layoutConfig', layoutConfig, defaultValueObj, valueObj);

  return (
    <div>
      <GUI configObj={configObj} valueObj={valueObj} onChange={onChange} />
      {/* <h5>高级配置</h5> */}
    </div>
  );
};

export default LayoutPanel;
