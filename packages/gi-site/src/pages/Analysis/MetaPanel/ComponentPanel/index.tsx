import React, { useEffect } from 'react';
import { GIComponentAssets } from '@antv/gi-sdk';
import { useImmer } from 'use-immer';
import ContainerPanel from '../ContainerPanel';
import ComponentPanel from './ComponentPanel';
import { queryAssets } from '../../../../services/assets';
import { getComponentsByAssets } from '../../getAssets';
import { clone } from '@antv/util';
import { AssetInfo } from '../../typing';
import './index.less';

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
  const candidateAssets = meta.GI_CONTAINER?.enum.map(value => {
    if (typeof value === 'string') {
      return {
        label: componentsMap[value].id,
        value,
      };
    }
    return value;
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
const formatPageLayoutContainer = (pageLayout, container, componentsMap, configuredPageLayout) => {
  const { id: oid, name, required, ...others } = container;
  const id = `_${pageLayout.id}-${oid}`;
  const props = {};
  let candidateAssets: AssetInfo[] = [];
  const configuredContainer = configuredPageLayout?.props.containers?.find(con => con.id === oid);
  Object.keys(others).forEach(key => {
    if (key === 'GI_CONTAINER') {
      candidateAssets = others[key].enum.map(value => {
        if (typeof value === 'string') {
          return {
            value,
            label: componentsMap[value].id,
          };
        }
        return value;
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
  const containerProps = {
    id: oid,
    ...props,
    display: required,
  };
  let foundInPageLayoutProps = false;
  pageLayout.props.containers.forEach((con, i) => {
    if (con.id === oid) {
      pageLayout.props.containers[i] = containerProps;
      foundInPageLayoutProps = true;
    }
  });
  if (!foundInPageLayoutProps) {
    pageLayout.props.containers.push(containerProps);
  }
  return {
    id,
    name,
    required,
    info: {
      id: oid,
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
    candidateAssets: autoComponents.map(component => ({
      label: component.name,
      value: component.id,
    })),
  };
};

/** 组件模块 配置面板 */
const Panel = props => {
  const { config, updateContext, context, setPanelWidth, setPanelHeight } = props;
  const { data, schemaData, services, engineId, activeAssetsKeys } = context;

  const [assets, setAssets] = React.useState<GIComponentAssets>();
  const [state, setState] = useImmer({
    mode: 'component',
    candidateContainers: [],
    configuringContainerId: undefined,
  });
  const { mode, candidateContainers, configuringContainerId } = state; // pageLayout,

  /**
   * 获取全量的组件资产列表
   */
  React.useEffect(() => {
    (async () => {
      const ASSET_LIST = await queryAssets();
      setAssets({ ...ASSET_LIST.components });
    })();
  }, []);

  React.useEffect(() => {
    setPanelHeight('100%');
    if (mode === 'component') {
      setPanelWidth({
        width: '345px',
        minWidth: 'unset',
      });
    } else {
      setPanelWidth({
        width: '40%',
        minWidth: '500px',
      });
    }
  }, [mode]);

  /**
   * 获取全量的组件资产列表后，生成可用的信息的 components map
   */
  const componentsMap: {
    [componentId: string]: any;
  } = React.useMemo(() => {
    if (!assets) return {};
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
      formatPageLayoutContainer(pageLayoutComponent, com, componentsMap, config.pageLayout),
    );

    // 自由容器（放置所有无需容器的资产），必选 refComponentKeys
    const freeContainer = getFreeContainer(activeAssetsKeys.components, autoComponents, componentsMap);

    if (config.pageLayout?.id === pageLayoutId) {
      // 若当前缓存有同样的 pageLayout ，则恢复缓存中的资产
      pageLayoutComponent.props.containers.forEach(container => {
        const cacheContainer = config.pageLayout.props.containers?.find(con => con.id === container.id);
        if (cacheContainer) {
          container.GI_CONTAINER = cacheContainer.GI_CONTAINER;
          container.display = container.display || cacheContainer.display;
        }
      });
    }

    const candidates = [freeContainer, ...pageLayoutContainers, ...containerComponents];

    setState(draft => {
      // 候选容器有：页面布局的子容器组件 + 资产中所有容器类型的组件 + 一个自由容器（放置所有无需父容器的资产）
      draft.candidateContainers = candidates;
    });

    if (config.pageLayout.id !== pageLayoutComponent.id) {
      updateContext(draft => {
        draft.config.pageLayout = pageLayoutComponent;
      });
    }
  };

  const handleUpdatePageLayout = updateFunc => {
    updateContext(draft => updateFunc(draft.config.pageLayout));
  };

  /**
   * 容器面板中更新了容器的子资产，更新到容器配置中
   * @param updateFunc
   */
  const updateContainerSubAssets = (containerId, assetInfos) => {
    setState(draft => {
      draft.candidateContainers.forEach(container => {
        if (container.id === containerId) {
          container.props.GI_CONTAINER = assetInfos;
        }
      });
    });
  };

  const ComponentPanelElement = assets ? (
    <ComponentPanel
      {...props}
      pageLayout={context.config.pageLayout}
      componentsMap={componentsMap}
      handleEditContainer={containerId => {
        setState(draft => {
          draft.mode = 'container';
          draft.configuringContainerId = containerId;
        });
      }}
    />
  ) : (
    ''
  );

  return mode === 'component' ? (
    ComponentPanelElement
  ) : (
    <ContainerPanel
      {...props}
      pageLayout={context.config.pageLayout}
      componentsMap={componentsMap}
      layoutComponents={layoutComponents}
      candidateContainers={candidateContainers}
      updatePageLayout={handleUpdatePageLayout}
      handlePageLayoutChange={handlePageLayoutChange}
      defaultExpandId={configuringContainerId}
      updateContainerSubAssets={updateContainerSubAssets}
      handleComplete={() => {
        setState(draft => {
          draft.mode = 'component';
        });
      }}
    />
  );
};

export default Panel;
