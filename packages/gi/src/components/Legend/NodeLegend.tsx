// import { Legend } from '@antv/graphin-components';
import * as React from 'react';
import Legend from './GraphinLegend/index';

interface LegendAProps {
  sortKey: string;
}

const NodeLegend: React.FunctionComponent<LegendAProps> = props => {
  const { sortKey } = props;

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

export default NodeLegend;
