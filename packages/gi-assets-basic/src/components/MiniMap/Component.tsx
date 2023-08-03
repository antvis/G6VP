import React from 'react';
import { Components } from '@antv/graphin';
import { utils } from '@antv/gi-sdk';

const { getPositionStyles } = utils;
const { MiniMap } = Components;

interface MiniMapProps {
  placement: string;
  offset: number[];
}

const MiniMapContainer: React.FC<MiniMapProps> = props => {
  const { placement, offset } = props;
  const positionStyles = getPositionStyles(placement, offset);

  return (
    <div className="gi-minimap" style={{ ...positionStyles, width: '177px', height: '120px' }}>
      <MiniMap />
    </div>
  );
};

export default MiniMapContainer;
