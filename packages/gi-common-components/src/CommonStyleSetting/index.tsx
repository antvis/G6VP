import React from 'react';
import GroupContainer from '../GroupContainer';
import RenderForm from './FormilyRenderForm';
import type { ItemConfig } from './typing';

export interface StyleSettingProps {
  data: { nodes: any[]; edges: any[] };
  elementType: 'nodes' | 'edges';
  onChange: (params: any) => void;
  /** GI ELEMENTS ASSETS META */
  elements: {
    [key: string]: {
      id: string;
      meta: Record<string, any>;
      [key: string]: any;
    };
  };
  /** GI CONFIG */
  config: {
    nodes: ItemConfig[];
    edges: ItemConfig[];
    [key: string]: any;
  };
}

const defaultGroupOption = {
  nodes: {
    groupName: `自定义样式`,
    groupId: Math.random().toString(36).slice(-8),
    id: 'SimpleNode',
    expressions: [
      {
        name: 'id',
        operator: 'eql',
        value: '',
      },
    ],
    props: {
      color: '#ddd',
      size: 26,
      label: [],
    },
  },
  edges: {
    groupName: `自定义样式`,
    groupId: Math.random().toString(36).slice(-8),
    id: 'SimpleEdge',
    expressions: [
      {
        name: 'id',
        operator: 'eql',
        value: '',
      },
    ],
    props: {
      color: '#ddd',
      size: 1,
      label: ['source', 'target'],
    },
  },
};

const CommonStyleSetting: React.FunctionComponent<StyleSettingProps> = ({
  data,
  elementType,
  onChange,
  elements,
  config: CONFIG,
}) => {
  const elementConfig = JSON.parse(JSON.stringify(CONFIG[elementType] || {}));
  const preStyleGroup = React.useRef(elementConfig as any);
  const defaultNodeConfig = {
    id: 'SimpleNode',
    props: {},
  };

  /**
   * change id / props
   * @param current
   * @param all
   */
  const handleChange = (all, groupIndex = 0, elementId) => {
    console.log(all, groupIndex, elementId, preStyleGroup.current);

    if (preStyleGroup.current[groupIndex]) {
      preStyleGroup.current[groupIndex].props = all;
      preStyleGroup.current[groupIndex].id = elementId;
    } else {
      // 不设置分组规则
      preStyleGroup.current[groupIndex] = {
        props: all,
        groupName: `样式配置分组${groupIndex + 1}`,
        groupId: 'default-group',
        id: elementId,
        expressions: [],
        rules: 'and',
      };
    }
    console.log('preStyleGroup', preStyleGroup);
    if (onChange) {
      onChange(preStyleGroup.current);
    }
  };

  /**
   * change rules / expression / groupIndex /groupName
   * @param _current
   * @param all
   */
  const handleGroupChange = (_current, all) => {
    const resultGroup: any = [];
    for (const group of all.groups) {
      // 从 preStyleGroup 中过滤出相同 ID 的对象，进行 merge
      const currentGroup = preStyleGroup.current?.find((pg: any) => pg.groupId === group.groupId);
      if (currentGroup) {
        // 进行 merge
        const result = Object.assign({}, currentGroup, group);
        resultGroup.push(result);
      } else {
        resultGroup.push(group);
      }
    }
    preStyleGroup.current = resultGroup;

    if (onChange) {
      onChange(preStyleGroup.current);
    }
  };

  return (
    <GroupContainer
      //@ts-ignore
      defaultGroupOption={defaultGroupOption[elementType]}
      initValues={{ groups: elementConfig }}
      data={data[elementType]}
      valuesChange={handleGroupChange}
    >
      {groupIndex => {
        const itemConfig = elementConfig[groupIndex] || defaultNodeConfig;
        return (
          <div>
            <RenderForm
              elements={elements}
              //@ts-ignore
              config={itemConfig}
              // debounceInput={true}
              onChange={(all, elementId) => handleChange(all, groupIndex, elementId)}
            />
          </div>
        );
      }}
    </GroupContainer>
  );
};

export default CommonStyleSetting;

// export default React.memo(CommonStyleSetting, (preProps, nextProps) => {
//   /** 只要元素资产变换的时候，才去重绘 */
//   const preElementKeys = Object.keys(preProps.elements).join('_');
//   const nextElementKeys = Object.keys(nextProps.elements).join('_');
//   return preElementKeys === nextElementKeys;
// });
