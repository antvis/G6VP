import menu from "../defaultConfigation/menu";
import configationBlock from "./configationBlock";

const componentPanel = (name, children) => {
  const childConfig = children.forEach(element => {
    const config = {};
    config[element.id] = configationBlock(element.id, element)
    return config;
  });

  const analyze = {
    name: '分析',
    mode: 'single',
    children: childConfig,
  }

  const interactive = {
    name: '交互',
    mode: 'single',
    children: childConfig,
  }

  return {
    ...menu,
    name,
    children: {
      analyze,
      interactive,
    }
  }
}

export default componentPanel;