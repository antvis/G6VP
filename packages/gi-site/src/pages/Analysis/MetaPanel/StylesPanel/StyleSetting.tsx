import { CommonStyleSetting } from '@alipay/gi-common-components';
import React from 'react';
import { useContext } from '../../hooks/useContext';
type NodeConfig = any;
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
  elements: MetaProps[];
  elementType: 'nodes' | 'edges';
}

const StyleSetting: React.FunctionComponent<StyleSettingProps> = props => {
  const { elements, elementType } = props;

  const { updateContext, context } = useContext();
  const { data, config } = context;

  /**
   * 除过 groupName，Icon 和 rule 外的其他 form 表单内容更新会触发该方法
   * @param current
   * @param all
   */
  const handleChange = styleGroups => {
    const elementConfig: NodesConfig = styleGroups.map(c => {
      const { id, groupId, groupName, expressions, logic } = c;
      return {
        id,
        props: c.props,
        groupId,
        groupName,
        expressions,
        logic,
      };
    });
    updateContext(draft => {
      //@ts-ignore
      draft.config[elementType] = JSON.parse(JSON.stringify(elementConfig));
      //@ts-check
      draft.layoutCache = true;
    });
  };
  return (
    <CommonStyleSetting
      config={config}
      onChange={handleChange}
      data={data}
      elementType={elementType}
      elements={elements}
    />
  );
};

export default StyleSetting;
