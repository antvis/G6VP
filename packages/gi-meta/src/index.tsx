import * as React from 'react';
import GUI from '@ali/react-datav-gui';
import ComponentsConfig from './configation/components';
import LayoutConfig from './configation/layout';
import StyleConfig from './configation/style';
import configation from './configation';
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
  config: Object;
}


const GIMetaPanel = props => {
  const {value, onChange, data, config} = props;

  const configObj = configation(value, data, config);

  console.log('GIMetaPanel', configObj);

  if (config) {
    return <GUI {...configObj} onChange={onChange}/>; 
  }
};

export default GIMetaPanel;
