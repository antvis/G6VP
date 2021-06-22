import GUI from '@ali/react-datav-gui';
import * as React from 'react';
import './index.less';
import layoutConfig from './layout/layout';

const { valueObj: defaultValueObj, configObj } = layoutConfig;

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

  return (
    <div>
      <GUI configObj={configObj} valueObj={valueObj} onChange={onChange} />
      {/* <h5>高级配置</h5> */}
    </div>
  );
};

export default LayoutPanel;
