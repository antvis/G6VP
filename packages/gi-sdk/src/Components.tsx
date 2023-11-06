import * as React from 'react';
import { useMemo } from 'react';
import SizeSensor from './SizeSensor';
import { getComponents } from './hooks/useComponents';
import { useContext } from './useContext';

interface ComponentsProps {}

const Components: React.FunctionComponent<ComponentsProps> = props => {
  const { context, updateContext, assets, id } = useContext();
  const { components: componentsCfg = [], pageLayout, HAS_GRAPH, initialized } = context;

  /**
   * 响应 config.components 变化，重新渲染组件
   */
  const { renderComponents, InitializerComponent, InitializerProps, GICC_LAYOUT_COMPONENT, GICC_LAYOUT_PROPS } =
    useMemo(() => {
      const a = getComponents(componentsCfg, pageLayout, assets.components);

      return a;
    }, [componentsCfg, pageLayout]);

  return (
    <GICC_LAYOUT_COMPONENT {...GICC_LAYOUT_PROPS}>
      {props.children}
      {HAS_GRAPH && <InitializerComponent {...InitializerProps} />}
      {HAS_GRAPH && initialized && renderComponents}
      {HAS_GRAPH && initialized && <SizeSensor />}
    </GICC_LAYOUT_COMPONENT>
  );
};

export default Components;
