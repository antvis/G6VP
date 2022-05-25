import React from 'react';

import Footer from '../components/Footer';
import Navbar from '../components/Navbar/index';
import './index.less';

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout: React.FunctionComponent<ILayoutProps> = ({ children }) => {
  return (
    <div className="gi-portal">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
