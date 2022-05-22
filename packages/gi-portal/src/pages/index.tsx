import React from 'react';
import Banner from '../components/Banner/index';
import Feature from '../components/Feature/index';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar/index';
import RoleSwitch from '../components/RoleSwitch/index';
import SwitchContainer from '../components/RoleSwitch/SwitchContainer';
import { analyst, developer, roles } from './const';
import './index.less';

const Home = () => {
  const [state, setState] = React.useState({
    roleId: 'analyst',
  });
  const { roleId } = state;
  const handleChangeRole = (id: string) => {
    setState(preState => {
      return {
        ...preState,
        roleId: id,
      };
    });
  };
  const features = roleId === 'developer' ? developer : analyst;

  return (
    <div className="gi-portal">
      <Navbar />
      <div className="container">
        <RoleSwitch roleId={roleId} handleChangeRole={handleChangeRole} roles={roles} />
        <div className="switch-container">
          {roles.map(role => {
            return (
              <SwitchContainer visible={roleId === role.id} key={role.id}>
                <Banner {...role} />
              </SwitchContainer>
            );
          })}
        </div>
      </div>
      <div style={{ background: '#f6f9fc' }}>
        <div className="container">
          {features.map((feature, index) => {
            const isReverse = index % 2 === 1;
            return <Feature {...feature} reverse={isReverse} />;
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
