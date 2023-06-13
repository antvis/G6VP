import { Card } from 'antd';
import * as React from 'react';

interface HtmlDeployProps {
  utils: {
    openHtml: () => void;
  };
}

const HtmlDeploy: React.FunctionComponent<HtmlDeployProps> = props => {
  const { utils } = props;
  return (
    <Card hoverable cover={<img src={`${window['GI_PUBLIC_PATH']}image/export_html.png`} onClick={utils.openHtml} />}>
      <div className="card-meta">
        <div className="title">HTML 模式</div>
        <div>导出 HTML 适合快速本地查看</div>
      </div>
    </Card>
  );
};

export default {
  desc: 'HTML 模式',
  component: HtmlDeploy,
};
