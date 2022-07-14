import { useContext, utils } from '@alipay/graphinsight';
import { LeftOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, message } from 'antd';
import { nanoid } from 'nanoid';
import React from 'react';
import { Updater } from 'use-immer';
import mockServices from './mockServices';
import { ITheme, IThemeSettingState } from './typing';
import { ADD_THEME } from "./const"

const msg = '将当前的画布样式配置与元素样式配置设置为主题，可以一键加载!';

interface Props {
  updateState: Updater<IThemeSettingState>;
}

const AddTheme: React.FC<Props> = props => {
  const { updateState, } = props;
  const { graph, config, GISDK_ID, services } = useContext();
  const imgURL = graph.toDataURL('image/jpeg', '#fff');
  const [form] = Form.useForm();

  // const addThemeService = utils.getService(services, ADD_THEME)
  const addThemeService = mockServices()[1].service;

  const goBack = () => {
    updateState(draft => {
      draft.isAddingTheme = false;
    });
  };

  const  handleCreate = async () => {
    const name = form.getFieldValue('name');
    const id = nanoid();
    const nodesConfig = config.node;
    const edgesConfig = config.edges;
    const parent_container = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLElement;
    const container = parent_container.firstElementChild as HTMLElement;
    let canvasConfig = {};
    if (parent_container && container) {
      const background = container.style.background;
      const backgroundImage = container.style.backgroundImage;
      canvasConfig = { background, backgroundImage };
    } 
    const res = await addThemeService({ id, name, cover: imgURL, nodesConfig, edgesConfig, canvasConfig });
    if (res.success) {
        //@ts-ignore
        message.success(res.msg);
        updateState(draft => {
            //@ts-ignore
            draft.themes = res.data;
        })
        goBack();
    }
  };

  return (
    <div className="add-theme">
      <header>
        <Button type="text" icon={<LeftOutlined style={{ fontSize: '18x' }} />} onClick={goBack} />
        <span className="title">创建主题</span>
      </header>
      <Form layout="vertical" form={form}>
        <Form.Item label="主题名称" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="描述">
          <Alert message={msg} type="info" />
        </Form.Item>
        <Form.Item label="缩略图">
          <img src={imgURL} alt="缩略图" width="100%" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" style={{ width: '100%' }} onClick={handleCreate
        }>
            立即创建
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddTheme;
