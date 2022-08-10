import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Space, Tooltip } from 'antd';
import * as React from 'react';
import ActionList from '../../../../components/ActionList';
import CollapseCard from '../../../../components/CollapseCard';
interface DataServiceProps {
  projectId: string;
  serviceLists: any[];
}

export interface FormValues {
  id: string;
  displayName: string;
  mode: 'MOCK' | 'API';
  content: string;
}
const DataService: React.FunctionComponent<DataServiceProps> = props => {
  const { projectId, serviceLists } = props;

  return (
    <div>
      <CollapseCard
        title="自定义服务"
        extra={
          <Button
            type="dashed"
            style={{ width: '100%' }}
            size="small"
            onClick={() => {
              window.open(`#/services/${projectId}?serviceId=NEW_GI_SERVICE`);
            }}
          >
            <PlusOutlined /> 新建
          </Button>
        }
      >
        <Alert type="info" message="用户可在线自定义数据服务" showIcon></Alert>
        {serviceLists.map(item => {
          return (
            <ActionList
              key={item.id}
              title={item.id}
              extra={
                <Space>
                  <Tooltip placement="top" title={'编辑服务'}>
                    <EditOutlined
                      onClick={() => {
                        window.open(`#/services/${projectId}?serviceId=${item.id}`);
                      }}
                    />
                  </Tooltip>
                </Space>
              }
            ></ActionList>
          );
        })}
      </CollapseCard>
    </div>
  );
};

export default DataService;
