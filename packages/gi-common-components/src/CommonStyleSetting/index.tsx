import React from 'react';
import GroupContainer from '../GroupContainer';
import RenderForm from './FormilyRenderForm';

export type NodesConfig = {
  id: string;
  groupId: string;
  groupName: string;
  expressions: any[];
  props: any;
}[];

export interface StyleSettingProps {
  data: { nodes: any[]; edges: any[] };
  elementType: 'node' | 'edge';
  onChange: (params: any) => void;
  /** GI ELEMENT ASSETS */
  elements: {};
  /** GI CONFIG */
  config: {
    nodes: [
      {
        id: string;
        props: {};
      },
    ];
    edges: [{}];
    [key: string]: any;
  };
}

const CommonStyleSetting: React.FunctionComponent<StyleSettingProps> = ({
  data,
  elementType,
  onChange,
  elements,
  config,
}) => {
  const elementConfig = JSON.parse(JSON.stringify(config.nodes || {}));
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
  };

  // todo @山果，样式配置的数据传到这里，替换掉 initValue 就可以
  const initValue = JSON.parse(
    '[{"groupName":"默认样式","groupId":"default-group","id":"SimpleNode","props":{},"logic":true},{"groupName":"自定义样式","groupId":"7s4n2r88","id":"SimpleNode","props":{"size":25,"color":"green","label":["id"],"advanced":{"icon":{"visible":false,"type":"font","value":"","fill":"#FF6A00","size":46},"keyshape":{"fillOpacity":0.1},"label":{"visible":true,"fill":"#000","fontSize":12,"position":"bottom"},"badge":{"visible":false,"type":"text","value":""}}}}]',
  );
  console.log('初始值', initValue, elementConfig);

  return (
    <GroupContainer
      initValues={{ groups: elementConfig }}
      data={elementType === 'node' ? data.nodes : data.edges}
      valuesChange={handleGroupChange}
    >
      {groupIndex => {
        const nodeConfig = config.nodes[groupIndex] || defaultNodeConfig;
        return (
          <div>
            <RenderForm
              elements={elements}
              config={nodeConfig}
              // debounceInput={true}
              onChange={(all, elementId) => handleChange(all, groupIndex, elementId)}
            />
          </div>
        );
      }}
    </GroupContainer>
  );
};

export default React.memo(CommonStyleSetting, (preProps, nextProps) => {
  /** 只要元素资产变换的时候，才去重绘 */
  const preElementKeys = Object.keys(preProps.elements).join('_');
  const nextElementKeys = Object.keys(nextProps.elements).join('_');
  return preElementKeys === nextElementKeys;
});
