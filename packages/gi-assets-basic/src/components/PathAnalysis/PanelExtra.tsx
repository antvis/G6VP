import React, { useState } from 'react';
import { Switch } from 'antd';
interface IPanelHeaderProps {
  pathId: number;
  highlightPath: Set<number>;
  onSwitchChange: (pathId: number) => void;
}
const PanelExtra: React.FC<IPanelHeaderProps> = props => {
  const { pathId, onSwitchChange, highlightPath } = props;
  const checked = highlightPath.has(pathId);
  const preventBuddle = e => {
    e.stopPropagation();
  };
  return (
    <div onClick={preventBuddle}>
      <Switch checked={checked} onChange={checked => onSwitchChange(pathId)} />
    </div>
  );
};

export default PanelExtra;
