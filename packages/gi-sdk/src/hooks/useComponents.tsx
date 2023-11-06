import React from 'react';

const DEFAULT_GICC_LAYOUT = {
  id: 'EmptyLayout',
  props: {
    value: 'EmptyLayout',
  },
  component: props => {
    return <>{props.children}</>;
  },
};

/**
 * 兼容过去几个版本的不规范配置，计算真正的 components 和 container
 * @param components
 * @param pageLayout
 * @returns
 */
const getComponentsCfg = (components, pageLayout) => {
  let container = { id: 'EmptyLayout', props: {} };
  let initializer;

  components.forEach(item => {
    if (item.type === 'INITIALIZER' || item.props.GI_INITIALIZER) {
      initializer = item;
      return;
    }
    if (pageLayout) {
      container = pageLayout;
      return;
    }
    if (item.type === 'GICC_LAYOUT') {
      container = item;
      return;
    }
  });
  return { components, GICC_LAYOUT: container, initializer };
};

export const getComponents = (components, pageLayout, ComponentAssets) => {
  const { GICC_LAYOUT, initializer } = getComponentsCfg(components, pageLayout);
  const ComponentCfgMap = components.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.id]: curr,
    };
  }, {});

  const { component: InitializerComponent } = ComponentAssets[initializer.id];

  const { props: InitializerProps } = ComponentCfgMap[initializer.id];

  // 默认使用空布局，graph ready 了才使用 config.pageLayout，避免 pageLayout 中的资产在 graph 实例之前调用 graph
  const { component: GICC_LAYOUT_COMPONENT } = ComponentAssets[pageLayout?.id || GICC_LAYOUT.id] || {
    component: DEFAULT_GICC_LAYOUT.component,
  };

  // 页面布局组件的 props 从 context.config.pageLayout 中读取，统一 pageLayout 读写方式
  const { props: GICC_LAYOUT_PROPS } = pageLayout ||
    ComponentCfgMap[GICC_LAYOUT.id] || {
      props: DEFAULT_GICC_LAYOUT.props,
    };

  const renderComponents = components.map(c => {
    const { id, props: itemProps = {} } = c;
    const matchComponent = ComponentAssets[id]; //具体组件的实现
    if (!matchComponent) {
      return null;
    }
    const { component: Component, info } = matchComponent;
    /** 三类原子组件，必须在容器组件中才能渲染，因此不单独渲染 */
    if (
      itemProps.GIAC_CONTENT ||
      itemProps.GIAC_MENU ||
      itemProps.GIAC ||
      info.type === 'GICC_LAYOUT' ||
      info.type === 'GIAC_CONTENT' ||
      info.type === 'GIAC' ||
      info.type === 'GIAC_MENU' ||
      id === initializer.id
    ) {
      return null;
    }

    const { GI_CONTAINER } = itemProps;
    /** 这些都是不规范的，后面统一处理 */
    let GIProps = {};
    if (GI_CONTAINER) {
      const componentKeys: string[] = [];
      GI_CONTAINER.forEach(item => {
        if (typeof item === 'string') componentKeys.push(item);
        else componentKeys.push(item.value);
      });
      GIProps = {
        components: componentKeys.map(c => {
          return ComponentCfgMap[c];
        }),
        // assets: ComponentAssets,
      };
    }
    return <Component key={id} {...itemProps} />;
  });

  return {
    renderComponents,
    InitializerComponent,
    InitializerProps,
    GICC_LAYOUT_COMPONENT,
    // GICC_LAYOUT_PROPS,
    GICC_LAYOUT_PROPS: {
      ComponentCfgMap,
      assets: ComponentAssets,
      ...GICC_LAYOUT_PROPS,
    },
    isPageLayoutReady: true,
  };
};

/**
 *
 * @param container ['ZoomIn','ZoomOut']
 * @param config GI 配置文件
 * @param assets GI 资产
 */
export const useComponents = (container, config, assets) => {
  const componentsCfgMap = config.components.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.id]: curr,
    };
  }, {});
  const getComponentById = (componentId: string) => {
    if (!componentId) {
      return null;
    }
    const asset = assets.components[componentId];
    const assetConfig = componentsCfgMap[componentId];
    if (!asset || !assetConfig) {
      console.warn(`asset: ${componentId} not found`);
      return null;
    }
    const { icon } = assetConfig.props?.GIAC_CONTENT || asset.info;
    return {
      icon,
      id: componentId,
      info: asset.info,
      props: assetConfig.props,
      component: asset.component,
    };
  };

  return React.useMemo(() => {
    return {
      components: container.map(getComponentById).filter(c => c),
      componentsCfgMap,
    };
  }, [config.components, container]);
};
