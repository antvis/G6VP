import * as React from 'react';
import { Link } from 'react-router-dom';
import $i18n from '../../i18n';
interface LinksProps {
  active: string;
}

const Links: React.FunctionComponent<LinksProps> = props => {
  const { active } = props;
  console.log('i18n', $i18n.language);
  return (
    <>
      <div style={{ margin: '0px 36px', cursor: 'pointer' }} className={active === 'home' ? 'active' : ''}>
        <Link to="/home">{$i18n.get({ id: 'gi-site.components.Navbar.Links.HomePage', dm: '首页' })}</Link>
      </div>
      <div style={{ marginRight: '36px', cursor: 'pointer' }} className={active === 'dataset' ? 'active' : ''}>
        <Link to="/dataset/list">{$i18n.get({ id: 'gi-site.components.Navbar.Links.Dataset', dm: '数据集' })}</Link>
      </div>
      <div style={{ marginRight: '36px', cursor: 'pointer' }} className={active === 'workbook' ? 'active' : ''}>
        <Link to="/workbook/project">
          {$i18n.get({ id: 'gi-site.components.Navbar.Links.Workbook', dm: '工作簿' })}
        </Link>
      </div>
      {/*<div style={{ marginRight: '36px', cursor: 'pointer' }} className={active === 'open' ? 'active' : ''}>*/}
      {/*  <Link to="/open/assets-manage">*/}
      {/*    {$i18n.get({ id: 'gi-site.components.Navbar.Links.OpenMarket', dm: '开放市场' })}*/}
      {/*  </Link>*/}
      {/*</div>*/}
    </>
  );
};

export default Links;
