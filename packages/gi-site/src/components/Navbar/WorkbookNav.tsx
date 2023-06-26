import * as React from 'react';
import { history } from 'umi';
import { useContext } from '../../pages/Analysis/hooks/useContext';
import ProjectTitle from '../ProjectTitle';
import useTheme from '../ThemeVars/useTheme';
import DatasetInfo from './DatasetInfo';
import ExportSdk from './ExportSdk';
import Github from './Github';
import Logo from './Logo';
import SaveTemplate from './SaveTemplate';
import SaveWorkbook from './SaveWorkbook';
import Share from './Share';
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
    paddingRight: '12px',
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
  const { changeTheme } = useTheme(context, updateContext);
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
        <SaveTemplate workbookId={workbookId} />
        <Share context={context} />
        <ExportSdk />
        <SaveWorkbook workbookId={workbookId} />
        <Github />
        <Theme changeTheme={changeTheme} />
      </div>
    </header>
  );
};

export default WorkbookBar;
