import { Tag } from 'antd';
import * as React from 'react';
import { TYPE_MAPPING } from '../../pages/Dataset/Table';

interface DatasetInfoProps {
  context: any;
  history: any;
}

const DatasetInfo: React.FunctionComponent<DatasetInfoProps> = props => {
  const { context, history } = props;
  const { datasetId, datasetName = '未命名的数据集合', engineType = 'FILE' } = context;
  const { icon, color, name } = TYPE_MAPPING[engineType];
  const onClick = () => {
    history.push(`/dataset/list/${datasetId}`);
  };
  return (
    <>
      {/* <Button type="text"> */}
      <Tag color={color} onClick={onClick} style={{ cursor: 'pointer' }}>
        {icon} {datasetName} : {datasetId}
      </Tag>

      {/* </Button> */}
    </>
  );
};

export default DatasetInfo;
