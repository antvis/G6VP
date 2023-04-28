import { GiftOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, Input, MenuProps, Modal, message } from 'antd';
import * as React from 'react';
import { useContext } from '../../pages/Analysis/hooks/useContext';
import * as TemplateServices from '../../services/template';

const { TextArea } = Input;

import { useImmer } from 'use-immer';
import './index.less';
interface SaveWorkbookProps {
  workbookId: string;
}

const items: MenuProps['items'] = [
  {
    label: '另存为模版',
    key: 'save',
  },
  {
    label: '切换模版',
    key: 'change',
  },
];

const SaveTemplate: React.FunctionComponent<SaveWorkbookProps> = props => {
  const { context, updateContext } = useContext();
  const [form] = Form.useForm();
  const { config, activeAssetsKeys, name } = context;
  const [state, updateState] = useImmer({
    save: {
      visible: false,
    },
  });
  const handleSave = async () => {
    const { pageLayout, layout, ...otherConfig } = config;
    const clonedLayout = JSON.parse(JSON.stringify(layout));
    const values = form.getFieldsValue();
    const { id, name, type, props } = pageLayout;
    TemplateServices.create({
      ...values,
      ...otherConfig,
      activeAssetsKeys,
      layout: clonedLayout,
      pageLayout: { id, name, type, props },
    });
    updateState(draft => {
      draft.save.visible = false;
    });
  };
  const handleMenuClick: MenuProps['onClick'] = e => {
    const { key } = e;
    if (key === 'save') {
      updateState(draft => {
        draft.save.visible = true;
      });
    }
    if (key === 'change') {
      message.info('正在开发中...');
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <>
      <div style={{ margin: '0px 8px' }}>
        <Dropdown menu={menuProps}>
          <Button size="small" icon={<GiftOutlined />} type="text">
            模版
          </Button>
        </Dropdown>
      </div>

      <Modal
        title="另存为模版"
        open={state.save.visible}
        onOk={handleSave}
        onCancel={() => {
          updateState(draft => {
            draft.save.visible = false;
          });
        }}
      >
        <Form layout={'vertical'} form={form}>
          <Form.Item label="模版名称" name="name" rules={[{ required: true, message: '请填写模版名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="模版描述" name="desc" rules={[{ required: true, message: '请填写模版描述' }]}>
            <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item>
          <Form.Item label="模版插画" name="image">
            <Input placeholder="https://xxx.img" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SaveTemplate;
