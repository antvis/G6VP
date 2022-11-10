import { utils } from '@antv/gi-sdk';
import { Components } from '@antv/graphin';
import React from 'react';

const { getPositionStyles } = utils;

const { Legend } = Components;

export interface ComponentProps {
  sortKey: string;
  textColor: string;
  placement: string;
  offset: number[];
}

const Component: React.FunctionComponent<ComponentProps> = props => {
  const { sortKey, placement, offset } = props;
  const positionStyles = getPositionStyles(placement, offset);

  return (
    <div>
      <Legend bindType="node" sortKey={`data.${sortKey}`} style={positionStyles}>
        {renderProps => {
          return <Legend.Node {...renderProps} />;
        }}
      </Legend>
    </div>
  );
};

export default Component;
