import menu from "../defaultConfigation/menu";
import configationBlock from "./configationBlock";

const componentPanel = (name, children) => {
  let childConfig = {};
  children.forEach(element => {
    childConfig[element.id] = configationBlock(element.id, element)
  });

  const analyze = {
    name: '分析',
    mode: 'single',
    children: {...childConfig},
  }

  const interactive = {
    name: '交互',
    mode: 'single',
    children: {...childConfig},
  }

  const config = {};
  config[name] = {
    ...menu,
    name,
    children: {
      analyze,
      interactive,
    }
  }

  return config;
}

export default componentPanel;