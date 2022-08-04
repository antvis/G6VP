import React from 'react';
import { Input, Empty } from 'antd';
import { useImmer } from 'use-immer';
const Search = Input.Search;

interface PropertiesDetailProp {
  data: any;
}

interface PropertiesDetailState {
  isSearch: boolean;
  searchKey: string;
}

interface IItem {
  key: string;
  value: string;
  isObject: boolean;
}

const PropertiesDetail: React.FC<PropertiesDetailProp> = props => {
  const { data } = props;
  const [state, updateState] = useImmer<PropertiesDetailState>({
    isSearch: false,
    searchKey: '',
  });

  const onSearch = (value: string) => {
    const isSearch = value.length !== 0;
    updateState(draft => {
      draft.isSearch = isSearch;
      draft.searchKey = value;
    });
  };

  let content: IItem[] = Object.keys(data).map(key => {
    let value = data[key];
    let isObject = false;
    if (typeof value == 'object') {
      value = JSON.stringify(value, null, 2);
      isObject = true;
    }
    if (typeof value !== 'string') {
      value = String(value);
    }
    return {
      key,
      value,
      isObject,
    };
  });

  if (state.isSearch) {
    content = content.filter((item: IItem) => {
      const { key, value } = item;
      return key.includes(state.searchKey) || value.includes(state.searchKey);
    });
  }

  return (
    <>
      <Search placeholder="Search in the properties" onSearch={onSearch} style={{ width: '100%' }} />
      <ul>
        {content.length === 0 && (
          <Empty
            style={{
              marginTop: '50px',
            }}
          />
        )}
        {content.map(item => {
          const { key, value, isObject } = item;
          return (
            <li key={key}>
              <div className="key">{key}</div>
              <div className="value">{isObject ? <pre>{value}</pre> : value}</div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default PropertiesDetail;
