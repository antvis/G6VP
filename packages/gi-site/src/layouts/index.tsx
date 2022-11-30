import * as React from 'react';
import DataModeCard from '../components/DataModeCard';
import BaseNavbar from '../components/Navbar/BaseNavbar';
import Notification from '../components/Notification';
import QRcode from '../components/QRcode';
import './index.less';
interface ILayoutProps {}
const rightContentExtra = (
  <>
    {/* {IS_INDEXEDDB_MODE && <AlibabaLogin />} */}
    <Notification />
    <QRcode />
    <DataModeCard />
  </>
);
const Layout: React.FunctionComponent<ILayoutProps> = props => {
  //@ts-ignore
  const { children, location } = props;
  const active = location.pathname.split('/')[1];

  return (
    <>
      <BaseNavbar rightContentExtra={rightContentExtra} active={active}></BaseNavbar>
      <div className="gi-layout-container">{children}</div>
    </>
  );
};

export default Layout;
