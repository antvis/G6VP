import { UploadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
import UploadPanel from '../../uploadData/index';
interface DataSourceProps {
  data: any;
}

const DataSource: React.FunctionComponent<DataSourceProps> = props => {
  const { data } = props;
  const GI_UPLOADED_DATA = localStorage.getItem('GI_UPLOADED_DATA') === 'true';
  const [state, updateState] = useImmer({
    visible: !GI_UPLOADED_DATA,
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
        <UploadOutlined /> 导入
      </Button>
      <UploadPanel visible={visible} handleClose={handleClose} initData={data}></UploadPanel>
    </div>
  );
};

export default DataSource;
