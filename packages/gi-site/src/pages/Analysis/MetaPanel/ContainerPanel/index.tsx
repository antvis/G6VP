import { Button, Checkbox, Col, Row, Select, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import AssetsCenter from './AssetsCenter';
import RenderForm from './RenderForm';
import { clone, isArray } from '@antv/util';
import { AssetInfo } from '../../typing';
import './index.less';

let refComponentKeys: string[] = [];

const getOriginContainerId = (prefixedId, pageLayout) => prefixedId.replace(`_${pageLayout.id}-`, '');
const getPrefixedContainerId = (id, pageLayout) => `_${pageLayout.id}-${id}`;

/** 容器配置面板 */
const ContainerPanel = props => {
  const {
    config,
    updateContext,
    context,
    setPanelHeight,
    pageLayout,
    candidateContainers,
    updatePageLayout,
    layoutComponents,
    handlePageLayoutChange,
    componentsMap,
    handleComplete,
    defaultExpandId,
    updateContainerSubAssets,
    collapse,
  } = props;
  const [state, setState] = useImmer<{
    selectedContainers: any[];
    focusingContainer: any;
    containerAssetsMap: {
      [containerId: string]: AssetInfo[];
    };
    focusingContainerAsset: AssetInfo[];
  }>({
    selectedContainers: [],
    focusingContainer: undefined,
    containerAssetsMap: {},
    focusingContainerAsset: [],
  });
  const { activeAssetsKeys } = context;
  const { selectedContainers, focusingContainer, containerAssetsMap, focusingContainerAsset } = state;

  React.useEffect(() => {
    if (collapse) handleFocusAssetsSelector();
  }, [collapse]);

  /**
   * 当活跃的资产变更时，缓存到 ref
   */
  React.useEffect(() => {
    (async () => {
      refComponentKeys = [...(activeAssetsKeys.components || [])];
    })();
  }, [activeAssetsKeys]);

  /**
   * 选中的页面布局（唯一）变更时，为已选定的容器（包括页面布局必选的子容器），集成当前配置中的子资产，加入活跃资产
   */
  useEffect(() => {
    if (pageLayout) {
      // 该页面布局必选的子容器 id 列表
      const requiredIds: string[] = candidateContainers.filter(con => con.required || con.display).map(con => con.id);
      // 当前活跃的非页面布局类子资产 id 列表
      const currentActiveAssetKeys: string[] = refComponentKeys.filter(key => {
        // 排除掉目前活跃资产中的页面布局（即上一次的页面布局）
        const component = config.components.find(com => com.type === 'GICC_LAYOUT' && com.id === key);
        if (component || !componentsMap[key]) return false;
        return true;
      });
      // 当前页面布局正在使用的自带容器
      const pageLayoutContainerIds =
        pageLayout.props?.containers
          .filter(container => container.display)
          .map(container => getPrefixedContainerId(container.id, pageLayout)) || [];

      // 选中：必选的子容器 + 当前活跃的所有容器 + 页面布局
      handleContainerChange([...requiredIds, ...currentActiveAssetKeys, ...pageLayoutContainerIds, pageLayout.id]);
    }
  }, [pageLayout?.id]);

  /**
   * 选择容器时的响应函数，选中制指定的容器
   * @param selectedList 需要选中的所有容器 id 列表
   * @canditates 候选的容器，可传入以防止调用该函数时 state 中的候选容器更新尚未生效
   */
  const handleContainerChange = (selectedList: string[]) => {
    const containers = candidateContainers.filter(container => selectedList.includes(container.id));

    // 获取容器（配置在模版中的）默认资产
    const containerSubAssetsMap = { ...containerAssetsMap };
    containers.forEach(container => {
      const { id } = container;
      if (!containerAssetsMap[id]) {
        const defaultAssets = container.props.GI_CONTAINER;
        if (defaultAssets) {
          containerSubAssetsMap[id] = defaultAssets;
        }
      }
      updateContainerAssets(id, containerSubAssetsMap[id], 'add', containers);
    });

    setState(draft => {
      draft.selectedContainers = containers;
      draft.containerAssetsMap = containerSubAssetsMap;
    });

    // 计算当前所有需要激活的资产
    let activeAssetsIds = selectedList;
    Object.keys(containerSubAssetsMap).forEach(contaienrId => {
      const assetInfos = containerSubAssetsMap[contaienrId];
      activeAssetsIds = activeAssetsIds.concat(assetInfos?.map(info => info.value));
    });
    // 无需激活的资产 = 全量资产列表 - 需要激活的资产
    const inactivAssetsIds = [];
    Object.values(componentsMap).forEach(con => {
      if (!activeAssetsIds.includes(con.id)) inactivAssetsIds.push(con.id);
    });
    const activeComponentKeys = new Set<string>();
    activeAssetsIds.forEach(assetId => {
      if (assetId && componentsMap[assetId]) activeComponentKeys.add(assetId);
    });
    activeComponentKeys.add('Initializer');
    if (pageLayout) activeComponentKeys.add(pageLayout.id);
    refComponentKeys = Array.from(activeComponentKeys);
    if (JSON.stringify(refComponentKeys.sort()) !== JSON.stringify(clone(context.activeAssetsKeys.components).sort())) {
      // 设置激活资产列表
      updateContext(draft => {
        draft.activeAssetsKeys.components = refComponentKeys;
      });
    }

    // 页面布局的子容器不在资产列表中，因此生效逻辑不通。若被选中，则设置其 display 为 true
    updatePageLayout(propsPageLayout => {
      propsPageLayout.props.containers.forEach(container => {
        container.display = selectedList.map(id => getOriginContainerId(id, propsPageLayout)).includes(container.id);
        const containerAssets = containerSubAssetsMap[getPrefixedContainerId(container.id, propsPageLayout)];
        if (containerAssets) {
          container.GI_CONTAINER = containerAssets;
        }
      });
    });

    // 关闭资产中心
    handleFocusAssetsSelector();
  };

  /**
   * 单个容器中，除了资产集成输入框以外的，其他参数表单变更的响应函数，将更新 context 中对应的参数，以使画布联动变更
   * @param containerId 容器 id
   * @param values 表单值
   */
  const handleFormChange = (containerId: string, values) => {
    updatePageLayout(draft => {
      const originId = getOriginContainerId(containerId, draft);
      const container = draft.props.containers.find(con => con.id === originId);
      if (container) {
        Object.keys(values).forEach(key => {
          container[key] = values[key];
        });
      }
    });
    updateContext(draft => {
      draft.config.components.forEach(item => {
        if (item.id === containerId) {
          item.props = {
            ...item.props,
            ...values,
          };
        }
      });
    });
  };

  /**
   * 点击一个容器的资产集成输入框时的响应函数，将设置当前正在聚焦的容器，并缩小容器设置区域高度以为资产中心腾出空间
   * @param id 被点击（即聚焦）的容器 id。若为不指定，则代表失焦，资产中心将关闭，容器设置区域高度恢复
   * @returns
   */
  const handleFocusAssetsSelector = (id?: string) => {
    if (!id) {
      setState(draft => {
        draft.focusingContainer = undefined;
      });
      setPanelHeight('100%');
      return;
    }
    const focusContainer = selectedContainers.find(container => container.id === id);
    setState(draft => {
      draft.focusingContainer = focusContainer;
      draft.focusingContainerAsset = draft.containerAssetsMap[id];
    });
    setPanelHeight('calc(50vh - 64px)');
  };

  /**
   * 更新一个容器集成的资产，可能是增加多个资产，或删去多个资产
   * @param containerId 容器 id
   * @param propsAsset 被操作的资产信息列表
   * @param action add 表示加入，remove 表示删去
   */
  const updateContainerAssets = (
    containerId: string,
    propsAsset: AssetInfo[] | AssetInfo,
    action: 'add' | 'remove' = 'add',
    containers = undefined,
  ) => {
    const container = (containers || selectedContainers).find(container => container.id === containerId);
    if (container) {
      const assetList = isArray(propsAsset) ? propsAsset : [propsAsset];
      // 获取缓存的容器子资产列表
      let containerAssets = [...(containerAssetsMap[containerId] || [])];
      if (assetList.length) {
        if (action === 'add') {
          const { mode } = container.meta?.GI_CONTAINER?.['x-component-props'] || {};
          if (mode === 'multiple') {
            // 若当前容器子资产支持多选，则加入容器的子资产列表
            assetList.forEach(asset => containerAssets.push(asset));
          } else {
            // 容器子资产单选
            containerAssets = [assetList[0]];
          }
        } else {
          // 移除
          assetList.forEach(asset => {
            const item = containerAssets.find(assetItem => assetItem.value === asset.value);
            if (item) containerAssets.splice(containerAssets.indexOf(item), 1);
          });
        }
      }

      // 新的子资产 id 列表 (activeAssetsKeys)
      const containerAssetsIdsSet = new Set(containerAssets.map(casset => casset.value));
      const containerAssetsIds = Array.from(containerAssetsIdsSet);

      // 更新全局活跃资产列表
      updateContext(draft => {
        draft.config.components.forEach(item => {
          if (item.id === containerId) {
            // 找到普通的容器资产，更新其子资产列表
            item.props.GI_CONTAINER = containerAssetsIds;
          }
        });
        const activeComponentKeys = new Set<string>(refComponentKeys);
        if (action === 'add') {
          assetList.forEach(asset => {
            if (componentsMap[asset.value]) activeComponentKeys.add(asset.value);
          });
        } else {
          assetList.forEach(asset => activeComponentKeys.delete(asset.value));
        }
        refComponentKeys = Array.from(activeComponentKeys);

        draft.activeAssetsKeys.components = refComponentKeys;
      });

      // 页面布局的子容器不在资产列表中，因此生效逻辑不通。若被选中，则设置其 display 为 true
      updatePageLayout(propsPageLayout => {
        const originContainerId = getOriginContainerId(containerId, propsPageLayout);
        const propContainer = propsPageLayout.props?.containers.find(con => con.id === originContainerId);
        if (propContainer) {
          propContainer.display = true;
          propContainer.GI_CONTAINER = containerAssetsIds;
        } else if (!componentsMap[containerId]) {
          propsPageLayout.props = propsPageLayout.props || {
            containers: [],
          };
          // 该子容器不存在页面布局的子容器列表中，加入
          propsPageLayout.props.containers.push({
            ...container,
            GI_CONTAINER: containerAssetsIds,
            display: true,
          });
        }
      });

      // 更新 { [容器]: 子资产[] } 缓存(containerAssetsMap)，并记录当前正在操作的容器 (focusingContainerAsset)
      setState(draft => {
        draft.containerAssetsMap[containerId] = containerAssets;
        draft.focusingContainerAsset = containerAssets;
      });
      // 更新容器的子资产配置，方便下次进入时读取
      updateContainerSubAssets(containerId, containerAssets);
      return containerAssets;
    }
    return undefined;
  };

  return (
    <>
      {/* 容器配置 */}
      <div>
        <Row justify="space-between" align="middle" className="gi-container-config-header">
          <Col className="gi-container-config-title">容器配置</Col>
          <Col>
            <Tooltip title="返回资产配置">
              <Button onClick={handleComplete} type="primary" size="small">
                完成
              </Button>
            </Tooltip>
          </Col>
        </Row>
        <div className="gi-container-config-wrapper">
          <div className="gi-container-config-item">
            <p className="gi-container-config-label">页面布局</p>
            <div className="gi-container-config-input">
              <Select className="gi-container-config-seletor" onSelect={handlePageLayoutChange} value={pageLayout?.id}>
                {layoutComponents.map(component => (
                  <Select.Option value={component.id} key={component.id}>
                    {component.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>

          {/* 相关容器组件的 checkbox */}
          {pageLayout ? (
            <div className="gi-container-config-item">
              <p className="gi-container-config-label">{pageLayout?.name}容器</p>
              <div className="gi-container-config-input">
                <Checkbox.Group
                  value={selectedContainers.map(con => con.id)}
                  options={candidateContainers?.map(container => ({
                    label: container.name,
                    value: String(container.id),
                    disabled: container.required,
                  }))}
                  onChange={handleContainerChange}
                />
              </div>
            </div>
          ) : (
            ''
          )}

          {/* panel: 容器配置 + 集成组件输入框 */}
          {selectedContainers?.length ? (
            <div className="gi-container-collapse">
              {selectedContainers.map(item => (
                <RenderForm
                  key={item.id}
                  selecting={item.id === focusingContainer?.id}
                  {...item}
                  onChange={handleFormChange}
                  config={config}
                  pageLayoutId={pageLayout?.id}
                  handleFocusAssetsSelector={handleFocusAssetsSelector}
                  assets={containerAssetsMap[item.id]}
                  handleRemoveContainerAsset={(id, asset) => updateContainerAssets(id, asset, 'remove')}
                  defaultActiveContainerId={defaultExpandId}
                  handleCollapseChange={value => {
                    if (!value?.length && item.id === focusingContainer?.id) handleFocusAssetsSelector();
                  }}
                />
              ))}
            </div>
          ) : (
            ''
          )}
        </div>
      </div>

      {/* 资产选择器 */}
      <AssetsCenter
        containerComponent={focusingContainer}
        value={focusingContainerAsset}
        componentsMap={componentsMap}
        handleUpdate={updateContainerAssets}
        handleClose={handleFocusAssetsSelector}
      />
    </>
  );
};

export default ContainerPanel;
