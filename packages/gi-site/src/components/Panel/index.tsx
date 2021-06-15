import ComponentPanel from './Component';
import LayoutPanel from './Layout';
import StylePanel from './Style';
import Meta from '@alipay/gi-meta'

const Panel = (props) => {
  return (<Meta configObj={props.configObj} valueObj={props.valueObj} />);
};

export default Panel;
