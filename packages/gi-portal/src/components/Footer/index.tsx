import * as React from 'react';
import './index.less';
import $i18n from '../../i18n';
interface FooterProps {}

const Footer: React.FunctionComponent<FooterProps> = props => {
  return (
    <div className="gi-footer">
      <div className="gi-footer-left">
        <a href="https://antv.vision/zh/" target="_blank">
          {$i18n.get({ id: 'gi-portal.components.Footer.AntvOfficialWebsite', dm: 'AntV 官网' })}
        </a>
        <a href="https://antv.vision/zh/about" target="_blank">
          {$i18n.get({ id: 'gi-portal.components.Footer.AboutUs', dm: '关于我们' })}
        </a>
      </div>
      <div className="gi-footer-right">AntV ©2022 Created by GraphInsight Team</div>
    </div>
  );
};

export default Footer;
