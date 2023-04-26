import React from 'react';
import { Input, Empty, Row, Col, Tooltip } from 'antd';
import { useImmer } from 'use-immer';
import { FireTwoTone } from '@ant-design/icons';
const Search = Input.Search;

interface PropertiesDetailProp {
  data: any;
  propertyInfos: { propertyName: string; ratio: number }[];
}

interface PropertiesDetailState {
  isSearch: boolean;
  searchKey: string;
}

interface IItem {
  key: string;
  value: string;
  isObject: boolean;
  rank?: number;
  isOutlier?: boolean;
}

const PropertiesDetail: React.FC<PropertiesDetailProp> = props => {
  const { data, propertyInfos = [] } = props;
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

    const { rank, isOutlier } = propertyInfos.find(info => info.propertyName === key) || ({} as any);

    return {
      key,
      value,
      isObject,
      rank,
      isOutlier,
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
          const { key, value, isObject, rank, isOutlier } = item;

          let stars: JSX.Element[] = [];
          let tip = '';
          if (rank !== undefined || isOutlier !== undefined) {
            let importance = 3 - (rank || 0);
            tip = `相对于属性 “${key}” 的其他值而言，当前属性值 “${value}” 出现概率${
              importance > 1 ? '极低' : '较低'
            }，可能含有大信息量，值得关注`;
            if (isOutlier) {
              importance = 4;
              tip = `属性 “${key}” 的大部分属性值具有相同出现次数，而当前属性值 “${value}” 出现此处大于平均出现次数，值得关注`;
            }
            stars = new Array(importance).fill(<FireTwoTone twoToneColor="#eb2f96" />);
          }

          return (
            <li key={key}>
              <Row className="key">
                <Col span={20}>{key}</Col>
                <Tooltip title={tip} placement="topLeft">
                  <Col span={4}>{stars}</Col>
                </Tooltip>
              </Row>
              <div className="value">{isObject ? <pre>{value}</pre> : value}</div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default PropertiesDetail;
