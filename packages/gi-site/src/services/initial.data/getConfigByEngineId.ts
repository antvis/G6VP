const SUPPORT_CYPHER_ENGINE = ['TuGraph', 'Neo4j'];

const Cypher_Template = engineId => [
  {
    id: 'CypherQuery',
    name: 'Cypher 语句查询',
    props: {
      serviceId: `${engineId}/CypherQuery`,
      isShowPublishButton: false,
      saveCypherTemplateServceId: `${engineId}/PublishTemplate`,
      initialValue: 'MATCH n RETURN LIMIT 100',
      GI_CONTAINER_INDEX: 2,
      GIAC_CONTENT: {
        visible: false,
        disabled: false,
        isShowTitle: true,
        title: 'Cypher 语句查询',
        isShowIcon: true,
        icon: 'icon-query',
        isShowTooltip: true,
        tooltip: '',
        tooltipColor: '#3056e3',
        tooltipPlacement: 'right',
        hasDivider: false,
        height: '60px',
        isVertical: true,
        containerType: 'div',
        containerAnimate: false,
        containerPlacement: 'RT',
        offset: [0, 0],
        containerWidth: '350px',
        containerHeight: 'calc(100% - 100px)',
        contaienrMask: false,
      },
    },
  },
];

const Gremlin_Template = engineId => [
  {
    id: 'GremlinQuery',
    name: 'Gremlin 查询',
    props: {
      serviceId: `${engineId}/GremlinQuery`,
      isShowPublishButton: false,
      saveTemplateServceId: `${engineId}/PublishTemplate`,
      initialValue: 'g.V().limit(10)',
      height: 200,
      GI_CONTAINER_INDEX: 2,
      GIAC_CONTENT: {
        visible: false,
        disabled: false,
        isShowTitle: true,
        title: 'Gremlin',
        isShowIcon: true,
        icon: 'icon-query',
        isShowTooltip: true,
        tooltip: '',
        tooltipColor: '#3056e3',
        tooltipPlacement: 'right',
        hasDivider: false,
        height: '60px',
        isVertical: true,
        containerType: 'div',
        containerAnimate: false,
        containerPlacement: 'RT',
        offset: [0, 0],
        containerWidth: '350px',
        containerHeight: 'calc(100% - 100px)',
        contaienrMask: false,
      },
    },
  },
];

const getConfigByEngineId = (engineId, template) => {
  const { components, nodes, edges, layout, id, name } = template;

  if (engineId === 'GI') {
    // 从页面布局的子容器中解构出默认的填充原子资产，放入 activeAssetsKeys
    const { activeAssetsKeys = {} } = template;
    const activeAssetsComponentKeySet = new Set<string>(activeAssetsKeys.components || []);
    components.forEach(component => {
      if (component.props?.containers) {
        component.props?.containers.forEach(container => {
          container.GI_CONTAINER?.forEach(assetId => activeAssetsComponentKeySet.add(assetId));
        });
      }
    });
    return {
      ...template,
      activeAssetsKeys: {
        ...activeAssetsKeys,
        components: Array.from(activeAssetsComponentKeySet),
      },
    };
  }
  const isCypher = SUPPORT_CYPHER_ENGINE.indexOf(engineId) !== -1;
  const addComponent = isCypher ? Cypher_Template(engineId) : Gremlin_Template(engineId);
  const addComponentId = addComponent.map(item => item.id);
  const componentConfig = [...components, ...addComponent];
  //@TODO: 之后增加container，统一处理这段逻辑
  componentConfig.forEach(item => {
    if (item.id === 'GrailLayout') {
      item.props.containers = [
        {
          id: 'GI_CONTAINER_RIGHT',
          GI_CONTAINER: ['FilterPanel', ...addComponentId],
        },
      ];
    }
    if (item.id === 'UadLayout') {
      item.props.containers = [
        {
          id: 'GI_CONTAINER_TOP',
          GI_CONTAINER: isCypher ? ['CypherQuery'] : ['GremlinQuery'],
        },
        {
          id: 'GI_CONTAINER_SIDE',
          GI_CONTAINER: ['JSONMode'],
        },
      ];
    }
  });

  const config = {
    nodes,
    edges,
    layout,
    components: componentConfig,
  };
  const activeAssetsKeys = {
    elements: [...nodes.map(n => n.id), ...edges.map(e => e.id)],
    components: [...config.components.map(c => c.id)],
    layouts: ['GraphinForce', 'Concentric', 'Dagre', 'FundForce'],
  };
  return {
    id,
    name,
    ...config,
    activeAssetsKeys,
  };
};

export default getConfigByEngineId;
