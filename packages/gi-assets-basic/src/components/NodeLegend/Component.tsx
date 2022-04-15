import { useContext } from '@alipay/graphinsight';
import { Legend } from '@antv/graphin-components';
import React from 'react';
import { getPositionStyles } from '../WrapContainer';

export interface ComponentProps {
  sortKey: string;
  textColor: string;
  placement: string;
  offset: number[];
}

const Component: React.FunctionComponent<ComponentProps> = props => {
  const { sortKey, textColor, placement, offset } = props;
  const positionStyles = getPositionStyles(placement, offset);
  const context = useContext();

  return (
    <div>
      <Legend
        bindType="node"
        sortKey={`data.${sortKey}`}
        colorKey="style.keyshape.stroke" // 如果是GraphinNode，则可以硬编码写死
        style={positionStyles}
      >
        <Legend.Node />
      </Legend>
    </div>
  );
};

export default Component;
