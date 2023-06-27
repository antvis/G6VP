import { UploadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
// import UploadPanel from '../../uploadData/index';
import UploadPanel from '../../DataSource';
import $i18n from '../../../../i18n';

interface DataSourceProps {
  data: any;
  engineId: string;
}

const DataSource: React.FunctionComponent<DataSourceProps> = props => {
  const { engineId } = props;

  const [state, updateState] = useImmer({
    visible: !engineId,
  });
  const { visible } = state;

  const uploadData = () => {
    updateState(draft => {
      draft.visible = true;
    });
  };
  const handleClose = () => {
    localStorage.setItem('GI_UPLOADED_DATA', 'true');
    updateState(draft => {
      draft.visible = false;
    });
  };
  return (
    <div>
      <Button
        type="dashed"
        style={{ width: '100%' }}
        size="small"
        onClick={uploadData}
        className="gi-intro-upload-data"
      >
        <UploadOutlined />
        {$i18n.get({ id: 'gi-site.MetaPanel.DataPanel.DataSource.Import', dm: '导入' })}
      </Button>
      <UploadPanel visible={visible} handleClose={handleClose}></UploadPanel>
    </div>
  );
};

export default DataSource;
