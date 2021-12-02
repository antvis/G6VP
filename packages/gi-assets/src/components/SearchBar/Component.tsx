import { SubnodeOutlined } from '@ant-design/icons';
import { GraphinContext } from '@antv/graphin';
import { debounce } from '@antv/util';
import { Input, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import WrapContainer from '../WrapContainer';
import './index.less';

const { Search } = Input;
const { Option } = Select;

export interface ISearchBarProps {
  serviceId: string;
  schemaServiceId: string;
  style?: React.CSSProperties;
}

interface ISchemaProperty {
  name: string;
  type: string;
}

const allSchemaAttrs = new Set();

const SearchBar: React.FC<ISearchBarProps> = ({ serviceId, schemaServiceId, style }) => {
  const { services, dispatch } = GraphinContext as any;

  const [schemaOriginData, setSchemaOriginData] = useState({});

  const [schemaData, setSchemaData] = useState({});

  const [schemaTypeData, setSchemaTypeData] = useState([]);
  const [currentSchemaType, setCurrentSchemaType] = useState('');

  const [schemaAttr, setSchemaAttr] = useState([]);
  const [currentAttr, setCurrentAttr] = useState('id');

  const [inputValue, setInputValue] = useState('');
  const [gqlFilter, setGqlFilter] = useState('');

  const handleNodeTypeChange = value => {
    setCurrentSchemaType(value);
    if (!value) {
      // 清空了 value，则清空所有属性
      // @ts-ignore
      setSchemaAttr(Array.from(allSchemaAttrs));
      setCurrentAttr('id');
    } else {
      setSchemaAttr(schemaData[value]);
      setCurrentAttr(schemaData[value][0]);
    }
    setInputValue('');
    setGqlFilter('');
  };

  const onSecondCityChange = value => {
    setCurrentAttr(value);
    setInputValue('');
    setGqlFilter('');
  };

  /**
   * 查询平台的 Schema 及属性
   */
  const querySchemaAttrs = async id => {
    // 通过 services 获取节点类型的Schema
    const { service } = services.find(sr => sr.id === id);
    if (!service) {
      return;
    }

    const result = await service();
    const nodeTypes = result;

    if (!nodeTypes) {
      return;
    }

    setSchemaOriginData(nodeTypes);

    // 设置类型的数据
    // @ts-ignore
    setSchemaTypeData(Object.keys(nodeTypes));

    const schameAttrs = {};
    // const allSchemaSet = new Set()
    for (let key in nodeTypes) {
      const attrs = nodeTypes[key].map(nt => nt.name);
      schameAttrs[key] = attrs;
      attrs.forEach(attr => {
        allSchemaAttrs.add(attr);
      });
    }

    // @ts-ignore
    setSchemaAttr(Array.from(allSchemaAttrs));
    // 设置属性的数据
    setSchemaData(schameAttrs);
  };

  const getFilterStr = (value: string) => {
    // 获取是字符串还是数字类型
    // @ts-ignore
    let current: ISchemaProperty = undefined;
    if (schemaOriginData[currentSchemaType]) {
      current = schemaOriginData[currentSchemaType].find(sod => sod.name === currentAttr);
    } else {
      // 获取到了当前的属性名称
      const currentAttrName = Array.from(allSchemaAttrs).find(sod => sod === currentAttr);

      // 从 schemaOriginData 中过滤出 current，获取其 type
      Object.values(schemaOriginData).forEach((sd: any) => {
        if (current) {
          return;
        }
        current = sd.find(sod => sod.name === currentAttrName);
      });
    }

    if (!current) {
      return '';
    }

    let isStringFlag = true;
    if (current.type !== 'string') {
      // 非字符串
      isStringFlag = false;
    } else {
      // 字符串
      isStringFlag = true;
    }

    // = 123
    // link '1233'
    // in list [12, 23, 45] or in list ['12', '23', '45']

    let lastFilter = '';
    // GQL 精准匹配还是模糊
    const ids = value.split(',');
    if (ids.length === 1) {
      // 只有一个值，是字符串时候，加引号
      if (!isStringFlag) {
        lastFilter = `= ${value}`;
      } else {
        // lastFilter = `LIKE '${value}'`
        // Geabase 暂不支持模糊匹配
        lastFilter = `= '${value}'`;
      }
    } else if (ids.length > 1) {
      // 多个值，GQL 中则用 IN LIKE
      if (!isStringFlag) {
        lastFilter = `IN LIST[${value}]`;
      } else {
        let tmp = '';
        ids.forEach((v, idx) => {
          if (idx !== 0) {
            tmp += `,'${v}'`;
          } else {
            tmp += `'${v}'`;
          }
        });
        lastFilter = `IN LIST[${tmp}]`;
      }
    }
    return lastFilter;
  };

  const [btnLoading, setBtnLoading] = useState(false);
  const handleQueryByGQL = async (filterStr: string) => {
    setBtnLoading(true);
    const gql = `MATCH (n${
      currentSchemaType ? `:${currentSchemaType}` : ''
    } WHERE ${currentAttr} ${filterStr}) RETURN n`;
    // 获取查询的 ISO GQL
    const { service } = services.find(sr => sr.id === serviceId);
    if (!service) {
      return;
    }

    const result = await service({
      value: gql,
    });

    setBtnLoading(false);
    if (!result) {
      return;
    }

    dispatch.changeData(result);
  };

  const handleSearch = value => {
    setInputValue(value);
    const gqlFilter = getFilterStr(value);
    setGqlFilter(gqlFilter);
    handleQueryByGQL(gqlFilter);
  };

  const handleInputChange = evt => {
    const value = evt.target.value;
    setInputValue(value);
    const inputdebounce = debounce(() => {
      const gqlFilter = getFilterStr(value);
      setGqlFilter(gqlFilter);
    }, 300);

    inputdebounce();
  };

  useEffect(() => {
    if (schemaServiceId) {
      querySchemaAttrs(schemaServiceId);
    }
  }, [schemaServiceId]);

  return (
    <div className="searchContainer" style={style as any}>
      <Space>
        <span className="typeLabel">类型：</span>
        <Select showSearch defaultValue="" style={{ width: 120 }} onChange={handleNodeTypeChange} size="small">
          <Option value="" key="">
            全部
          </Option>
          {schemaTypeData?.map(std => (
            <Option value={std} key={std}>
              {std}
            </Option>
          ))}
        </Select>
        <span className="attrLabel">属性：</span>
        <Select
          showSearch
          style={{ width: 120 }}
          defaultValue="id"
          value={currentAttr}
          onChange={onSecondCityChange}
          size="small"
        >
          {schemaAttr.map(sa => (
            <Option value={sa} key={sa}>
              {sa}
            </Option>
          ))}
        </Select>
        <Search
          style={{ width: 145 }}
          placeholder="请输入属性值"
          size="small"
          value={inputValue}
          onChange={handleInputChange}
          onSearch={handleSearch}
          loading={btnLoading}
        />
      </Space>
      <pre className="codes">
        MATCH (n{currentSchemaType ? `:${currentSchemaType}` : ''} WHERE {currentAttr} {gqlFilter}) RETURN n
      </pre>
    </div>
  );
};

export default WrapContainer(SearchBar, {
  icon: <SubnodeOutlined />,
  title: 'ISO-GQL 搜索框',
  showText: true,
});
