import Meta from '@alipay/gi-meta';
import { GIComponentsMeta, GIComponents } from '@alipay/graphinsight';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// const state = useSelector(state => state);
// const { config, id } = state;

const getComponentsByMap = componentMap => {
  const componentKeys = Object.keys(componentMap);
  return componentKeys.map(id => {
    const props = componentMap[id];
    const { giEnable } = props;
    return {
      id,
      props,
      enable: giEnable,
    };
  });
};
const getComponents = components => {
  const { analysis, interaction = {} } = components;
  /** 分析组件 */
  const analysisComponents = getComponentsByMap(analysis);
  /** 交互组件 */
  const interactionComponents = getComponentsByMap(interaction);
  return [...analysisComponents, ...interactionComponents];
};

const market = GIComponents('id');

const ConfigationPanel = props => {
  const dispatch = useDispatch();
  const { config } = useSelector(state => state);
  const onChange = evt => {
    console.log('ConfigationPanel onChange', evt);

    const { rootValue } = evt;
    const { components, layout, style } = rootValue;
    if (components) {
      /** 分析组件 */
      const comps = getComponents(components);
      dispatch({
        type: 'update:config',
        config: {
          ...config,
          components: comps,
        },
      });
    }

    if (layout) {
      /** 布局设置 */
      const { toggle } = layout;
      const layoutType = `${toggle}`;
      const layoutOptions = layout[layoutType];
      dispatch({
        type: 'update:config',
        config: {
          ...config,
          layout: {
            id: 'Layout',
            name: '官方内置布局',
            props: {
              type: toggle,
              options: layoutOptions,
            },
          },
        },
      });
    }

    if (style) {
      let { node, edge } = style;
      const nodeConfig = config.node.map(c => {

        console.log('nodeConfig', node, c);
        // 后续需要根据节点来判断是否需要覆盖
        return {
          ...c,
          props: {
            ...c.props,
            ...node,
          }
        }
      });

      const edgeConfig = config.edge.map(c => {
        // 后续需要根据节点来判断是否需要覆盖
        return {
          ...c,
          props: {
            ...c.props,
            ...edge,
          }
        }
      });

      dispatch({
        type: 'update:config',
        config: {
          ...config,
          node: nodeConfig,
          edge: edgeConfig,
        },
      });
    }
  };

  

  console.log('ConfigationPanel', config, props);
  return (
    <div className="gi-config-pannel">
      <Meta {...props} onChange={onChange} meta={GIComponentsMeta} market={market} />
    </div>
  );
};

export default ConfigationPanel;
