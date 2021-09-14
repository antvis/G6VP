import { Legend } from '@antv/graphin-components';
import React from 'react';

export interface ComponentProps {
  sortKey: string;
  textColor: string;
}

const Component: React.FunctionComponent<ComponentProps> = props => {
  const { sortKey, textColor } = props;

  return (
    <div>
      <Legend
        bindType="node"
        sortKey={`data.${sortKey}`}
        colorKey="style.keyshape.stroke" // 如果是GraphinNode，则可以硬编码写死
        style={{ position: 'absolute', left: '10px', top: '10px' }}
      >
        <Legend.Node />
      </Legend>
    </div>
  );
};

export default Component;
