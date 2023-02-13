import * as React from 'react';
// import AntGroupLogin from '../components/AntGroupLogin';
import BaseNavbar from '../components/Navbar/Basic';
// import Notification from '../components/Notification';
// import QRcode from '../components/QRcode';
import useUpdate from '../hooks/useUpdate';
import './index.less';
interface ILayoutProps {}

const Layout: React.FunctionComponent<ILayoutProps> = props => {
  //@ts-ignore
  const { children, location } = props;
  const active = location.pathname.split('/')[1];
  React.useEffect(() => {
    useUpdate();
  }, []);

  return (
    <>
      <BaseNavbar active={active}></BaseNavbar>
      <div className="gi-layout-container">{children}</div>
    </>
  );
};

export default Layout;
