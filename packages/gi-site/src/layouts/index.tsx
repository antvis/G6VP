import * as React from 'react';
import { Outlet } from 'umi';
import { BUILD_MODE } from '../env';

/** 挂载在浏览器全局下面，方便其他资产包需要 */
window['GI_PUBLIC_PATH'] = BUILD_MODE === 'docker' ? '/public/' : '/';

interface ILayoutProps {}

const Layout: React.FunctionComponent<ILayoutProps> = () => {
  return <Outlet />;
};

export default Layout;
