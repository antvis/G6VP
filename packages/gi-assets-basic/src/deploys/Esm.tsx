import { Card } from 'antd';
import * as React from 'react';

interface EsmDeployProps {
  utils: {
    openNodeModule: () => void;
  };
}

const EsmDeploy: React.FunctionComponent<EsmDeployProps> = props => {
  const { utils } = props;
  return (
    <Card
      hoverable
      cover={<img src={`${window['GI_PUBLIC_PATH']}image/export_cdn.png`} onClick={utils.openNodeModule} />}
    >
      <div className="card-meta">
        <div className="title">ESM 模式</div>
        <div>提供 NPM 包，支持 Tree Shaking，原生集成到 React 项目中 </div>
      </div>
    </Card>
  );
};

export default {
  desc: 'ESM 模式',
  component: EsmDeploy,
};
