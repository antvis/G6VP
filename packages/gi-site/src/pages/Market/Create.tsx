import React from 'react';
import { Button, Modal, Form, Input, message, Radio, Select } from 'antd';
import { createAssets, createNewProjectOnAntCode, getFileSourceCode } from '../../services/assets';
import { EditableProTable } from '@ant-design/pro-table';
import moment from 'moment';
import { useImmer } from 'use-immer';
import { TYPE_MAPPING } from './Constants';
interface IProps {
  visible: boolean;
  close: () => void;
  history: any;
  projectId?: string;
}

const { Option } = Select;

const defaultData = [
  {
    name: '聚则',
    useId: 1,
    state: 'master',
  },
];

const CreateAssets: React.FC<IProps> = ({ visible, close, history, projectId }) => {
  const [form] = Form.useForm();

  const [state, updateState] = useImmer({
    authVisible: false,
    dataSource: defaultData,
    editableKeys: defaultData.map(item => item.id),
  });

  const { authVisible, dataSource, editableKeys } = state;

  const setEditableRowKeys = values => {
    updateState(draft => {
      draft.editableKeys = values;
    });
  };

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

  const handleChangeAuth = () => {
    const assetParams = form.getFieldsValue();
    const { authority } = assetParams;
    if (authority === 'private') {
      updateState(draft => {
        draft.authVisible = false;
      });
    } else if (authority === 'public') {
      updateState(draft => {
        draft.authVisible = true;
      });
    }
  };

  const handleCreate = async () => {
    const assetParams = form.getFieldsValue();
    const { name, description, displayName, type } = assetParams;
    // step1: 在 antcode 上创建仓库
    const createResult = await createNewProjectOnAntCode({
      projectName: name,
      description,
      type: TYPE_MAPPING[type],
    });

    if (!createResult || !createResult.success) {
      message.error('创建资产失败：' + createResult.errorMsg);
      return;
    }

    // 读取 Meta 信息，需要将 Meta 信息存入到数据库中
    const metaFile = await getFileSourceCode({
      projectName: 'component_template',
      branchName: 'master',
      path: 'src/registerMeta.ts',
    });

    const uuid = `${Math.random()
      .toString(36)
      .substr(2)}`;
    const currentDate = moment(new Date()).format('YYYYMMDD');
    const newBranchName = `sprint_${name}_${uuid}_${currentDate}`;

    // step2: 将资产插入到数据库中
    const dbResponse = await createAssets({
      displayName,
      name,
      type: TYPE_MAPPING[type],
      description,
      version: newBranchName,
      // 这两个字段需要从登陆信息中获取，目前没有接入登陆
      ownerNickname: '聚则',
      ownerId: '195094',
      branchName: 'master',
      projectId,
      members: JSON.stringify(dataSource),
      meta: metaFile.data,
      sourceCodeUrl: createResult.data.web_url,
      // sourceCode: 'export default (data) => {\n return data \n}',
    });

    if (!dbResponse || !dbResponse.success) {
      message.error('创建项目失败：' + dbResponse.errorMsg);
      return;
    }

    const { data } = dbResponse;

    // step3: 跳转到资产编辑页面
    history.push(
      `/market/asserts/${data.insertId}?assetId=${data.insertId}&project=${name}&branch=master&type=${TYPE_MAPPING[type]}`,
    );
  };
  return (
    <Modal title="新建资产" visible={visible} width={846} footer={null} onCancel={close}>
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="vertical">
        <Form.Item label="资产名称" name="name" rules={[{ required: true, message: '请填写用户名' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="资产类型" name="type" className="round">
          <Radio.Group defaultValue="Empty" size="small">
            <Radio.Button value="layout" style={{ marginRight: 10, borderRadius: 17 }}>
              布局
            </Radio.Button>
            <Radio.Button value="nodes" style={{ marginRight: 10, borderRadius: 17 }}>
              元素-节点
            </Radio.Button>
            <Radio.Button value="edges" style={{ marginRight: 10, borderRadius: 17 }}>
              元素-边
            </Radio.Button>
            <Radio.Button value="components" style={{ marginRight: 10, borderRadius: 17 }}>
              组件
            </Radio.Button>
            <Radio.Button value="services" style={{ marginRight: 10, borderRadius: 17 }}>
              服务
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="权限类型" name="authority">
          <Select onChange={handleChangeAuth} placeholder="请选择权限类型">
            <Option value="private">仅自己可见</Option>
            <Option value="public">部分人可见</Option>
          </Select>
        </Form.Item>
        {/* <Form.Item label="成员管理" name="members"> */}
        {authVisible && (
          <EditableProTable
            columns={columns}
            value={dataSource}
            rowKey="useId"
            recordCreatorProps={{
              creatorButtonText: '添加成员',
              newRecordType: 'dataSource',
              record: () => ({
                useId: dataSource.length + 1,
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
                updateState(draft => {
                  draft.dataSource = recordList;
                });
              },
              onChange: setEditableRowKeys,
            }}
          />
        )}
        {/* </Form.Item> */}
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button style={{ marginRight: 8 }} shape="round" onClick={handleCreate}>
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

export default CreateAssets;
