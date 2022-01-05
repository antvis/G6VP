import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { GraphinContext } from '@antv/graphin';
import { Button, Divider, Tooltip } from 'antd';
import * as React from 'react';
export interface View {
  visible: boolean;
  color: string;
  hasDivider: boolean;
}

const View: React.FunctionComponent<View> = props => {
  const { color, hasDivider } = props;
  const { graph } = React.useContext(GraphinContext);

  return (
    <div>
      <Tooltip title="自适应" color={color} key={color}>
        <Button type="text" icon={<FullscreenOutlined />} onClick={() => graph.fitView()}></Button>
      </Tooltip>
      {hasDivider && <Divider type="vertical" />}
      <Tooltip title="居中" color={color} key={color}>
        <Button type="text" icon={<FullscreenExitOutlined />} onClick={() => graph.fitCenter()}></Button>
      </Tooltip>
      {hasDivider && <Divider type="vertical" />}
    </div>
  );
};

export default View;
