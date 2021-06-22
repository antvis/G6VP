import React from 'react';
import GUI from '@ali/react-datav-gui';
import { extractDefault } from '@ali/react-datav-gui-utils';

const Empty = () => {
  return <div>暂无可配置的信息</div>;
};

interface ComponentMetaPanelProps {
  onChange: Function;
  config: Object;
  data?: Object;
}

const ComponentMetaPanel: React.FC<ComponentMetaPanelProps> = ({ config, onChange }) => {
  if (!config) {
    return <Empty />;
  }
  debugger;
  const valueObj = extractDefault({ config });
  const props = { configObj: config, valueObj };

  return <GUI {...props} onChange={onChange} />;
};

export default ComponentMetaPanel;
