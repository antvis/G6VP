import ComponentPanel from './Component';
import LayoutPanel from './Layout';
import StylePanel from './Style';
import Meta from '@alipay/gi-meta'

const Panel = (configObj, valueObj) => {
  return (<Meta configObj={configObj} valueObj={valueObj} />);
};

export default Panel;
