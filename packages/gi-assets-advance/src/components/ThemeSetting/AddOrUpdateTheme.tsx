import { useContext } from '@alipay/graphinsight';
import { LeftOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, message } from 'antd';
import { nanoid } from 'nanoid';
import React from 'react';
import { Updater } from 'use-immer';
import mockServices from './mockServices';
import { ICanvasConfig, IThemeSettingState, ITheme } from './typing';

const msg = '请在【画布设置】资产中配置画布背景样式，在【样式设置】资产或左侧配置面板中配置元素样式';

interface Props {
  updateState: Updater<IThemeSettingState>;
  status: 'update' | 'add';
  currentTheme: ITheme;
}

// 

const AddTheme: React.FC<Props> = props => {
  const { updateState, status, currentTheme } = props;
  const { graph, config, GISDK_ID, services } = useContext();
  const imgURL = graph.toDataURL('image/jpeg', '#fff');
  const [form] = Form.useForm();

  // const addThemeService = utils.getService(services, ADD_THEME)
  const addThemeService = mockServices()[1].service;
  const updateThemeService = mockServices()[2].service;

  const goBack = () => {
    updateState(draft => {
      draft.status = 'show';
    });
  };

  const handleConfirm = async () => {
    const name = form.getFieldValue('name');
    const nodesConfig = config.node;
    const edgesConfig = config.edges;

    const parent_container = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLElement;
    const container = parent_container.firstElementChild as HTMLElement;
    let canvasConfig: ICanvasConfig = {
      backgroundColor: '',
      backgroundImage: '',
    };
    if (parent_container && container) {
      const backgroundColor = container.style.backgroundColor;
      const backgroundImage = container.style.backgroundImage;
      canvasConfig = { backgroundColor, backgroundImage };
    }

    if (status === 'add') {
      const id = nanoid();
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
    } else if (status === 'update') {
      // @ts-ignore
      const res = await updateThemeService(currentTheme.id, {
        id: currentTheme.id,
        name,
        cover: imgURL,
        nodesConfig,
        edgesConfig,
        canvasConfig,
      });

      if (res.success) {
        //@ts-ignore
        message.success(res.msg);
        updateState(draft => {
          draft.themes = res.data;
        })
        goBack();
      } else {
        //@ts-ignore
        message.error(res.msg)
      }
    }
  };

  return (
    <div className="add-theme">
      <header>
        <Button type="text" icon={<LeftOutlined style={{ fontSize: '18x' }} />} onClick={goBack} />
        <span className="title">{status === 'add' ? '创建主题' : '编辑主题'}</span>
      </header>
      <Form layout="vertical" form={form}>
        <Form.Item label="主题名称" name="name">
          <Input defaultValue={currentTheme.name} />
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
                  {/*  <div>背景颜色: {canvasConfig.backgroundColor}</div>
                  <div>背景图片: {canvasConfig.backgroundImage || ''}</div> */}
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
          <Button type="primary" style={{ width: '100%' }} onClick={handleConfirm}>
            {status === 'add' ? '立即创建' : '确认编辑'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddTheme;
