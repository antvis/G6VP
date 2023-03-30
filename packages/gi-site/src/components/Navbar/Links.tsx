import * as React from 'react';
import { Link } from 'react-router-dom';
interface LinksProps {
  active: string;
}

const Links: React.FunctionComponent<LinksProps> = props => {
  const { active } = props;
  return (
    <>
      <div style={{ margin: '0px 36px', cursor: 'pointer' }} className={active === 'home' ? 'active' : ''}>
        <Link to="/home">首页</Link>
      </div>
      <div style={{ marginRight: '36px', cursor: 'pointer' }} className={active === 'dataset' ? 'active' : ''}>
        <Link to="/dataset/list">数据集</Link>
      </div>
      <div style={{ marginRight: '36px', cursor: 'pointer' }} className={active === 'workbook' ? 'active' : ''}>
        <Link to="/workbook/project">工作薄</Link>
      </div>
      <div style={{ marginRight: '36px', cursor: 'pointer' }} className={active === 'open' ? 'active' : ''}>
        <Link to="/open/assets-manage">开放市场</Link>
      </div>
    </>
  );
};

export default Links;
