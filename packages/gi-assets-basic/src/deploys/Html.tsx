import { Card } from 'antd';
import * as React from 'react';
import $i18n from '../i18n';

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
        <div className="title">{$i18n.get({ id: 'basic.src.deploys.Html.HtmlMode', dm: 'HTML 模式' })}</div>
        <div>
          {$i18n.get({ id: 'basic.src.deploys.Html.ExportHtmlForQuickLocal', dm: '导出 HTML 适合快速本地查看' })}
        </div>
      </div>
    </Card>
  );
};

export default {
  desc: $i18n.get({ id: 'basic.src.deploys.Html.HtmlMode', dm: 'HTML 模式' }),
  component: HtmlDeploy,
};
