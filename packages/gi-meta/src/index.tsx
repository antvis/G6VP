import GUI from '@ali/react-datav-gui';
import * as React from 'react';
import ComponentsConfig from './components/componentPanel';
import configation from './configation';
import './index.less';
import LayoutConfig from './layout/layout';
import StyleConfig from './style/style';

const ConfigMap = {
  components: ComponentsConfig,
  layout: LayoutConfig,
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
  const configObj = configation(value, data, config, meta);

  console.log('GIMetaPanel', configObj, meta);

  if (config) {
    return <GUI {...configObj} onChange={onChange} />;
  }
};

export default GIMetaPanel;
