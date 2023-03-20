import { Checkbox, Select } from 'antd';
import { GIComponentAssets } from '@antv/gi-sdk';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import AssetsCenter from './AssetsCenter';
import RenderForm from './RenderForm';
import { queryAssets } from '../../../../services/assets';
import { getComponentsByAssets } from '../../getAssets';
import { clone, isArray } from '@antv/util';
import './index.less';

type AssetInfo = {
  label: string;
  value: string;
};

/**
 * 格式化普通的容器组件
 * @param container 子容器
 * @param componentsMap 当前所有资产（包括非活跃）的 map
 * @param activeComponents 活跃的资产
 * @returns
 */
const formatCommonContainer = (container, componentsMap, activeComponents) => {
  const { id, meta, props: defaultProps } = container;
  const configuredComponent = activeComponents.find(configuredCom => configuredCom.id === id);
  const candidateAssets = meta.GI_CONTAINER?.enum?.map(item => {
    const assetId = typeof item === 'string' ? item : item.value;
    return componentsMap[assetId];
  });
  const props = {
    ...defaultProps,
    ...configuredComponent?.props,
  };
  props.GI_CONTAINER = props.GI_CONTAINER?.map(sid => {
    const asset = componentsMap[sid];
    if (!asset) return undefined;
    return {
      value: sid,
      label: asset.name,
    };
  }).filter(Boolean);
  return {
    ...container,
    props,
    candidateAssets,
  };
};

/**
 * 格式化页面布局中的子容器
 * @param pageLayout 页面布局
 * @param container 子容器
 * @param componentsMap 当前所有资产（包括非活跃）的 map
 * @param activeComponents 活跃的资产
 * @returns
 */
const formatPageLayoutContainer = (pageLayout, container, componentsMap, activeComponents) => {
  const { id, name, required, ...others } = container;
  const props = {};
  let candidateAssets = [];
  const configuredPageLayout = activeComponents.find(com => com.id === pageLayout.id);
  const configuredContainer = configuredPageLayout?.props.containers?.find(con => con.id === id);
  Object.keys(others).forEach(key => {
    if (key === 'GI_CONTAINER') {
      candidateAssets = others[key].enum.map(item => {
        const assetId = typeof item === 'string' ? item : item.value;
        return componentsMap[assetId];
      });
      const selectedSubInfos = configuredContainer ? configuredContainer[key] : others[key].default;
      props[key] = selectedSubInfos
        ?.map(info => {
          const sid = typeof info === 'string' ? info : info.value;
          const asset = componentsMap[sid];
          if (!asset) return undefined;
          return {
            value: sid,
            label: asset.name,
          };
        })
        .filter(Boolean);
    } else {
      props[key] = configuredContainer ? configuredContainer[key] : others[key].default;
    }
  });
  pageLayout.props.containers.push({
    id,
    ...props,
    display: required,
  });
  return {
    id,
    name,
    required,
    info: {
      id,
      name,
      icon: 'icon-layout',
      type: 'GICC',
    },
    meta: others,
    props,
    candidateAssets,
  };
};

/**
 * 生成一个自由容器，放置所有类型为 AUTO （即无需容器）的组件
 * @param refComponentKeys 当前活跃的资产 id 列表
 * @param autoComponents 所有无需父容器的组件
 * @param componentsMap 全量资产的 map
 * @returns
 */
const getFreeContainer = (refComponentKeys, autoComponents, componentsMap) => {
  // 子组件为当前活跃的 AUTO 类型组件
  const subAssets: AssetInfo[] = [];
  refComponentKeys.forEach(id => {
    if (componentsMap[id]?.type === 'AUTO')
      subAssets.push({
        value: id,
        label: componentsMap[id].name,
      });
  });
  return {
    id: 'GI_FreeContainer',
    name: '无容器组件',
    required: true,
    info: {
      id: 'GI_FreeContainer',
      name: '无容器组件',
      icon: 'icon-layout',
      type: 'GICC',
    },
    meta: {
      GI_CONTAINER: {
        'x-component-props': { mode: 'multiple' },
      },
      id: 'GI_FreeContainer',
      name: '无容器组件',
      required: true,
    },
    props: {
      id: 'GI_FreeContainer',
      GI_CONTAINER: subAssets,
    },
    candidateAssets: autoComponents,
  };
};

let refComponentKeys: string[] = [];

/** 容器配置面板 */
const ContainerPanel = props => {
  const { config, updateContext, context, setPanelHeight } = props;
  const [state, setState] = useImmer<{
    pageLayout: any;
    candidateContainers: any[];
    selectedContainers: any[];
    focusingContainer: any;
    containerAssetsMap: {
      [containerId: string]: AssetInfo[];
    };
    focusingContainerAsset: AssetInfo[];
  }>({
    pageLayout: undefined,
    candidateContainers: [],
    selectedContainers: [],
    focusingContainer: undefined,
    containerAssetsMap: {},
    focusingContainerAsset: [],
  });
  const { activeAssetsKeys, data, schemaData, engineId, services } = context;
  const {
    candidateContainers,
    pageLayout,
    selectedContainers,
    focusingContainer,
    containerAssetsMap,
    focusingContainerAsset,
  } = state;

  const [assets, setAssets] = React.useState<GIComponentAssets>({});

  /**
   * 获取全量的组件资产列表
   */
  React.useEffect(() => {
    (async () => {
      const ASSET_LIST = await queryAssets();
      setAssets({ ...ASSET_LIST.components });
    })();
  }, []);

  /**
   * 当活跃的资产变更时，缓存到 ref
   */
  React.useEffect(() => {
    (async () => {
      refComponentKeys = [...(activeAssetsKeys.components || [])];
    })();
  }, [activeAssetsKeys]);

  /**
   * 获取全量的组件资产列表后，生成可用的信息的 components map
   */
  const componentsMap: {
    [componentId: string]: any;
  } = React.useMemo(() => {
    if (!assets) return [];
    const usingComponents = { ...assets };
    delete usingComponents.default;
    const components = getComponentsByAssets(usingComponents, data, services, config, schemaData, engineId) || [];
    const map = {};
    components.forEach(com => (map[com.id] = com));
    return map;
  }, [assets]);

  /** 所有可选的布局资产 */
  const layoutComponents = React.useMemo(
    () => Object.values(componentsMap).filter(com => com.type === 'GICC_LAYOUT'),
    [componentsMap],
  );

  /** 所有可选的容器资产，不包括布局资产自带的容器 */
  const containerComponents = React.useMemo(
    () =>
      Object.values(componentsMap)
        .filter(com => com.type === 'GICC' || com.type === 'GICC_MENU')
        .map(com => formatCommonContainer(com, componentsMap, config.components)),
    [componentsMap],
  );

  /** 所有不需要父容器的资产，即 type 为 AUTO */
  const autoComponents = React.useMemo(
    () =>
      Object.values(componentsMap)
        .filter(com => com.type === 'AUTO')
        .map(com => formatCommonContainer(com, componentsMap, config.components)),
    [componentsMap],
  );

  /**
   * 可选的布局容器列表发生变更时，使用第一个作为选中的布局容器。若当前已有选中的布局容器，则不设置
   */
  useEffect(() => {
    const activeLayoutComponent = config.components.find(component => component.type === 'GICC_LAYOUT');
    if (config.pageLayout) {
      // 已配置有页面布局，优先使用
      handlePageLayoutChange(config.pageLayout.id);
    } else if (activeLayoutComponent) {
      // 若活跃的资产列表中有页面布局类型的资产，则使用
      handlePageLayoutChange(activeLayoutComponent.id);
    } else if (layoutComponents?.[0]) {
      // 以上条件均不满足，默认使用全量资产列表中的第一个页面布局资产
      handlePageLayoutChange((layoutComponents?.[0] as any).id);
    }
  }, [containerComponents, layoutComponents]);

  /**
   * 选中的页面布局（唯一）变更时，为已选定的容器（包括页面布局必选的子容器），集成当前配置中的子资产，加入活跃资产
   */
  useEffect(() => {
    if (pageLayout) {
      selectedContainers.forEach(container => {
        const defaultAssets = container.props.GI_CONTAINER;
        if (defaultAssets) updateContainerAssets(container.id, defaultAssets);
      });
    }
  }, [pageLayout?.id]);

  /**
   * 页面布局（唯一）切换时的响应函数。将根据一个自由容器(放置无需父容器资产的虚拟容器) + 该页面布局的自带容器 + 其他容器资产
   * 重新生成可选的容器列表(candidateContainers)
   * @param pageLayoutId 页面布局资产 id
   */
  const handlePageLayoutChange = (pageLayoutId: string) => {
    if (!layoutComponents?.length) return;

    const pageLayoutComponent = clone(layoutComponents.find(com => com.id === pageLayoutId));
    pageLayoutComponent.props.containers = pageLayoutComponent.props.containers || [];

    // 该页面布局的子容器，格式化
    const pageLayoutContainers = pageLayoutComponent.meta.containers.map(com =>
      formatPageLayoutContainer(pageLayoutComponent, com, componentsMap, config.components),
    );

    // 自由容器（放置所有无需容器的资产），必选
    const freeContainer = getFreeContainer(refComponentKeys, autoComponents, componentsMap);
    // 将自由容器作为页面布局的一个必选子容器，放在最前面
    pageLayoutComponent.props.containers.unshift(freeContainer.props);
    pageLayoutComponent.meta.containers.unshift(freeContainer.meta);

    if (config.pageLayout?.id === pageLayoutId) {
      // 若当前缓存有同样的 pageLayout ，则恢复缓存中页面布局子容器的 display
      const cachePageLayout = config.components.find(component => component.id === pageLayoutId);
      pageLayoutComponent.props.containers.forEach(container => {
        const cacheContainer = cachePageLayout.props.containers?.find(con => con.id === container.id);
        if (cacheContainer) {
          container.display = cacheContainer.display;
          const pageLayoutContainer = pageLayoutContainers.find(pcontainer => pcontainer.id === container.id);
          if (pageLayoutContainer) pageLayoutContainer.display = cacheContainer.display;
        }
      });
    }

    const candidates = [freeContainer, ...pageLayoutContainers, ...containerComponents];

    setState(draft => {
      // 重置 { [容器]: 子资产[] } 的映射列表
      if (config.pageLayout?.id !== pageLayoutId) draft.containerAssetsMap = {};
      // 记录布局容器
      draft.pageLayout = pageLayoutComponent;
      // 候选容器有：页面布局的子容器组件 + 资产中所有容器类型的组件 + 一个自由容器（放置所有无需父容器的资产）
      draft.candidateContainers = candidates;
    });

    // 将布局容器缓存到全局
    updateContext(draft => {
      draft.config.pageLayout = pageLayoutComponent;
    });

    // 该页面布局必选的子容器 id 列表
    const requiredIds: string[] = candidates.filter(con => con.required || con.display).map(con => con.id);
    // 当前活跃的非页面布局类子资产 id 列表
    const currentActiveAssetKeys: string[] = refComponentKeys.filter(key => {
      // 排除掉目前活跃资产中的页面布局（即上一次的页面布局）
      const component = config.components.find(com => com.type === 'GICC_LAYOUT' && com.id === key);
      if (component || !componentsMap[key]) return false;
      return true;
    });
    // 选中：必选的子容器 + 当前活跃的所有容器 + 页面布局
    handleContainerChange([...requiredIds, ...currentActiveAssetKeys, pageLayoutId], candidates);
  };

  /**
   * 选择容器时的响应函数，选中制指定的容器
   * @param selectedList 需要选中的所有容器 id 列表
   * @canditates 候选的容器，可传入以防止调用该函数时 state 中的候选容器更新尚未生效
   */
  const handleContainerChange = (selectedList: string[], canditates = candidateContainers) => {
    const selectedContainers = canditates.filter(container => selectedList.includes(container.id));
    setState(draft => {
      draft.selectedContainers = selectedContainers;
      // 页面布局的子容器不在资产列表中，因此生效逻辑不通。若被选中，则设置其 display 为 true
      draft.pageLayout.props.containers.forEach(container => {
        if (selectedList.includes(container.id)) container.display = true;
      });
    });

    // 计算当前所有需要激活的资产
    let activeAssetsIds = selectedList;
    Object.keys(containerAssetsMap).forEach(contaienrId => {
      const assetInfos = containerAssetsMap[contaienrId];
      activeAssetsIds = activeAssetsIds.concat(assetInfos?.map(info => info.value));
    });
    // 无需激活的资产 = 全量资产列表 - 需要激活的资产
    const inactivAssetsIds = [];
    Object.values(componentsMap).forEach(con => {
      if (!activeAssetsIds.includes(con.id)) inactivAssetsIds.push(con.id);
    });
    const activeComponentKeys = new Set<string>(activeAssetsIds.filter(Boolean));
    activeComponentKeys.add('Initializer');
    if (pageLayout) activeComponentKeys.add(pageLayout.id);
    refComponentKeys = Array.from(activeComponentKeys);
    // 设置激活资产列表
    updateContext(draft => {
      draft.activeAssetsKeys.components = refComponentKeys;
    });
    handleFocusAssetsSelector();
  };

  /**
   * 单个容器中，除了资产集成输入框以外的，其他参数表单变更的响应函数，将更新 context 中对应的参数，以使画布联动变更
   * @param containerId 容器 id
   * @param values 表单值
   */
  const handleFormChange = (containerId: string, values) => {
    updateContext(draft => {
      draft.config.components.forEach(item => {
        if (item.id === pageLayout?.id) {
          const container = item.props.containers.find(con => con.id === containerId);
          if (container) {
            Object.keys(values).forEach(key => {
              container[key] = values[key];
            });
          }
        } else if (item.id === containerId) {
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
  ) => {
    const container = selectedContainers.find(container => container.id === containerId);
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
      const containerAssetsIds = containerAssets.map(casset => casset.value);

      // 更新全局活跃资产列表
      updateContext(draft => {
        draft.config.components.forEach(item => {
          if (pageLayout && item.id === pageLayout.id) {
            // 页面布局存在，则找到对应项，更新其对应子容器的子资产列表，并设置该子容器可见
            item.props.containers = item.props.containers || [];
            const propContainer = item.props.containers.find(con => con.id === containerId);
            if (propContainer) {
              // 该子容器已存在页面布局的子容器列表中，更新
              propContainer.GI_CONTAINER = containerAssetsIds;
              propContainer.display = true;
            } else if (!componentsMap[containerId]) {
              // 该子容器不存在页面布局的子容器列表中，加入
              item.props.containers.push({
                ...container,
                GI_CONTAINER: containerAssetsIds,
                display: true,
              });
            }
          } else if (item.id === containerId) {
            // 找到普通的容器资产，更新其子资产列表
            item.props.GI_CONTAINER = containerAssetsIds;
          }
        });
        const activeComponentKeys = new Set<string>(refComponentKeys);
        if (action === 'add') {
          assetList.forEach(asset => activeComponentKeys.add(asset.value));
        } else {
          assetList.forEach(asset => activeComponentKeys.delete(asset.value));
        }
        refComponentKeys = Array.from(activeComponentKeys);

        draft.activeAssetsKeys.components = refComponentKeys;
      });
      // 更新 { [容器]: 子资产[] } 缓存(containerAssetsMap)，并记录当前正在操作的容器 (focusingContainerAsset)
      setState(draft => {
        draft.containerAssetsMap[containerId] = containerAssets;
        draft.focusingContainerAsset = containerAssets;
      });
    }
  };

  return (
    <>
      {/* 容器配置 */}
      <div>
        <div className="gi-container-config-header">容器配置</div>
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
        handleUpdate={updateContainerAssets}
        handleClose={handleFocusAssetsSelector}
      />
    </>
  );
};

export default ContainerPanel;
