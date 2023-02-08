import * as React from 'react';
import AntGroupLogin from '../components/AntGroupLogin';
import DataModeCard from '../components/DataModeCard';
import BaseNavbar from '../components/Navbar/BaseNavbar';
import Notification from '../components/Notification';
import QRcode from '../components/QRcode';
import useUpdate from '../hooks/useUpdate';
import { GI_SITE } from '../services/const';
import './index.less';
interface ILayoutProps {}
const rightContentExtra = (
  <>
    {GI_SITE.IS_OFFLINE && <AntGroupLogin />}
    <Notification />
    <QRcode />
    <DataModeCard />
  </>
);
const Layout: React.FunctionComponent<ILayoutProps> = props => {
  //@ts-ignore
  const { children, location } = props;
  const active = location.pathname.split('/')[1];
  React.useEffect(() => {
    useUpdate();
  }, []);

  return (
    <>
      <BaseNavbar rightContentExtra={rightContentExtra} active={active}></BaseNavbar>
      <div className="gi-layout-container">{children}</div>
    </>
  );
};

export default Layout;
