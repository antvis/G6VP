import defaultConfig from "../defaultConfigation";

// 临时方案，待 gi-compomnent 创建好迁移
const getComponentsMeta = id => {
  if (id === "Legend") {
    return {
      id: 'sortkey',
      name: '分类字段',
      default: 'type',
      type: 'select',
    }
  }

  return {
    id: 'none',
    name: 'block',
    default: true,
    type: 'boolean',
  };
}

const configationBlock = (id, children) => {
  const group = defaultConfig.group;
  const meta = getComponentsMeta(id);
  const childConfig = defaultConfig[meta.type];

  const config = {};
  config[id] = {
    ...group,
    name: children.name,
    children: {
      ...childConfig,
      name: meta.name,
      default: meta.default,
    }
  }

  return config;
}

export default configationBlock;