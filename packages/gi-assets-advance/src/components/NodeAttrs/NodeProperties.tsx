import { Input } from 'antd';
import * as React from 'react';
const { Search } = Input;
interface NodePropertiesProps {
  node: any;
}

const NodeProperties: React.FunctionComponent<NodePropertiesProps> = props => {
  const { node } = props;
  const { data } = node;
  const onSearch = () => {};
  return (
    <div>
      <h1>{data.id}</h1>
      <Search placeholder="Search in the properties" onSearch={onSearch} style={{ width: '100%' }} />
      <ul>
        {Object.keys(data).map(key => {
          let content = data[key];
          let isObject = false;
          if (typeof content == 'object') {
            content = JSON.stringify(content, null, 2);
            isObject = true;
          }
          return (
            <li key={key}>
              <div className="key">{key}</div>
              <div className="value">{isObject ? <pre>{content}</pre> : content}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NodeProperties;
