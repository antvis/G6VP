import { CheckCard } from '@alipay/tech-ui';
import { DeleteOutlined, EditOutlined, PlusOutlined, TableOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Input, message, Modal, Space } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
import ActionList from '../../../../components/ActionList';
import CollapseCard from '../../../../components/CollapseCard';
import { createAssets, createNewProjectOnAntCode } from '../../../../services/assets';
import { TYPE_MAPPING } from '../../../Market/Constants';
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
  console.log(serviceLists, 'serviceLists');
  const [state, updateState] = useImmer<{
    visible: boolean;
    formValues: FormValues;
    modalStatus: 'EDIT' | 'CREAT';
  }>({
    visible: false,
    formValues: {
      id: 'GI_SERVICE_X1',
      displayName: 'GI_SERVICE_X1服务',
      mode: 'MOCK',
      content: '',
    },
    modalStatus: 'CREAT',
  });
  const { visible, formValues } = state;

  const [form] = Form.useForm();
  const createMockService = async values => {
    console.log('value', values);
    const { id, displayName, mode, content } = values;

    // 数据服务不需要在 antcode 上创建仓库
    // step1: 在 antcode 上创建仓库
    const projectName = `GI_SERVICES_ASSETS_${id}`;
    const createResult = await createNewProjectOnAntCode({
      projectName,
      description: displayName,
      type: TYPE_MAPPING['services'],
    });

    if (!createResult || !createResult.success) {
      message.error('创建项目失败：' + createResult.errorMsg);
      return;
    }

    // step2: 将资产插入到数据库中
    const dbResponse = await createAssets({
      displayName,
      name: id,
      type: TYPE_MAPPING['services'],
      description: displayName,
      version: '0.0.1',
      // 这两个字段需要从登陆信息中获取，目前没有接入登陆
      ownerNickname: '聚则',
      ownerId: '195094',
      branchName: 'master',
      projectId,
      sourceCode: 'export default (data) => {\n return data \n}',
    });

    if (!dbResponse || !dbResponse.success) {
      message.error('创建项目失败：' + dbResponse.errorMsg);
      return;
    }

    const { data } = dbResponse;
    console.log('data', data);

    // step3: 跳转到资产编辑页面
    window.open(
      `#/market/asserts/${data.insertId}?assetId=${data.insertId}&project=${projectName}&branch=master&type=${TYPE_MAPPING['services']}`,
    );
  };
  const handleSubmit = async values => {
    console.log('values', values);
    if (values.mode === 'MOCK') {
      createMockService(values);
    }
  };

  const handleClick = () => {
    updateState(draft => {
      draft.visible = true;
    });
  };

  const handleClose = () => {
    updateState(draft => {
      draft.visible = false;
    });
  };
  /**  form的联动真是jio了 */
  const onValuesChange = changedValues => {
    const [key] = Object.keys(changedValues);
    if (key === 'mode') {
      updateState(draft => {
        draft.formValues.mode = changedValues.mode;
      });
    }
  };
  const handleEdit = item => {
    console.log('item', item);
  };
  console.log(formValues, 'formValues');

  return (
    <div>
      <CollapseCard
        title="数据服务"
        extra={
          <Button type="dashed" style={{ width: '100%' }} size="small" onClick={handleClick}>
            <PlusOutlined /> 新建
          </Button>
        }
      >
        {serviceLists.map(item => {
          return (
            <ActionList
              key={item.id}
              title={item.id}
              extra={
                <Space>
                  <TableOutlined />
                  <EditOutlined
                    onClick={() => {
                      handleEdit(item);
                    }}
                  />
                  <DeleteOutlined />
                </Space>
              }
            ></ActionList>
          );
        })}
      </CollapseCard>
      <Modal title="新建数据服务" visible={visible} width={846} footer={null} onCancel={handleClose}>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={formValues}
          onValuesChange={onValuesChange}
        >
          <Form.Item name="id" label={'数据服务的ID'}>
            <Input placeholder="例如：GI_SERVICES_XX" />
          </Form.Item>
          <Form.Item name="displayName" label="展示名称">
            <Input placeholder="例如：下钻服务接口" />
          </Form.Item>
          <Form.Item name="mode" label="选择服务类型">
            <CheckCard.Group style={{ width: '100%' }}>
              <CheckCard
                title="Mock服务"
                avatar={
                  <Avatar
                    src="https://gw.alipayobjects.com/zos/bmw-prod/2dd637c7-5f50-4d89-a819-33b3d6da73b6.svg"
                    size="large"
                  />
                }
                description="使用本地上传的数据源，做为数据服务"
                value="MOCK"
              />
              <CheckCard
                title="API服务"
                avatar={
                  <Avatar
                    src="https://gw.alipayobjects.com/zos/bmw-prod/6935b98e-96f6-464f-9d4f-215b917c6548.svg"
                    size="large"
                  />
                }
                description="使用在线的API接口，做为数据服务"
                value="API"
              />
            </CheckCard.Group>
          </Form.Item>
          {formValues.mode === 'API' && (
            <Form.Item name="value" label="API地址">
              <Input placeholder="例如：下钻服务接口" />
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataService;
