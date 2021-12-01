import { GraphinContext } from '@antv/graphin';
import * as React from 'react';

export interface Zoom {
  visible: boolean;
  color: string;
  hasDivider: boolean;
}

const Zoom: React.FunctionComponent<Zoom> = props => {
  const { color, hasDivider } = props;
  const { apis, graph } = React.useContext(GraphinContext);
  const { handleZoomIn, handleZoomOut } = apis;
  React.useEffect(() => {
    handleZoomOut();
  }, [handleZoomOut]);
  // return (
  //   <div>
  //     <Tooltip title="放大" color={color} key={color}>
  //       <Button type="text" icon={<ZoomInOutlined />} onClick={handleZoomOut}></Button>
  //     </Tooltip>
  //     {hasDivider && <Divider type="vertical" />}
  //     <Tooltip title="缩小" color={color} key={color}>
  //       <Button type="text" icon={<ZoomOutOutlined />} onClick={handleZoomIn}></Button>
  //     </Tooltip>
  //     {hasDivider && <Divider type="vertical" />}
  //   </div>
  // );
  return null;
};

export default Zoom;
