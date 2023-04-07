import { CaretRightOutlined, CloseOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';
import { Col, Collapse, Row } from 'antd';
import React from 'react';
import { Icon } from '@antv/gi-sdk';
import { useImmer } from 'use-immer';
import ConfigPanel from './ConfigPanel';
import './index.less';

const { Panel } = Collapse;

/** 组件模块 配置面板 */
const ComponentPanel = props => {
  const { config, components, updateContext, setPanelHeight, pageLayout, handleEditContainer } = props;
  const [state, setState] = useImmer({
    focusing: undefined,
  });
  const { focusing } = state;

  const usingContainers = React.useMemo(() => {
    const commonContainers = components.filter(com => {
      const { type } = com;
      return type === 'GICC' || type === 'GICC_MENU';
    });
    let pageLayoutContainers = [];
    if (pageLayout?.meta) {
      pageLayout.meta.containers.map(container => {
        const containerProps = pageLayout.props.containers?.find(con => con.id === container.id);
        if (containerProps.display) {
          pageLayoutContainers.push({
            id: container.id,
            name: container.name,
            info: container,
            props: containerProps,
          });
        }
      });
    }
    const autoComponentInfos = components
      .filter(component => component.type === 'AUTO')
      .map(component => ({
        label: component.name,
        value: component.id,
      }));
    const freeContainer = {
      id: 'GI_FreeContainer',
      name: '无容器组件',
      info: {
        id: 'GI_FreeContainer',
        name: '无容器组件',
        icon: 'icon-layout',
        type: 'GICC',
      },
      props: {
        id: 'GI_FreeContainer',
        GI_CONTAINER: autoComponentInfos,
      },
    };
    return [freeContainer, ...pageLayoutContainers, ...commonContainers];
  }, [components, pageLayout]);

  const handleConfigAsset = (container, asset) => {
    if (!container) {
      setState(draft => {
        draft.focusing = undefined;
      });
      setPanelHeight('100%');
      return;
    }
    setState(draft => {
      draft.focusing = {
        container,
        asset,
      };
    });
    setPanelHeight('calc(50vh - 64px)');
  };

  const handleChange = (assetId, values) => {
    updateContext(draft => {
      draft.config.components.forEach(item => {
        if (item.id === assetId) {
          item.props = values;
        }
      });
    });
  };

  return (
    <div>
      <Row justify="space-between" align="middle" className="gi-container-config-header">
        <Col className="gi-container-config-title">{pageLayout?.name}</Col>
        <Col>
          <span onClick={handleEditContainer} style={{ float: 'right' }}>
            <SettingOutlined />
          </span>
        </Col>
      </Row>

      <Collapse
        ghost
        style={{ padding: '4px 0px' }}
        className={`gi-site-collapse`}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      >
        {usingContainers.map(item => {
          const { info = {}, id } = item;
          let matchContainer = config.components?.find(c => c.id === id);
          if (!matchContainer) {
            // 组件库中找不到，可能是页面布局中的子容器
            matchContainer = item;
          }
          const subAssetIds = matchContainer.props?.GI_CONTAINER || [];
          const subAssets = subAssetIds
            .map(assetId =>
              components.find(com => {
                if (typeof assetId === 'string') return com.id === assetId;
                else return com.id === assetId.value;
              }),
            )
            .filter(Boolean);

          return (
            <Panel
              header={
                <div>
                  <Icon type={info.icon || 'icon-layout'} style={{ marginRight: '8px' }} />
                  {info.name}
                </div>
              }
              key={id}
              className="gi-container-asset-panel"
              extra={<EditOutlined onClick={() => handleEditContainer(id)} />}
            >
              {subAssets?.map((asset, i) => (
                <div
                  key={`c${i}`}
                  className={`gi-sub-asset-item ${focusing?.asset.id === asset.id ? 'gi-sub-asset-item-focusing' : ''}`}
                  onClick={() => handleConfigAsset?.(item, asset)}
                >
                  <Icon type={asset.info?.icon || 'icon-robot'} style={{ marginRight: 4 }} />
                  {asset.info.name}
                </div>
              ))}
            </Panel>
          );
        })}
      </Collapse>

      {/* 单个资产的配置面板 */}
      <div className="gi-asset-config-panel" style={focusing ? { height: '50vh' } : { height: '0vh' }}>
        <Row justify="space-between" align="middle" className="gi-container-config-header">
          <Col className="gi-container-config-title">{`${focusing?.container.name || ''} - ${
            focusing?.asset.name || ''
          } - 配置`}</Col>
          <Col>
            <span onClick={() => handleConfigAsset()} style={{ float: 'right' }}>
              <CloseOutlined />
            </span>
          </Col>
        </Row>
        {focusing ? (
          <ConfigPanel
            container={focusing.container}
            item={focusing.asset}
            config={config}
            handleChange={handleChange}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default ComponentPanel;
