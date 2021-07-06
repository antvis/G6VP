import * as React from 'react';
import ComponentPanel from './ComponentPanel';
import './index.less';
import LayoutPanel from './LayoutPanel';
import StyleConfig from './style/style';
import StylePanel from './StylePanel';

const ConfigMap = {
  style: StyleConfig,
};

const Empty = () => {
  return <div>Empty</div>;
};
interface Option {
  /** 配置的内容 */
  content: React.ReactElement | JSX.Element | JSX.Element[];
  /** 配置的ID */
  id: string;
  /** 配置的名称 */
  name: string;
}
interface ConfigationPanelProps {
  value: Option['id'];
  onChange: Function;
  data: Object;
  config: Object;
}

const GIMetaPanel = props => {
  const { value, onChange, data, config, meta } = props;

  const { components, layout, node, edge } = config;

  if (Object.keys(config).length === 0) {
    return null;
  }

  if (value === 'components') {
    return <ComponentPanel {...props} />;
  }
  if (value === 'layout') {
    return <LayoutPanel {...props} />;
  }
  return <StylePanel {...props} />;
};

export default React.memo(GIMetaPanel, (prevProps, nextProps) => {
  if (prevProps.value !== nextProps.value) {
    return false;
  }
  return true;
  // return false;
});
