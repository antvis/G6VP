import React from 'react';
import './index.less';
interface BannerProps {
  roleId: string;
  role: any;
}
const getDevice = () => {
  let flag = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return flag;
};

const Banner: React.FunctionComponent<any> = props => {
  const { id, slogan, cover, desc } = props;
  const isMobile = getDevice();

  return (
    <div
      className="gi-banner"
      // style={{
      //   flexDirection: id === 'developer' ? 'row-reverse' : 'row',
      // }}
    >
      <div className="title">
        <h1>
          GraphInsight <span style={{ fontSize: '2rem', fontWeight: 300 }}>{slogan}</span>
        </h1>
        <h3>{desc}</h3>
        {isMobile ? (
          <a className="button disabled" style={{ width: '100%' }}>
            请访问 PC 端，进入工作台
          </a>
        ) : (
          <a href="/#/workspace" className="button">
            进入工作台
          </a>
        )}
      </div>
      <img src={cover} alt="" className="image" />
    </div>
  );
};

export default Banner;
