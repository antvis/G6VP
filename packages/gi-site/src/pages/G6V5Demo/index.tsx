import * as React from 'react';
import './index.less';
interface AssetsCenterProps {}

const G6V5Demo: React.FunctionComponent<AssetsCenterProps> = props => {
  return (
    <iframe
      src="https://g6-site-pre.alipay.com/g6v5" // TODO: 待上线后换成线上地址
      title={'G6v5 DEMO'}
      frameBorder={0}
      width="100%"
      style={{
        height: `calc(100vh - 100px)`,
      }}
    />
  );
};

export default G6V5Demo;
