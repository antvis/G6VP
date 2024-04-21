import React, { memo } from 'react';
import { useHistory } from 'react-router-dom';
import { useContext } from '../../pages/Analysis/hooks/useContext';
import ProjectTitle from '../ProjectTitle';
import useTheme from '../ThemeVars/useTheme';
import DatasetInfo from './DatasetInfo';
import ExportSdk from './ExportSdk';
// import Github from './Github';
import Language from './Language';
import Logo from './Logo';
import Preview from './Preview';
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
  const history = useHistory();
  const { name } = context;

  return (
    <header style={styles.container}>
      <div style={styles.left}>
        {/*<Logo*/}
        {/*  handleClick={() => {*/}
        {/*    history.push('/workbook/project');*/}
        {/*  }}*/}
        {/*  size={30}*/}
        {/*  style={{ padding: '0px 8px', cursor: 'pointer' }}*/}
        {/*/>*/}
        <DatasetInfo context={context} history={history}></DatasetInfo>
      </div>
      <div style={styles.left}>
        <ProjectTitle name={name} projectId={workbookId} />
      </div>
      <div style={styles.right}>
        <SaveTemplate workbookId={workbookId} />
        <Share context={context} />
        <Preview context={context} />
        <ExportSdk />
        <SaveWorkbook workbookId={workbookId} context={context} />
        {/*<Github />*/}
        <Theme changeTheme={changeTheme} />
        <Language />
      </div>
    </header>
  );
};

export default memo(WorkbookBar);
