import React from 'react';

const DEFAULT_GICC_LAYOUT = {
  id: 'EmptyLayout',
  props: {
    value: 'EmptyLayout',
  },
  component: props => <>{props.children}</>,
};

const useComponents = (state, ComponentAssets) => {
  const { config, initializer, GICC_LAYOUT, components, GISDK_ID, isContextReady, initialized } = state;
  const { components: componentsCfg } = config;
  const ComponentCfgMap = componentsCfg.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.id]: curr,
    };
  }, {});

  const { component: InitializerComponent } = ComponentAssets[initializer.id];
  const { props: InitializerProps } = ComponentCfgMap[initializer.id];

  if (!isContextReady || !initialized) {
    return {
      renderComponents: () => {
        return null;
      },
      InitializerComponent,
      InitializerProps,
      GICC_LAYOUT_COMPONENT: DEFAULT_GICC_LAYOUT.component,
      GICC_LAYOUT_PROPS: { ...DEFAULT_GICC_LAYOUT.props, value: 'render....' },
    };
  }

  const { component: GICC_LAYOUT_COMPONENT } = ComponentAssets[GICC_LAYOUT.id] || {
    component: DEFAULT_GICC_LAYOUT.component,
  };
  const { props: GICC_LAYOUT_PROPS } = ComponentCfgMap[GICC_LAYOUT.id] || {
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
        info.type === 'GIAC_MENU'
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

      return (
        <Component
          key={id}
          GISDK_ID={GISDK_ID}
          assets={ComponentAssets}
          ComponentCfgMap={ComponentCfgMap}
          {...itemProps}
          {...GIProps}
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
      ...GICC_LAYOUT_PROPS,
    },
  };
};

export default useComponents;
