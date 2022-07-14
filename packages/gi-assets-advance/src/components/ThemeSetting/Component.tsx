import { useContext } from '@alipay/graphinsight';
import { PlusOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
import AddTheme from './addTheme';
import './index.less';
import mockServices from './mockServices';
import { IThemeSettingState, ITheme } from './typing';

export interface Props {
  serviceId: string;
}

const ThemeSetting: React.FC<Props> = props => {
  const { serviceId } = props;
  const { graph, GISDK_ID, config, services, schema, updateContext } = useContext();
  // const getThemeService = utils.getService(services, GET_THEMES);
  const getThemeService = mockServices()[0].service;

  const [state, updateState] = useImmer<IThemeSettingState>({
    themes: [],
    isAddingTheme: false,
  });

  const setTheme = (theme: ITheme) => {
    const { nodesConfig, edgesConfig, canvasConfig } = theme;
    const parent_container = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLElement;
    const container = parent_container.firstElementChild as HTMLElement;
    if (parent_container && container) {
      const { background } = canvasConfig;
      const { backgroundImage } = canvasConfig;
      container.style.background = background;
      container.style.backgroundImage = `url(${backgroundImage})`;
    }
    updateContext(draft => {
      draft.config = {
        ...draft.config,
        nodes: nodesConfig,
        edges: edgesConfig,
      }
    })
  }

  React.useEffect(() => {
    try {
      //@ts-ignore
      getThemeService().then(res => {
        console.log('res:', res);
        if (res.success) {
          updateState(draft => {
            draft.themes = res.data;
          });
        }
      });
    } catch (e) {
      console.error('valid service');
    }
  }, []);

  return (
    <div className="gi-theme-setting">
      {!state.isAddingTheme && (
        <div className="theme-list">
          <Card
            style={{ width: '40%' }}
            hoverable
            cover={<PlusOutlined style={{ fontSize: '70px', color: "#3056E3" }} />}
            onClick={() =>
              updateState(draft => {
                draft.isAddingTheme = true;
              })
            }
          >
            <span className='name'>创建主题</span>
          </Card>
          {state.themes.map((item, index) => (
            <Card style={{ width: '40%' }} hoverable cover={<img src={item.cover} style={{ height: '70px' }} />} onClick={() => setTheme(item)}>
              <span className='name'>{item.name || '自定义主题'}</span>
            </Card>
          ))}
        </div>
      )}
      {state.isAddingTheme && <AddTheme updateState={updateState} />}
    </div>
  );
};

export default ThemeSetting;
