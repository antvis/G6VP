import { MoreOutlined } from '@ant-design/icons';
import { useContext } from '@antv/gi-sdk';
import { Button, Card, Col, Dropdown, Menu, Popconfirm, Row } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
import AddTheme from './AddOrUpdateTheme';
import './index.less';
import mockServices from './mockServices';
import { ITheme, IThemeSettingState } from './typing';
import $i18n from '../../i18n';

export interface Props {
  serviceId: string;
}

const ThemeSetting: React.FC<Props> = props => {
  const { serviceId } = props;
  const { graph, GISDK_ID, config, services, schema, updateContext } = useContext();
  // const getThemeService = utils.getService(services, GET_THEMES);
  const getThemeService = mockServices()[0].service;
  const removeThemeService = mockServices()[2].service;

  const [state, updateState] = useImmer<IThemeSettingState>({
    themes: [],
    currentThemeId: '',
    status: 'show',
  });

  const removeTheme = async (id: string) => {
    // @ts-ignore
    const res = await removeThemeService(id);

    if (res.success) {
      updateState(draft => {
        draft.themes = res.data;
      });
    }
  };

  const menu = (item: ITheme) => (
    <Menu
      onClick={({ domEvent }) => {
        domEvent.stopPropagation();
      }}
    >
      <Menu.Item>
        <Popconfirm
          title={$i18n.get({ id: 'advance.components.ThemeSetting.Component.DeleteTheTopic', dm: '是否删除该主题?' })}
          onConfirm={e => {
            removeTheme(item.id);
            e!.preventDefault();
          }}
          okText="Yes"
          cancelText="No"
        >
          {$i18n.get({ id: 'advance.components.ThemeSetting.Component.DeleteATopic', dm: '删除主题' })}
        </Popconfirm>
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setTheme(item);
          updateState(draft => {
            draft.status = 'update';
            draft.currentThemeId = item.id;
            draft.currentTheme = item;
          });
        }}
      >
        {$i18n.get({ id: 'advance.components.ThemeSetting.Component.EditTopic', dm: '编辑主题' })}
      </Menu.Item>
    </Menu>
  );

  const setTheme = (theme: ITheme) => {
    const { nodesConfig, edgesConfig, canvasConfig } = theme;
    const parent_container = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLElement;
    const container = parent_container.firstElementChild as HTMLElement;
    if (parent_container && container) {
      const { backgroundColor } = canvasConfig;
      const { backgroundImage } = canvasConfig;
      container.style.background = backgroundColor;
      container.style.backgroundImage = backgroundImage;
    }

    updateContext(draft => {
      draft.config = {
        ...draft.config,
        nodes: nodesConfig,
        edges: edgesConfig,
      };
    });

    updateState(draft => {
      draft.currentThemeId = theme.id;
    });
  };

  React.useEffect(() => {
    try {
      //@ts-ignore
      getThemeService().then(res => {
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
      {state.status === 'show' && (
        <div className="theme-list">
          <Row gutter={[10, 10]}>
            <Col span={12}>
              <Card
                hoverable
                /* cover={<PlusOutlined style={{ fontSize: '70px', color: '#3056E3' }} />} */
                onClick={() =>
                  updateState(draft => {
                    draft.status = 'add';
                  })
                }
              >
                <span className="name">
                  {$i18n.get({ id: 'advance.components.ThemeSetting.Component.CreateATopic', dm: '创建主题' })}
                </span>
              </Card>
            </Col>
            {state.themes.map((item, index) => {
              const primaryColor = item.primaryColor || '#fff';
              const rgbaColor = primaryColor.replace('rgb', 'rgba');
              const cardBgColor =
                primaryColor.includes('#') || primaryColor.includes('rgba')
                  ? primaryColor
                  : `${rgbaColor.substring(0, rgbaColor.length - 1)}, 0.1)`;
              return (
                <Col span={12}>
                  <Card
                    hoverable
                    /* cover={<img src={item.cover} style={{ height: '70px' }} />} */
                    onClick={() => setTheme(item)}
                    style={{
                      position: 'relative',
                      border: state.currentThemeId === item.id ? '#3056e3 1px solid' : '',
                      background: cardBgColor,
                      color: primaryColor === cardBgColor ? 'rgba(0, 0, 0, 0.85)' : primaryColor,
                    }}
                  >
                    <span className="name">
                      {item.name ||
                        $i18n.get({ id: 'advance.components.ThemeSetting.Component.CustomTheme', dm: '自定义主题' })}
                    </span>
                    <Dropdown overlay={menu(item)}>
                      <Button
                        type="text"
                        icon={<MoreOutlined />}
                        style={{ position: 'absolute', right: '-1px' }}
                        onClick={e => {
                          e.stopPropagation();
                        }}
                      ></Button>
                    </Dropdown>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      )}

      {state.status !== 'show' && (
        <AddTheme status={state.status} currentTheme={state.currentTheme!} updateState={updateState} />
      )}
    </div>
  );
};

export default ThemeSetting;
