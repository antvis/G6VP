import { DeleteOutlined } from '@ant-design/icons';
import { GraphinContext } from '@antv/graphin';
import { Button, Divider, Tooltip } from 'antd';
import * as React from 'react';

export interface ClearCanvasProps {
  visible: boolean;
  color: string;
  hasDivider: boolean;
}

const ClearCanvas: React.FunctionComponent<ClearCanvasProps> = props => {
  const { color, hasDivider } = props;
  const { graph } = React.useContext(GraphinContext);

  return (
    <div>
      <Tooltip title="清空画布" color={color} key={color}>
        <Button type="text" icon={<DeleteOutlined />} onClick={() => graph.clear()}></Button>
      </Tooltip>
      {hasDivider && <Divider type="vertical" />}
    </div>
  );
};

export default ClearCanvas;
