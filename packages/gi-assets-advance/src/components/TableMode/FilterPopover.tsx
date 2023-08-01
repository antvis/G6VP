import { S2Event } from '@antv/s2';
import { get, uniq } from '@antv/util';
import { Checkbox, Form, Input, Radio } from 'antd';
import React, { useEffect } from 'react';
import { convertToObject, getCurrentFilterParams } from './utils/filter';

export const FilterPopover = ({ fieldName, spreadsheet, modalCallbackRef }) => {
  const fieldData = React.useMemo(
    () =>
      uniq(
        // slice掉第一行  （第一行是column名）
        spreadsheet.dataSet.originData.slice(1).map(item => item[fieldName]),
      ),
    [spreadsheet.dataSet.originData, fieldName],
  );

  const { filterParams } = spreadsheet.dataCfg;
  const [filtered, setfiltered] = React.useState(convertToObject(getCurrentFilterParams(fieldName, filterParams)));
  const [changed, setchanged] = React.useState({
    filter: false,
  });
  const [searchKeyword, setsearchKeyword] = React.useState('');

  useEffect(() => {
    setfiltered(convertToObject(getCurrentFilterParams(fieldName, filterParams)));
  }, [fieldName]);

  const searchedFieldData = React.useMemo(
    () =>
      fieldData.filter(data => {
        if (searchKeyword) {
          if (typeof data === 'string') {
            return data.search(searchKeyword) !== -1;
          }
          return false;
        }
        return true;
      }),
    [searchKeyword, fieldData, fieldName],
  );

  const onKeywordChange = keyword => {
    // 关键词变化时将不在关键词内的值过滤
    setsearchKeyword(keyword);
    setchanged(old => ({ ...old, filter: true }));
    const newFilter = {};
    fieldData
      .filter(
        data =>
          !fieldData
            .filter(field => {
              if (keyword) {
                if (typeof field === 'string') {
                  return field.search(keyword) !== -1;
                }
                return false;
              }
              return true;
            })
            .includes(data),
      )
      .forEach(data => {
        newFilter[data] = true;
      });
    setfiltered(newFilter);
  };

  modalCallbackRef.current = () => {
    if (changed.filter) {
      spreadsheet.emit(S2Event.RANGE_FILTER, {
        filterKey: fieldName,
        // 将Object还原成数组
        filteredValues: Object.entries(filtered || {})
          .map(([fieldValue, isFiltered]) => {
            if (isFiltered) return fieldValue;
          })
          .filter(Boolean)
          .map(value => (value === 'undefined' ? undefined : value)),
      });
    }
    setchanged({ filter: false });
  };

  return (
    <Form>
      <p className="gi-tablemode-filter-tip">注意：仅控制表格中数据行的显示与隐藏</p>
      <Form.Item className="gi-tablemode-filter-item">
        <div>
          <Input.Search
            value={searchKeyword}
            onChange={e => onKeywordChange(e.target.value)}
            placeholder="请输入搜索关键词"
            className="search-box"
          />
          <div className="gi-tablemode-filter-check-item-list">
            <Checkbox
              className="check-item"
              checked={searchedFieldData.every(fieldValue => !filtered[fieldValue])}
              indeterminate={
                searchedFieldData.some(fieldValue => !filtered[fieldValue]) &&
                !searchedFieldData.every(fieldValue => !filtered[fieldValue])
              }
              onChange={e => {
                const {
                  target: { checked },
                } = e;
                setchanged(val => ({ ...val, filter: true }));

                if (checked) {
                  setfiltered(old => {
                    const newValue = {};
                    searchedFieldData.forEach(fieldValue => {
                      newValue[fieldValue] = false;
                    });
                    return newValue;
                  });
                } else {
                  // 将全部过滤
                  setfiltered(old => {
                    const newValue = {};
                    searchedFieldData.forEach(fieldValue => {
                      newValue[fieldValue] = true;
                    });

                    return { newValue };
                  });
                }
              }}
            >
              {'全选'}
            </Checkbox>

            {searchedFieldData.map(item => {
              return (
                <Checkbox
                  className="check-item"
                  checked={!filtered[item]}
                  onChange={e => {
                    setchanged(old => ({ ...old, filter: true }));
                    setfiltered(old => ({
                      ...old,
                      [item]: !e.target.checked,
                    }));
                  }}
                >
                  {item === undefined ? '-' : item}
                </Checkbox>
              );
            })}
          </div>
        </div>
      </Form.Item>
    </Form>
  );
};
