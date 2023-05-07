import * as React from 'react';
import { useHistory } from 'react-router-dom';
import DataModeCard from '../DataModeCard';
import Github from './Github';
import Links from './Links';
import Logo from './Logo';

import Theme from './Theme';
import UserInfo from './UserInfo';
interface WorkbookBarProps {
  active: string;
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: ' space-between',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
  },
};

const SiteNav: React.FunctionComponent<WorkbookBarProps> = props => {
  const { active } = props;
  const history = useHistory();

  return (
    <header style={styles.container} className="gi-navbar-container">
      <div style={styles.left}>
        <Logo
          title="AntV Insight"
          handleClick={() => {
            history.push('/home');
          }}
          size={30}
          style={{ padding: '0px 8px', cursor: 'pointer' }}
        />
        <Links active={active} />
      </div>
      <div style={styles.right}>
        <DataModeCard />
        <Github />
        <Theme />
        <UserInfo />
      </div>
    </header>
  );
};

export default SiteNav;
