import React from "react";
import { Input } from "antd";
const Search = Input.Search;

interface PropertiesDetailProp {
  data: any;
}

const PropertiesDetail: React.FC<PropertiesDetailProp> = (props) => {
  const { data } = props;

  const onSearch = () => {};
  return (
    <>
      <Search
        placeholder="Search in the properties"
        onSearch={onSearch}
        style={{ width: "100%" }}
      />
      <ul>
        {Object.keys(data).map((key) => {
          let content = data[key];
          let isObject = false;
          if (typeof content == "object") {
            content = JSON.stringify(content, null, 2);
            isObject = true;
          }
          return (
            <li key={key}>
              <div className="key">{key}</div>
              <div className="value">
                {isObject ? <pre>{content}</pre> : content}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default PropertiesDetail;
