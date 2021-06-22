import layout from '../layout/layout';
import style from '../style/style';

const getLayoutConfig = (data, config) => {
  return layout;
};

const getStyleConfig = (data, config) => {
  return style;
};

const ConfigMap = {
  layout: getLayoutConfig,
  style: getStyleConfig,
};

const getConfig = (id, data, config, meta) => {
  return ConfigMap[id](data, config[id], meta);
};

export default getConfig;
