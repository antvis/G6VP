import { Card } from 'antd';
import * as React from 'react';
import $i18n from '../i18n';

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
        <div className="title">{$i18n.get({ id: 'basic.src.deploys.Umd.UmdMode', dm: 'UMD 模式' })}</div>
        <div>
          {$i18n.get({
            id: 'basic.src.deploys.Umd.ProvidesUmdPackagesThatCan',
            dm: '提供 UMD 包，可 CDN 加载，快速集成到 React 项目中',
          })}
        </div>
      </div>
    </Card>
  );
};

export default {
  desc: $i18n.get({ id: 'basic.src.deploys.Umd.UmdMode', dm: 'UMD 模式' }),
  component: UmdDeploy,
};
