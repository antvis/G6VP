import { UploadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
// import UploadPanel from '../../uploadData/index';
import UploadPanel from '../../DataSource';

interface DataSourceProps {
  data: any;
  engineId: string;
}

const DataSource: React.FunctionComponent<DataSourceProps> = props => {
  const { data, engineId } = props;

  // 如果是使用 GraphScope 模式，则不默认展示弹框
  const graphScopeGraphName = localStorage.getItem('graphScopeGraphName');

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
        <UploadOutlined /> 导入
      </Button>
      <UploadPanel visible={visible} handleClose={handleClose} initData={data}></UploadPanel>
    </div>
  );
};

export default DataSource;
