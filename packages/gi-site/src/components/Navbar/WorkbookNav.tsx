import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useContext } from '../../pages/Analysis/hooks/useContext';
import ProjectTitle from '../ProjectTitle';
import DatasetInfo from './DatasetInfo';
import Github from './Github';
import Logo from './Logo';
import SaveWorkbook from './SaveWorkbook';
import Theme from './Theme';
interface WorkbookBarProps {
  workbookId: string;
}

const styles = {
  container: {
    height: '100%',
    width: '100%',
    // boxShadow: `var(--box-shadow-bottom)`,
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

const WorkbookBar: React.FunctionComponent<WorkbookBarProps> = props => {
  const { workbookId } = props;
  const { context, updateContext } = useContext();
  const history = useHistory();
  const { name } = context;

  return (
    <header style={styles.container}>
      <div style={styles.left}>
        <Logo
          handleClick={() => {
            history.push('/workbook/project');
          }}
          size={30}
          style={{ padding: '0px 8px', cursor: 'pointer' }}
        />
        <DatasetInfo context={context} history={history}></DatasetInfo>
      </div>
      <div style={styles.left}>
        <ProjectTitle name={name} projectId={workbookId} />
      </div>
      <div style={styles.right}>
        <SaveWorkbook workbookId={workbookId} />
        <Theme />
        <Github />
      </div>
    </header>
  );
};

export default WorkbookBar;
