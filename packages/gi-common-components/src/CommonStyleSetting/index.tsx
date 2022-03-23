import GroupContainer from '../GroupContainer';
import React from 'react';
import RenderForm from './renderForm'
// import { NodeConfig } from '../../elements/SimpleNode/registerTransform';

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
  schema: any;
  onChange: (params: any) => void;
}

const CommonStyleSetting: React.FunctionComponent<StyleSettingProps> = ({ data, elementType, schema, onChange }) => {
  const preStyleGroup = React.useRef([] as any)

  /**
   * 除过 groupName，Icon 和 rule 外的其他 form 表单内容更新会触发该方法
   * @param current
   * @param all
   */
  const handleChange = (current, all, groupIndex = 0) => {
    if (preStyleGroup.current[groupIndex]) {
      preStyleGroup.current[groupIndex].config = all;
    } else {
      // 不设置分组规则
      preStyleGroup.current[groupIndex] = {
        config: all,
        groupName: `样式配置分组${groupIndex + 1}`,
        groupId: 'default-group',
      };
    }
    console.log('preStyleGroup', preStyleGroup);
    if (onChange) {
      onChange(preStyleGroup.current)
    }
    
  };

  const handleGroupChange = (current, all) => {
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

  return (
    <GroupContainer data={elementType === 'node' ? data.nodes : data.edges } valuesChange={handleGroupChange}>
      {groupIndex => {
        return (
          <RenderForm
            // debounceInput={true}
            schema={schema as any}
            onChange={(current, all) => handleChange(current, all, groupIndex)}
          />
        );
      }}
    </GroupContainer>
  );
};

export default CommonStyleSetting;
