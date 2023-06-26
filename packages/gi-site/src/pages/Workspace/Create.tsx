import { EditableProTable } from '@ant-design/pro-table';
import { Alert, Button, Form, Input, Modal, Radio, Tabs } from 'antd';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as ProjectServices from '../../services/project';

import './index.less';
import Recover from './Recover';
import { activeAssetsKeys, baseConfig, getMockData, schemaData, serviceConfig } from './utils';
import $i18n from '../../i18n';
const { TabPane } = Tabs;
interface IProps {
  visible: boolean;
  handleClose: () => void;
}

export const GIDefaultTrans = (id, source, target, nodeType, edgeType) => `
data => {
  const nodes = data.nodes.map(n=>{
    return {
      id:'' + n.${id},
      nodeType: n.${nodeType},
      nodeTypeKeyFromProperties:'${nodeType}',
      data:n
    }
  })
  const edges = data.edges.map(e=>{
    return {
      source:'' + e.${source},
      target:'' + e.${target},
      edgeType: e.${edgeType},
      edgeTypeKeyFromProperties:'${edgeType}',
      data:e
    }
  })
  return { nodes, edges }
}
`;

const SOLUTIONS = [
  {
    id: 'blank',
    name: $i18n.get({ id: 'gi-site.pages.Workspace.Create.BlankTemplate', dm: '空白模版' }),
    url: 'https://gw.alipayobjects.com/zos/bmw-prod/5e3b4176-a8b5-4a17-ab02-c0c4f3d3933c.svg',
  },
  {
    id: 'financial',
    name: $i18n.get({ id: 'gi-site.pages.Workspace.Create.FinancialRiskControl', dm: '金融风控' }),
    url: 'https://gw.alipayobjects.com/zos/bmw-prod/fa575ef2-763e-4a97-8e82-5ba1bd0f5676.svg',
  },
  {
    id: 'enterprise',
    name: $i18n.get({ id: 'gi-site.pages.Workspace.Create.EnterpriseRiskControl', dm: '企业风控' }),
    url: 'https://gw.alipayobjects.com/zos/bmw-prod/1519d32a-dfa5-46fe-9d0e-42c96e831b96.svg',
  },
  {
    id: 'social',
    name: $i18n.get({ id: 'gi-site.pages.Workspace.Create.SocialNetwork', dm: '社交网络' }),
    url: 'https://gw.alipayobjects.com/zos/bmw-prod/ee827cb1-c523-4f71-bb35-175a1342b670.svg',
  },
  {
    id: 'database',
    name: $i18n.get({ id: 'gi-site.pages.Workspace.Create.GraphDatabase', dm: '图数据库' }),
    url: 'https://gw.alipayobjects.com/zos/bmw-prod/94237b87-25da-4d8e-8fba-44dd9dbd3301.svg',
  },
];

const GI_ENV = localStorage.getItem('GI_SERVER_ENV');
const CreatePanel: React.FC<IProps> = ({ visible, handleClose }) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const defaultData = [
    {
      name: 'test',
      id: 1,
      state: 'master',
    },
  ];

  const [dataSource, setDataSource] = useState(() => defaultData);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => defaultData.map(item => item.id));
  const columns = [
    {
      title: $i18n.get({ id: 'gi-site.pages.Workspace.Create.EmployeeNumber', dm: '工号' }),
      dataIndex: 'userId',
      width: '40%',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: [
            {
              required: true,
              message: $i18n.get({ id: 'gi-site.pages.Workspace.Create.ThisItemIsRequired', dm: '此项为必填项' }),
            },
          ],
        };
      },
    },
    {
      title: $i18n.get({ id: 'gi-site.pages.Workspace.Create.Permission', dm: '权限' }),
      key: 'role',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        ADMIN: { text: $i18n.get({ id: 'gi-site.pages.Workspace.Create.Administrator', dm: '管理员' }) },
        DEVELOPER: {
          text: $i18n.get({ id: 'gi-site.pages.Workspace.Create.Editable', dm: '可编辑' }),
        },
        REPORTER: {
          text: $i18n.get({ id: 'gi-site.pages.Workspace.Create.VisibleOnly', dm: '仅可见' }),
        },
      },
    },
    {
      title: $i18n.get({ id: 'gi-site.pages.Workspace.Create.Operation', dm: '操作' }),
      valueType: 'option',
      width: 200,
      render: () => null,
    },
  ];

  const onFinish = async () => {
    const value = form.getFieldValue();
    console.log(value, dataSource);

    const transData = getMockData();
    const projectId = await ProjectServices.create({
      name: value.title,
      status: 1, // 1 正常项目， 0 删除项目
      tag: value.tag,
      members: dataSource,
      data: {
        transData,
        inputData: [],
        transfunc: GIDefaultTrans('id', 'source', 'target', 'nodeType', 'edgeType'),
      },
      projectConfig: baseConfig,
      activeAssetsKeys,
      serviceConfig,
      schemaData,
      type: 'project',
    });

    return projectId;
  };

  const handleRecover = async params => {
    const {
      GI_ASSETS_PACKAGES,
      name,
      data,
      projectConfig,
      activeAssetsKeys,
      serviceConfig,
      schemaData,
      engineContext,
      engineId,
    } = params;
    const projectId = await addProject({
      type: 'project',
      status: 0, // 0 正常项目， 1删除项目
      members: '',
      name,
      data,
      projectConfig,
      activeAssetsKeys,
      serviceConfig,
      schemaData,
      engineId,
      engineContext,
    });
    try {
      const PRE_GI_ASSETS_PACKAGES = JSON.parse(localStorage.getItem('GI_ASSETS_PACKAGES') || '{}');
      localStorage.setItem('GI_ASSETS_PACKAGES', JSON.stringify({ ...PRE_GI_ASSETS_PACKAGES, ...GI_ASSETS_PACKAGES }));
      history.push(`/workspace/${projectId}`);
    } catch (error) {
      console.log('error', error);
    }
  };

  const goAnalysis = async () => {
    const projectId = await onFinish();
    history.push(`/workspace/${projectId}`);
  };

  const goWorkspace = async () => {
    await onFinish();
    history.push(`/workspace`);
  };

  return (
    <Modal
      title={''}
      visible={visible}
      width={846}
      footer={null}
      onCancel={handleClose}
      bodyStyle={{
        paddingTop: '10px',
      }}
    >
      <Tabs defaultActiveKey="new" className="gi-workspace-create-tabs">
        <TabPane tab={$i18n.get({ id: 'gi-site.pages.Workspace.Create.CreateAProject', dm: '创建项目' })} key="new">
          <Form form={form} labelCol={{ span: 4 }} layout="vertical" initialValues={{ tag: 'Empty' }}>
            <Form.Item
              label={$i18n.get({ id: 'gi-site.pages.Workspace.Create.ProjectName', dm: '项目名称' })}
              name="title"
              rules={[
                {
                  required: true,
                  message: $i18n.get({
                    id: 'gi-site.pages.Workspace.Create.PleaseFillInTheUsername',
                    dm: '请填写用户名',
                  }),
                },
              ]}
            >
              <Input />
            </Form.Item>
            {/* <Form.Item label="成员设置" name="users" > */}
            {GI_ENV === 'ONLINE' && (
              <>
                <span className="form-item">
                  {$i18n.get({ id: 'gi-site.pages.Workspace.Create.MemberSettings', dm: '成员设置' })}
                </span>
                <EditableProTable
                  columns={columns}
                  value={dataSource}
                  rowKey="id"
                  recordCreatorProps={{
                    creatorButtonText: $i18n.get({ id: 'gi-site.pages.Workspace.Create.AddMembers', dm: '添加成员' }),
                    newRecordType: 'dataSource',
                    record: () => ({
                      id: dataSource.length + 1,
                    }),
                  }}
                  editable={{
                    type: 'multiple',
                    editableKeys,
                    actionRender: (row, config, defaultDoms) => {
                      return [defaultDoms.delete];
                    },
                    onValuesChange: (record, recordList) => {
                      setDataSource(recordList);
                    },
                    onChange: setEditableRowKeys,
                  }}
                />
              </>
            )}

            {/* </Form.Item> */}
            <Form.Item
              label={$i18n.get({ id: 'gi-site.pages.Workspace.Create.ProjectType', dm: '项目类型' })}
              name="tag"
              className="round"
            >
              <div style={{ position: 'absolute', top: '-31px', left: '70px' }}>
                <Alert
                  style={{ padding: '2px 16px', fontWeight: '100', fontSize: '12px' }}
                  message={$i18n.get({
                    id: 'gi-site.pages.Workspace.Create.TheCurrentVersionOnlyProvides',
                    dm: '当前版本 仅提供空白模版，暂未开放其他类型模版',
                  })}
                  type="warning"
                  showIcon
                />
              </div>
              <Radio.Group defaultValue="blank" size="small">
                {SOLUTIONS.map(c => {
                  return (
                    <Radio.Button key={c.id} value={c.id} className="gi-workspace-temp" disabled={c.id !== 'blank'}>
                      <img src={c.url} alt="" />
                      <div>{c.name}</div>
                    </Radio.Button>
                  );
                })}
              </Radio.Group>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
              <Button type="primary" shape="round" onClick={goAnalysis}>
                {$i18n.get({ id: 'gi-site.pages.Workspace.Create.CreateAnalysisNow', dm: '立即去创建分析' })}
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab={$i18n.get({ id: 'gi-site.pages.Workspace.Create.RestoreProject', dm: '恢复项目' })} key="recover">
          <Recover onRecover={handleRecover} />
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default CreatePanel;
