import React from 'react';
import GUI from '@ali/react-datav-gui';
import { extractDefault } from '@ali/react-datav-gui-utils';
import ColorMapping from '@ali/datav-gui-color-scale';
import SizeMapping from '@ali/datav-gui-size-scale';

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

  const freeExtensions = {
    sizeMapping: SizeMapping,
    colorMapping: ColorMapping,
  };
  const valueObj = extractDefault({ config });
  const props = { configObj: config, valueObj, freeExtensions };

  return <GUI {...props} onChange={onChange} />;
};

export default ComponentMetaPanel;
