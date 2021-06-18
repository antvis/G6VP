import defaultConfig from "../defaultConfigation";

// 临时方案，待 gi-compomnent 创建好迁移
const getComponentsMeta = ( id, data ) => {
  if (id === "Legend" || "channel") {
    const option:any[] = [];
    const nodes = data.nodes;

    if (nodes.length > 1 && typeof(nodes[0].data) !== undefined) {
      let props = '';
      for (props in nodes[0].data) {
        option.push({
          value: props,
          label: props,
        })
      }
    }

    return {
      id: 'sortkey',
      name: '分类字段',
      default: 'type',
      type: 'select',
      options: option,
    }
  }

  return {
    id: 'none',
    name: 'block',
    default: true,
    type: 'boolean',
  };
}

const configationBlock = (id, children, data) => {
  const group = defaultConfig.group;
  const meta = getComponentsMeta(id, data);
  const childDefaultConfig = defaultConfig[meta.type];
  const childConfig = {};
  
  childConfig[meta.id] = {
    ...childDefaultConfig,
    ...meta,
  }

  return{
    ...group,
    name: children.name,
    children: childConfig,
  }
}

export default configationBlock;