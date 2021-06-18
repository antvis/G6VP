import componentPanel from '../components/componentPanel';
// import layoutPanel from "./layoutPanel";
// import stylePanel from "./stylePanel";
import layout from '../layout/layout';
import style from '../style/style';

const getComponentsConfig = (data, config) => {
  return componentPanel('components', config, data);
};

const getLayoutConfig = (data, config) => {
  return layout;
};

const getStyleConfig = (data, config) => {
  return style;
};

const ConfigMap = {
  components: getComponentsConfig,
  layout: getLayoutConfig,
  style: getStyleConfig,
};

const getConfig = (id, data, config) => {
  return ConfigMap[id](data, config[id]);
};

export default getConfig;
