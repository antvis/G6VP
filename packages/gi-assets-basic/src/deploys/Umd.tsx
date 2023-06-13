import { Card } from 'antd';
import * as React from 'react';

interface UmdDeployProps {
  utils: {
    openCSB: () => void;
  };
}

const UmdDeploy: React.FunctionComponent<UmdDeployProps> = props => {
  const { utils } = props;
  return (
    <Card hoverable cover={<img src={`${window['GI_PUBLIC_PATH']}image/export_cdn.png`} onClick={utils.openCSB} />}>
      <div className="card-meta">
        <div className="title">UMD 模式</div>
        <div>提供 UMD 包，可 CDN 加载，快速集成到 React 项目中</div>
      </div>
    </Card>
  );
};

export default {
  desc: 'UMD 模式',
  component: UmdDeploy,
};
