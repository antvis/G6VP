import * as React from 'react';
import { useSelector } from 'react-redux';
import './index.less';

const Empty = () => {
  return <div>Empty</div>;
};
interface Option {
  /** 配置的内容 */
  content: React.ReactElement | JSX.Element | JSX.Element[];
  /** 配置的ID */
  id: string;
  /** 配置的名称 */
  name: string;
}
interface ConfigationPanelProps {
  options: Option[];
  value: Option['id'];
}

const ConfigationPanel: React.FunctionComponent<ConfigationPanelProps> = props => {
  const { options, value } = props;
  const state = useSelector(state => state);

  const MatchContent = options.find(opt => {
    return opt.id === value;
  }) || {
    components: Empty,
  };

  return (
    <div className="gi-config-pannel">
      <MatchContent.components />
    </div>
  );
};

export default ConfigationPanel;
