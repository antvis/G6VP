import * as React from 'react';
import GUI from '@ali/react-datav-gui';
import ComponentsConfig from './configation/components';
import LayoutConfig from './configation/layout';
import StyleConfig from './configation/style';
import './index.less';

const ConfigMap = {
  components: ComponentsConfig,
  layout: LayoutConfig,
  style: StyleConfig,
}

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
}


const GIMetaPanel = props => {
  const {value, onChange, data} = props;

  const config = typeof (ConfigMap[value]) !== undefined ? ConfigMap[value] : null;

  if (config) {
    return <GUI {...config} onChange={onChange}/>; 
  }
};

export default GIMetaPanel;
