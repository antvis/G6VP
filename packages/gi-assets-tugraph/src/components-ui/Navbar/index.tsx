import * as React from "react";
import "./index.less";
interface NavbarProps {}

const Navbar: React.FunctionComponent<NavbarProps> = (props) => {
  return (
    <div className="header">
      <div>
        <img
          className="logo"
          src="https://gw.alipayobjects.com/mdn/rms_3ff49c/afts/img/A*xqsZTKLVHPsAAAAAAAAAAAAAARQnAQ"
          width="90"
        />
        <div className="desc">Explore</div>
      </div>
    </div>
  );
};

export default Navbar;
