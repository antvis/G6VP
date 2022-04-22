import React, { useState } from 'react';
import { Switch } from 'antd';
interface IPanelHeaderProps {
  pathId: number;
  highlightPath: Set<number>;
  onSwitchChange: (pathId: number) => void;
}
const PanelHeader: React.FC<IPanelHeaderProps> = props => {
  const { pathId, onSwitchChange, highlightPath } = props;
  const checked = highlightPath.has(pathId);
  const preventBuddle = e => {
    e.stopPropagation();
  };
  return (
    <div onClick={preventBuddle}>
      <span>路径{pathId + 1}</span>
      <Switch checked={checked} onChange={checked => onSwitchChange(pathId)} />
    </div>
  );
};

export default PanelHeader;
