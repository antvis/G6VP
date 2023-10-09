import { FieldStringOutlined, NumberOutlined } from '@ant-design/icons';
import { Select, type SelectProps } from 'antd';
import React, { useMemo, useState } from 'react';

type SchemaDatum = ({ nodeType: string } | { edgeType: string }) & {
  properties: Record<string, string>;
};

export interface GroupSelectProps extends SelectProps {
  schemaData: SchemaDatum[];
}

const iconMap = {
  boolean: <FieldStringOutlined style={{ color: 'rgb(39, 110, 241)', marginRight: '4px' }} />,
  string: <FieldStringOutlined style={{ color: 'rgb(39, 110, 241)', marginRight: '4px' }} />,
  number: <NumberOutlined style={{ color: 'rgb(255, 192, 67)', marginRight: '4px' }} />,
};

const match = (a: string, b: string) => String(a).toLocaleLowerCase().includes(String(b).toLocaleLowerCase());

const getTypeName = (sd: SchemaDatum) => ('nodeType' in sd ? sd.nodeType : sd.edgeType);

const GroupSelect: React.FC<GroupSelectProps> = ({ schemaData, onSearch, ...selectProps }) => {
  const [searchValue, setSearchValue] = useState('');

  const groups = useMemo(() => {
    return schemaData
      .map(d => {
        if (match(getTypeName(d), searchValue)) return d;
        const properties = Object.entries(d.properties).filter(([key]) => match(key, searchValue));
        return {
          ...d,
          properties: Object.fromEntries(properties),
        };
      })
      .filter(d => Object.keys(d.properties).length > 0);
  }, [schemaData, searchValue]);

  const options = useMemo(() => {
    return groups.map(group => {
      const { properties } = group;
      const typeName = getTypeName(group);
      return {
        label: typeName,
        options: Object.entries(properties).map(([property, type]) => ({
          label: (
            <>
              {iconMap[type]}
              {property}
            </>
          ),
          value: `${typeName}^^${property}`,
        })),
      };
    });
  }, [groups]);

  return (
    <Select
      {...selectProps}
      options={options}
      onSearch={value => {
        setSearchValue(value);
        return onSearch?.(value);
      }}
    />
  );
};

export default GroupSelect;
