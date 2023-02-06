import * as React from 'react';
import './index.less';
interface ILayoutProps {}

const SideNav: React.FunctionComponent<ILayoutProps> = props => {
  //@ts-ignore
  const { children, location } = props;

  return (
    <>
      <div>sideNav</div>
      <div>{children}</div>
    </>
  );
};

export default SideNav;
