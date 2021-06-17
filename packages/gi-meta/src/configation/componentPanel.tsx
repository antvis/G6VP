import { extractDefault } from '@ali/react-datav-gui-utils';
import menu from "../defaultConfigation/menu";
import configationBlock from "./configationBlock";


const componentPanel = (name, children, data) => {
  let childConfig = {};
  children.forEach(element => {
    childConfig[element.id] = configationBlock(element.id, element, data)
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

  const configObj = {};
  configObj[name] = {
    ...menu,
    name,
    children: {
      analyze,
      interactive,
    }
  }

  const valueObj = extractDefault({ config: configObj });
  const props = { configObj, valueObj };

  return props;
}

export default componentPanel;