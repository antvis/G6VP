import { GraphinContext } from '@antv/graphin';
import { Button, Divider, Modal, Tooltip } from 'antd';
import * as React from 'react';
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';

export interface Zoom {
  visible: boolean;
  color: string;
  hasDivider: boolean;
}

const Zoom: React.FunctionComponent<Zoom> = props => {
  const { color, hasDivider } = props;
  const { apis, graph } = React.useContext(GraphinContext);
  const { handleZoomIn, handleZoomOut } = apis;

  return (
    <div>
      <Tooltip title="放大" color={color} key={color}>
        <Button type="text" icon={<ZoomInOutlined />} onClick={handleZoomOut}></Button>
      </Tooltip>
      {hasDivider && <Divider type="vertical" />}
      <Tooltip title="缩小" color={color} key={color}>
        <Button type="text" icon={<ZoomOutOutlined />} onClick={handleZoomIn}></Button>
      </Tooltip>
      {hasDivider && <Divider type="vertical" />}
    </div>
  );
};

export default Zoom;
