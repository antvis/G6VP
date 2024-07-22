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

const useComponents = (state, propsComponentsCfg, ComponentAssets, componentExtraProps = {}) => {
  const { config, initializer, GICC_LAYOUT, components, GISDK_ID } = state;
  const { components: stateComponentsCfg } = config;
  const ComponentCfgMap = propsComponentsCfg.concat(stateComponentsCfg).reduce((acc, curr) => {
    return {
      ...acc,
      [curr.id]: curr,
    };
  }, {});

  const { component: InitializerComponent } = ComponentAssets[initializer.id];

  const { props: InitializerProps } = ComponentCfgMap[initializer.id];

  // 默认使用空布局，graph ready 了才使用 config.pageLayout，避免 pageLayout 中的资产在 graph 实例之前调用 graph
  const { component: GICC_LAYOUT_COMPONENT } = ComponentAssets[config.pageLayout?.id || GICC_LAYOUT.id] || {
    component: DEFAULT_GICC_LAYOUT.component,
  };

  // 页面布局组件的 props 从 context.config.pageLayout 中读取，统一 pageLayout 读写方式
  const { props: GICC_LAYOUT_PROPS } = config.pageLayout ||
    ComponentCfgMap[GICC_LAYOUT.id] || {
      props: DEFAULT_GICC_LAYOUT.props,
    };

  const renderComponents = () => {
    return components.map(c => {
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

      // 传入的额外组件props
      const extraProps = componentExtraProps?.[id] || {};

      return (
        <Component
          key={id}
          GISDK_ID={GISDK_ID}
          assets={ComponentAssets}
          ComponentCfgMap={ComponentCfgMap}
          {...itemProps}
          {...GIProps}
          {...extraProps}
        />
      );
    });
  };

  return {
    renderComponents,
    InitializerComponent,
    InitializerProps,
    GICC_LAYOUT_COMPONENT,
    // GICC_LAYOUT_PROPS,
    GICC_LAYOUT_PROPS: {
      ComponentCfgMap,
      assets: ComponentAssets,
      GISDK_ID,
      ...GICC_LAYOUT_PROPS,
    },
    isPageLayoutReady: true,
  };
};

export default useComponents;
