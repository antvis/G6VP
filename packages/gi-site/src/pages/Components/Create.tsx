import React from 'react';
import { Drawer, Button, Form, Input, message } from 'antd';
import { createAssets, createNewProjectOnAntCode } from '../../services/assets';
import { TYPE_MAPPING } from './Constants';
interface IProps {
  type: string;
  visible: boolean;
  close: () => void;
  history: any;
}

const CreateAssets: React.FC<IProps> = ({ visible, close, history, type }) => {
  const [form] = Form.useForm();

  const handleCreate = async () => {
    console.log('value', form.getFieldsValue());
    const assetParams = form.getFieldsValue();
    const { name, description, displayName } = assetParams;

    // step1: 在 antcode 上创建仓库
    const createResult = await createNewProjectOnAntCode({
      projectName: name,
      description,
      type: TYPE_MAPPING[type],
    });

    if (!createResult || !createResult.success) {
      message.error('创建项目失败：' + createResult.errorMsg);
      return;
    }

    // step2: 将资产插入到数据库中
    const dbResponse = await createAssets({
      displayName,
      name,
      type: TYPE_MAPPING[type],
      description,
      version: '0.0.1',
      // 这两个字段需要从登陆信息中获取，目前没有接入登陆
      ownerNickname: '聚则',
      ownerId: '195094',
      branchName: 'master',
    });

    if (!dbResponse || !dbResponse.success) {
      message.error('创建项目失败：' + dbResponse.errorMsg);
      return;
    }

    const { data } = dbResponse;

    // step3: 跳转到资产编辑页面
    history.push(
      `/market/${data.insertId}?assetId=${data.insertId}&project=${name}&branch=master&type=${TYPE_MAPPING[type]}`,
    );
  };
  return (
    <Drawer
      title={type === 'component' ? '新建资产' : type === 'element' ? '新建图元素' : '新建数据服务'}
      placement="right"
      closable={false}
      onClose={close}
      visible={visible}
      width={500}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={close} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={handleCreate} type="primary">
            确定
          </Button>
        </div>
      }
    >
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="horizontal">
        <Form.Item label="显示名称" name="displayName">
          <Input />
        </Form.Item>
        <Form.Item label="资产名称" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="资产描述" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CreateAssets;
