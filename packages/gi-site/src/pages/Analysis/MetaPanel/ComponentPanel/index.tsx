import {
  CaretRightFilled,
  CaretRightOutlined,
  CloseOutlined,
  EditOutlined,
  MoreOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Col, Collapse, Row } from 'antd';
import React, { useEffect } from 'react';
import { Icon } from '@antv/gi-sdk';
import AssetsCenterHandler from '../../../../components/AssetsCenter/AssetsCenterHandler';
import { CategroyOptions } from '../../../../components/AssetsCenter/constants';
import './index.less';
import RenderForm from './RenderForm';
import { queryAssets } from '../../../../services/assets';
import { useImmer } from 'use-immer';
import ConfigPanel from './ConfigPanel';
const { Panel } = Collapse;
const otherCategory = {
  name: '未分类',
  icon: <QuestionCircleOutlined />,
  order: 12,
};

/** 组件模块 配置面板 */
const ComponentPanel = props => {
  // const { updateContext } = useContext();
  const { config, components, updateContext, setPanelHeight } = props;
  const [state, setState] = useImmer({
    focusing: undefined,
  });
  const { focusing } = state;

  const usingContainers = React.useMemo(() => {
    debugger;
    const commonContainers = components.filter(com => {
      const { type } = com;
      return type === 'GICC' || type === 'GICC_MENU';
    });
    let pageLayoutContainers = [];
    const pageLayout = config.pageLayout;
    if (pageLayout) {
      const pageLayoutComponent = config.components.find(com => com.id === pageLayout.id);
      pageLayout.meta.containers.map(container => {
        const componentProps = pageLayoutComponent?.props.containers?.find(con => con.id === container.id);
        const containerProps = pageLayout.props.containers?.find(con => con.id === container.id);
        const mergedProps = {
          ...containerProps,
          ...componentProps,
        };
        if (mergedProps.display) {
          pageLayoutContainers.push({
            id: container.id,
            name: container.name,
            info: container,
            props: mergedProps,
            // props: pageLayout.props.containers.find(con => con.id === container.id),
          });
        }
      });
    }
    return [...pageLayoutContainers, ...commonContainers];
  }, [components, config.pageLayout]);

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
      <div className="gi-container-config-header">组件</div>
      {config.pageLayout ? (
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
              >
                {subAssets?.map((asset, i) => (
                  <div key={`c${i}`} className="gi-sub-asset-item">
                    {asset.info.name}
                    <EditOutlined onClick={() => handleConfigAsset?.(item, asset)} />
                  </div>
                ))}
              </Panel>
            );
          })}
        </Collapse>
      ) : (
        <div className="gi-component-panel-tip">请先前往容器面板，进行容器配置及资产集成</div>
      )}
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
