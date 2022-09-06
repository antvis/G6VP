import { EditableProTable } from '@ant-design/pro-table';
import { Alert, Button, Form, Input, Modal, Radio, Tabs } from 'antd';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { addProject } from '../../services';
import { GIDefaultTrans } from '../Analysis/uploadData/const';
import './index.less';
import Recover from './Recover';
import { activeAssetsKeys, baseConfig, getMockData, schemaData, serviceConfig } from './utils';
const { TabPane } = Tabs;
interface IProps {
  visible: boolean;
  handleClose: () => void;
}

const SOLUTIONS = [
  {
    id: 'blank',
    name: '空白模版',
    url: 'https://gw.alipayobjects.com/zos/bmw-prod/5e3b4176-a8b5-4a17-ab02-c0c4f3d3933c.svg',
  },
  {
    id: 'financial',
    name: '金融风控',
    url: 'https://gw.alipayobjects.com/zos/bmw-prod/fa575ef2-763e-4a97-8e82-5ba1bd0f5676.svg',
  },
  {
    id: 'enterprise',
    name: '企业风控',
    url: 'https://gw.alipayobjects.com/zos/bmw-prod/1519d32a-dfa5-46fe-9d0e-42c96e831b96.svg',
  },
  {
    id: 'social',
    name: '社交网络',
    url: 'https://gw.alipayobjects.com/zos/bmw-prod/ee827cb1-c523-4f71-bb35-175a1342b670.svg',
  },
  {
    id: 'database',
    name: '图数据库',
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
      title: '工号',
      dataIndex: 'userId',
      width: '40%',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '权限',
      key: 'role',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        ADMIN: { text: '管理员' },
        DEVELOPER: {
          text: '可编辑',
        },
        REPORTER: {
          text: '仅可见',
        },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: () => null,
    },
  ];

  const onFinish = async () => {
    const value = form.getFieldValue();
    console.log(value, dataSource);

    const transData = getMockData();
    const projectId = await addProject({
      name: value.title,
      status: 1, // 1 正常项目， 0 删除项目
      tag: value.tag,
      members: JSON.stringify(dataSource),
      data: JSON.stringify({
        transData,
        inputData: [],
        transfunc: GIDefaultTrans('id', 'source', 'target', 'nodeType', 'edgeType'),
      }),
      projectConfig: JSON.stringify(baseConfig),
      activeAssetsKeys: JSON.stringify(activeAssetsKeys),
      serviceConfig: JSON.stringify(serviceConfig),
      schemaData: JSON.stringify(schemaData),
      type: 'project',
    });

    return projectId;
  };
  const handleRecover = async params => {
    const { GI_ASSETS_PACKAGES } = params;
    const projectId = await addProject({
      type: 'project',
      status: 0, // 0 正常项目， 1删除项目
      members: '',
      name: params.name,
      data: JSON.stringify(params.data),
      projectConfig: JSON.stringify(params.projectConfig),
      activeAssetsKeys: JSON.stringify(params.activeAssetsKeys),
      serviceConfig: JSON.stringify(params.serviceConfig),
      schemaData: JSON.stringify(params.schemaData),
      engineId: params.engineId,
      engineContext: JSON.stringify(params.engineContext),
    });
    localStorage.setItem('GI_ASSETS_PACKAGES', JSON.stringify(GI_ASSETS_PACKAGES));
    history.push(`/workspace/${projectId}?nav=data`);
  };

  const goAnalysis = async () => {
    const projectId = await onFinish();
    history.push(`/workspace/${projectId}?nav=data`);
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
        <TabPane tab="创建项目" key="new">
          <Form form={form} labelCol={{ span: 4 }} layout="vertical" initialValues={{ tag: 'Empty' }}>
            <Form.Item label="项目名称" name="title" rules={[{ required: true, message: '请填写用户名' }]}>
              <Input />
            </Form.Item>
            {/* <Form.Item label="成员设置" name="users" > */}
            {GI_ENV === 'ONLINE' && (
              <>
                <span className="form-item">成员设置</span>
                <EditableProTable
                  columns={columns}
                  value={dataSource}
                  rowKey="id"
                  recordCreatorProps={{
                    creatorButtonText: '添加成员',
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
            <Form.Item label={'项目类型'} name="tag" className="round">
              <div style={{ position: 'absolute', top: '-31px', left: '70px' }}>
                <Alert
                  style={{ padding: '2px 16px', fontWeight: '100', fontSize: '12px' }}
                  message="当前版本 仅提供空白模版，暂未开放其他类型模版"
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
                立即去创建分析
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="恢复项目" key="recover">
          <Recover onRecover={handleRecover} />
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default CreatePanel;
