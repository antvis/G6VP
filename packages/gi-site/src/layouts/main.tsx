import * as React from 'react';
import { Outlet, useLocation } from 'umi';
import Navbar from '../components/Navbar/SiteNav';
import useInitial from '../hooks/useInitial';
import useUpdate from '../hooks/useUpdate';
import './main.less';

export default () => {
  const location = useLocation();
  const active = location.pathname.split('/')[1];
  React.useEffect(() => {
    useUpdate();
    useInitial();
  }, []);

  return (
    <div className="gi-layout">
      <Navbar active={active} />
      <div className="gi-layout__container">
        <Outlet />
      </div>
    </div>
  );
};
