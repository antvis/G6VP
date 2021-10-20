import { Button, Modal, Form, Input, Radio, message } from 'antd';
import React, { useState } from 'react';
import { EditableProTable } from '@ant-design/pro-table';
import { useHistory } from '@alipay/bigfish';
import { addProject } from '../../services';
import { createAssets, createNewProjectOnAntCode } from '../../services/assets';
import './index.less';

interface IProps {
  visible: boolean;
  handleClose: () => void;
}

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
      title: '用户名',
      dataIndex: 'name',
      width: '40%',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '权限',
      key: 'state',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        master: { text: 'master' },
        developer: {
          text: '可编辑',
        },
        reporter: {
          text: '仅可见',
        },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 250,
      render: () => null,
    },
  ];

  const onFinish = async value => {
    const projectId = await addProject({
      name: value.title,
      // description: '空',
      status: 0, // 0 正常项目， 1删除项目
      tag: value.tag,
      members: dataSource,
      // version: '',
      //   projectConfig: JSON.stringify(userConfig.config),
      // ownerId: '',
      // coverImg: '',
      // expandInfo: '',
    });

    const createResult = await createNewProjectOnAntCode({
      projectName: `${projectId}_GI_SERVICE_INTIAL_GRAPH`,
      description: '创建 GI 初始化服务代码仓库',
      type: 3,
    });

    if (!createResult || !createResult.success) {
      message.error('创建项目失败：' + createResult.errorMsg);
      return;
    }

    const dbResponse = await createAssets({
      displayName: 'GI 初始化服务',
      name: `${projectId}_GI_SERVICE_INTIAL_GRAPH`,
      type: 3, //数据服务
      description: 'GI 初始化服务',
      version: '0.0.1',
      // 这两个字段需要从登陆信息中获取，目前没有接入登陆
      ownerNickname: '聚则',
      ownerId: '195094',
      branchName: 'master',
      projectId,
      sourceCode: 'export default (data) => {\n return data \n}',
    });

    // if (dbResponse.success) {
    //   history.push(`/workspace/${projectId}`);
    // } else {
    //   console.error(dbResponse);
    // history.push(`/workspace`);
    // }
  };

  return (
    <Modal title={'创建项目'} visible={visible} width={846} footer={null} onCancel={handleClose}>
      <Form form={form} labelCol={{ span: 4 }} layout="vertical" onFinish={onFinish} initialValues={{ tag: 'Empty' }}>
        <Form.Item label="项目名称" name="title" rules={[{ required: true, message: '请填写用户名' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="成员设置" name="users"></Form.Item>
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
            formProps: {},
            actionRender: (row, config, defaultDoms) => {
              return [defaultDoms.delete];
            },
            onValuesChange: (record, recordList) => {
              setDataSource(recordList);
            },
            onChange: setEditableRowKeys,
          }}
        />
        <Form.Item label="项目类型" name="tag" className="round">
          <Radio.Group defaultValue="Empty" size="small">
            <Radio.Button value="GIConfig" style={{ marginRight: 10, borderRadius: 17 }}>
              前端大学图谱模版
            </Radio.Button>
            <Radio.Button value="Empty" style={{ marginRight: 10, borderRadius: 17 }}>
              空白模版
            </Radio.Button>
            <Radio.Button value="knowledgeGraph" style={{ marginRight: 10, borderRadius: 17 }}>
              数据图谱
            </Radio.Button>
            <Radio.Button value="riskControl" style={{ marginRight: 10, borderRadius: 17 }}>
              企业风控
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button style={{ marginRight: 8 }} shape="round">
            保存并返回
          </Button>
          <Button type="primary" shape="round" htmlType="submit">
            立即去创建分析
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePanel;
