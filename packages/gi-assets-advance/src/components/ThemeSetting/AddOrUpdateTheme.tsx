import { DisplayColor } from '@alipay/gi-common-components';
import { LeftOutlined } from '@ant-design/icons';
import { useContext } from '@antv/gi-sdk';
import { Alert, Button, Form, Input, List, message } from 'antd';
import { nanoid } from 'nanoid';
import React from 'react';
import { Updater } from 'use-immer';
import mockServices from './mockServices';
import { ICanvasConfig, ITheme, IThemeSettingState } from './typing';

const addMsg = '请在【画布设置】资产中配置画布背景样式，在【样式设置】资产或左侧配置面板中配置元素样式';
const updateMsg = '请在【画布设置】资产中修改画布背景样式，在【样式设置】资产或左侧修改面板中配置元素样式';

interface Props {
  updateState: Updater<IThemeSettingState>;
  status: 'update' | 'add';
  currentTheme?: ITheme;
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
    const name = form.getFieldValue('name') || currentTheme?.name;
    // console.log("form:",  form.getFieldValue('name'))
    const nodesConfig = config.nodes;
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
        id: currentTheme?.id,
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
        });
        goBack();
      } else {
        //@ts-ignore
        message.error(res.msg);
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
          <Input defaultValue={currentTheme?.name} />
        </Form.Item>
        <Form.Item label="描述">
          <Alert message={status === 'add' ? addMsg : updateMsg} type="info" />
        </Form.Item>
        <Form.Item label="主题样式">
          <div className="theme-style">
            <List
              header={<span style={{ fontWeight: 'bold' }}>节点样式</span>}
              style={{
                padding: '10px',
                boxShadow: '0px 0px 4px rgb(0 0 0 / 10%)',
                borderRadius: '4px',
              }}
            >
              {config.nodes?.map(group => {
                return <List.Item extra={<DisplayColor color={group.props.color} />}>{group.groupName}</List.Item>;
              })}
            </List>
            <List
              header={<span style={{ fontWeight: 'bold' }}>边样式</span>}
              style={{
                padding: '10px',
                boxShadow: '0px 0px 4px rgb(0 0 0 / 10%)',
                borderRadius: '4px',
                marginTop: '10px',
              }}
            >
              {config.edges?.map(group => {
                return <List.Item extra={<DisplayColor color={group.props.color} />}>{group.groupName}</List.Item>;
              })}
            </List>
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
