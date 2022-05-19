import React from 'react';

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
};

export default ComponentMetaPanel;
