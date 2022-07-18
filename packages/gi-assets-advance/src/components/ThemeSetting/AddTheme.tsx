import { useContext } from '@alipay/graphinsight';
import { LeftOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, message } from 'antd';
import { nanoid } from 'nanoid';
import React from 'react';
import { Updater } from 'use-immer';
import mockServices from './mockServices';
import { ICanvasConfig, IThemeSettingState } from './typing';

const msg = '将当前的画布样式配置与元素样式配置设置为主题，可以一键加载!';

interface Props {
  updateState: Updater<IThemeSettingState>;
}

const AddTheme: React.FC<Props> = props => {
  const { updateState } = props;
  const { graph, config, GISDK_ID, services } = useContext();
  const imgURL = graph.toDataURL('image/jpeg', '#fff');
  const [form] = Form.useForm();

  // const addThemeService = utils.getService(services, ADD_THEME)
  const addThemeService = mockServices()[1].service;

  const parent_container = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLElement;
  const container = parent_container.firstElementChild as HTMLElement;
  let canvasConfig: ICanvasConfig = {
    backgroundColor: '',
  };
  if (parent_container && container) {
    const backgroundColor = container.style.backgroundColor;
    const backgroundImage = container.style.backgroundImage;
    canvasConfig = { backgroundColor, backgroundImage };
  }

  const goBack = () => {
    updateState(draft => {
      draft.isAddingTheme = false;
    });
  };

  const handleCreate = async () => {
    const name = form.getFieldValue('name');
    const id = nanoid();
    const nodesConfig = config.node;
    const edgesConfig = config.edges;
    //@ts-ignore
    const res = await addThemeService({ id, name, cover: imgURL, nodesConfig, edgesConfig, canvasConfig });
    if (res.success) {
      //@ts-ignore
      message.success(res.msg);
      updateState(draft => {
        //@ts-ignore
        draft.themes = res.data;
      });
      goBack();
    }
  };

  console.log('nodesConfig: ', config.nodes);
  console.log('edgesConfig: ', config.edges);
  console.log('canvasConfig111: ', canvasConfig);

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
        <Form.Item label="主题样式">
          <div className="theme-style">
            <Alert
              type="info"
              message={
                <div className="canvas-style">
                  <header>画布样式</header>
                  <div>背景颜色: {canvasConfig.backgroundColor}</div>
                  <div>背景图片: {canvasConfig.backgroundImage || ''}</div>
                </div>
              }
            ></Alert>
            <Alert
              type="info"
              message={
                <div className="nodes-style">
                  <header>节点样式</header>
                  <ul>
                    {config.nodes?.map((group, index) => {
                      return (
                        <li key={index}>
                          <div>{group.groupName}</div>
                          <div>节点颜色: {group.props.color}</div>
                          <div>节点大小: {group.props.size}</div>
                          <div>标签颜色: {group.props.advanced?.label?.fill ?? '#000'}</div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              }
            ></Alert>
            <Alert
              type="info"
              message={
                <div className="edges-style">
                  <header>边样式</header>
                  <ul>
                    {config.edges?.map((group, index) => {
                      return (
                        <li key={index}>
                          <div>{group.groupName}</div>
                          <div>边颜色: {group.props.color}</div>
                          <div>边宽度: {group.props.size}</div>
                          <div>标签颜色: {group.props.advanced?.label?.fill ?? '#000'}</div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              }
            ></Alert>
          </div>
        </Form.Item>
        <Form.Item>
          <Button type="primary" style={{ width: '100%' }} onClick={handleCreate}>
            立即创建
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddTheme;
