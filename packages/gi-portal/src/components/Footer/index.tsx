import * as React from 'react';
import './index.less';
interface FooterProps {}

const Footer: React.FunctionComponent<FooterProps> = props => {
  return (
    <div className="gi-footer">
      <div className="gi-footer-left">
        <a href="https://antv.vision/zh/" target="_blank">
          AntV 官网
        </a>
        <a href="https://antv.vision/zh/about" target="_blank">
          关于我们
        </a>
      </div>
      <div className="gi-footer-right">AntV ©2022 Created by GraphInsight Team</div>
    </div>
  );
};

export default Footer;
