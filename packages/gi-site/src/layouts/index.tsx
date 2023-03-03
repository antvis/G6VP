import * as React from 'react';
import Navbar from '../components/Navbar/SiteNav';
import useInitial from '../hooks/useInitial';
import useUpdate from '../hooks/useUpdate';
import './index.less';
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
