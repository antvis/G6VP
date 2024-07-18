import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Space, Tooltip } from 'antd';
import * as React from 'react';
import ActionList from '../../../../components/ActionList';
import CollapseCard from '../../../../components/CollapseCard';
import $i18n from '../../../../i18n';
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
        title={$i18n.get({ id: 'gi-site.MetaPanel.DataPanel.DataService.CustomService', dm: '自定义服务' })}
        extra={
          <Button
            type="dashed"
            style={{ width: '100%' }}
            size="small"
            onClick={() => {
              window.open(`#/services/${projectId}?serviceId=NEW_GI_SERVICE`);
            }}
          >
            <PlusOutlined />
            {$i18n.get({ id: 'gi-site.MetaPanel.DataPanel.DataService.Create', dm: '新建' })}
          </Button>
        }
      >
        <Alert
          type="info"
          message={
            <>
              {$i18n.get({
                id: 'gi-site.MetaPanel.DataPanel.DataService.UsersCanCustomizeItOnline',
                dm: '用户可在线自定义,点击查看',
              })}

              <a href="https://www.yuque.com/antv/gi/iwiv6g" target="_blank">
                {$i18n.get({ id: 'gi-site.MetaPanel.DataPanel.DataService.Document', dm: '文档' })}
              </a>
            </>
          }
          showIcon
        ></Alert>
        {serviceLists.map(item => {
          return (
            <ActionList
              key={item.id}
              title={item.id}
              extra={
                <Space>
                  <Tooltip
                    placement="top"
                    title={$i18n.get({ id: 'gi-site.MetaPanel.DataPanel.DataService.EditService', dm: '编辑服务' })}
                  >
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
