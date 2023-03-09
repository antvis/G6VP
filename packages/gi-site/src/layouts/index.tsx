import * as React from 'react';
import Navbar from '../components/Navbar/SiteNav';
import { BUILD_MODE } from '../env';
import useInitial from '../hooks/useInitial';
import useUpdate from '../hooks/useUpdate';
import './index.less';
/** 挂载在浏览器全局下面，方便其他资产包需要 */
window['GI_PUBLIC_PATH'] = BUILD_MODE === 'docker' ? '/public/' : '/';

interface ILayoutProps {}

const Layout: React.FunctionComponent<ILayoutProps> = props => {
  //@ts-ignore
  const { children, location } = props;
  const active = location.pathname.split('/')[1];
  React.useEffect(() => {
    useUpdate();
    useInitial();
  }, []);

  return (
    <>
      <div className="gi-layout">
        <Navbar active={active}></Navbar>
        {/* <BaseNavbar active={active}></BaseNavbar> */}
        <div className="gi-layout__container">{children}</div>
      </div>
    </>
  );
};

export default Layout;
