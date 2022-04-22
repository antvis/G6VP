import { Input } from 'antd';
import * as React from 'react';
import './index.less';
const { Search } = Input;
interface PropertiesProps {
  data: any;
}

const Properties: React.FunctionComponent<PropertiesProps> = props => {
  const { data } = props;

  const onSearch = () => {};
  return (
    <div className="gi-properties-pannel">
      <h3>{data.id}</h3>
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

export default Properties;
