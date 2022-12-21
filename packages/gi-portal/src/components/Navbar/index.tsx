import { useState } from 'react';
import { Link } from 'react-router-dom';
import $i18n from '../../i18n';
import LanguageSwitch from '../LanguageSwitch';
import './index.less';

const extra = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  return (
    <>
      <button
        className="hamburger"
        onClick={() => {
          setIsNavExpanded(!isNavExpanded);
        }}
      >
        {/* icon from Heroicons.com */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="white">
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div className={isNavExpanded ? 'navigation-menu expanded' : 'navigation-menu'}>
        <ul>
          <li className="">
            <Link to="/video">
              {$i18n.get({ id: 'gi-portal.components.Navbar.VideoIntroduction', dm: '视频介绍' })}
            </Link>
          </li>
          {/* <li
            className="disabled"
            title={$i18n.get({ id: 'gi-portal.components.Navbar.ExpectedOpeningInJuly', dm: '预计7月份开放' })}
          >
            {$i18n.get({ id: 'gi-portal.components.Navbar.PracticeCase', dm: '实践案例' })}
          </li> */}
          <li className="disabled" title={$i18n.get({ id: 'gi-portal.components.Navbar.ComingSoon', dm: '敬请期待' })}>
            {$i18n.get({ id: 'gi-portal.components.Navbar.Solution', dm: '解决方案' })}
          </li>

          <li>
            <a href="https://www.yuque.com/antv/gi/emf7am" target="_blank">
              {$i18n.get({ id: 'gi-portal.components.Navbar.ProductDocumentation', dm: '产品文档' })}
            </a>
          </li>
          <li>
            <LanguageSwitch />
          </li>
        </ul>
      </div>
    </>
  );
};
const Navbar = () => {
  return (
    <nav className="navigation">
      <Link to="/">
        <img
          className="logo"
          // src="https://gw.alipayobjects.com/zos/bmw-prod/c2d4b2f5-2a34-4ae5-86c4-df97f7136105.svg"
          src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*WDF_R6NLDHwAAAAAAAAAAAAADmJ7AQ/original"
          alt=""
          style={{ height: '30px' }}
        />
      </Link>
      {extra()}
    </nav>
  );
};

export default Navbar;
