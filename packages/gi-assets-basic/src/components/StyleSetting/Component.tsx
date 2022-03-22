import { GroupContainer } from '@alipay/gi-common-components';
import { filterByTopRule } from '@alipay/gi-common-components/lib/GroupContainer/utils';
import { useContext } from '@alipay/graphinsight';
import FormRender, { useForm } from 'form-render';
import React from 'react';
import { NodeConfig } from '../../elements/SimpleNode/registerTransform';
import IconSelector from './IconSelector';
import { schema } from './registerMeta';
export type NodesConfig = {
  id: string;
  groupId: string;
  groupName: string;
  expressions: any[];
  props: NodeConfig;
}[];

interface MetaProps {
  key: string;
  meta: Object;
}

export interface StyleSettingProps {
  shapeOptions: MetaProps[];
  data: { nodes: any[]; edges: any[] };
  elementType: 'node' | 'edge';
}

const data = {
  nodes: [
    {
      id: 'node1',
      nodeType: 'User',
      // 默认ID
      label: 'xxx',
      data: {
        id: 'node1',
        nodeType: 'User',
        // 默认ID
        label: 'xxx',
      },
    },
    {
      id: 'node1',
      label: 'Car',
      data: {
        id: 'node1',
        label: 'Car',
      },
    },
  ],
  edges: [
    {
      source: 'node1',
      target: 'node1',
      edgeType: 'edge1',
    },
  ],
};

const getTransformOptions = options => {
  // TODO :替换成getTransByTemplate
  return () => {};
};

let preStyleGroup: any = [];

const StyleSetting: React.FunctionComponent<StyleSettingProps> = ({ shapeOptions, elementType }) => {
  const form = useForm();
  const { updateContext } = useContext();

  const filterByRules = (conditions, nodes) => {
    if (!conditions || conditions.length === 0) {
      return;
    }

    const newMembers = conditions.reduce((map, condition, index) => {
      const filteredNodes = nodes.filter(node => {
        const topRule = condition && condition.name && condition.operator ? condition : undefined;
        if (topRule) {
          return filterByTopRule(node.data, topRule);
        } else {
          return false;
        }
      });
      map[index] = { list: filteredNodes.map(node => node.id) };
      return map;
    }, []);

    return newMembers;
  };

  /**
   * 除过 groupName，Icon 和 rule 外的其他 form 表单内容更新会触发该方法
   * @param current
   * @param all
   */
  const handleChange = (current, all, groupIndex) => {
    if (preStyleGroup[groupIndex]) {
      preStyleGroup[groupIndex].config = all;
    } else {
      // 不设置分组规则
      preStyleGroup[groupIndex] = {
        config: all,
        groupName: `样式配置分组${groupIndex + 1}`,
        groupId: 'default-group',
      };
    }
    console.log('preStyleGroup', preStyleGroup);
    const nodesConfig: NodesConfig = preStyleGroup.map(c => {
      return {
        id: 'SimpleNode',
        props: c.config as NodeConfig,
        groupId: c.groupId,
        groupName: c.groupName,
        expressions: c.expressions,
        logic: c.logic,
      };
    });
    console.log('nodeConfig', nodesConfig, nodesConfig[0].props.advanced);
    // updateContext(draft => {
    //   draft.config.nodes = nodesConfig;
    // });
  };

  const handleGroupChange = (current, all) => {
    const resultGroup: any = [];
    for (const group of all.groups) {
      // 从 preStyleGroup 中过滤出相同 ID 的对象，进行 merge
      const currentGroup = preStyleGroup.find(pg => pg.groupId === group.groupId);
      if (currentGroup) {
        // 进行 merge
        const result = Object.assign({}, currentGroup, group);
        resultGroup.push(result);
      } else {
        resultGroup.push(group);
      }
    }
    preStyleGroup = resultGroup;
  };

  return (
    <GroupContainer data={data.nodes} valuesChange={handleGroupChange}>
      {groupIndex => {
        return (
          <FormRender
            widgets={{ iconSelector: IconSelector }}
            form={form}
            displayType="row"
            allCollapsed={true}
            // debounceInput={true}
            schema={schema as any}
            onValuesChange={(current, all) => handleChange(current, all, groupIndex)}
          />
        );
      }}
    </GroupContainer>
  );
};

export default StyleSetting;
