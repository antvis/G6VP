import * as React from "react";
import "./index.less";
interface NavbarProps {}

const Navbar: React.FunctionComponent<NavbarProps> = (props) => {
  return (
    <div className="header">
      <div className="logo">GraphStduio</div>
      <div className="desc"> Powered by ODPS & GraphScope & GraphInsight </div>
    </div>
  );
};

export default Navbar;
