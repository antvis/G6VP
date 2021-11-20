import { GraphinContext } from '@antv/graphin';
import { Button, Divider, Modal, Tooltip } from 'antd';
import * as React from 'react';
import { DownloadOutlined } from '@ant-design/icons';

export interface DownLoad {
  visible: boolean;
  color: string;
  hasDivider: boolean;
}

const DownLoad: React.FunctionComponent<DownLoad> = props => {
  const { color, hasDivider } = props;
  const { graph } = React.useContext(GraphinContext);

  return (
    <div>
      <Tooltip title="下载" color={color} key={color}>
        <Button type="text" icon={<DownloadOutlined />} onClick={() => graph.downloadImage()}></Button>
      </Tooltip>
      {hasDivider && <Divider type="vertical" />}
    </div>
  );
};

export default DownLoad;
