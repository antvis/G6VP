import { CommonStyleSetting } from '@alipay/gi-common-components';
import { useContext, utils } from '@alipay/graphinsight';
import React from 'react';

export type NodesConfig = {
  id: string;
  groupId: string;
  groupName: string;
  expressions: any[];
  props: any;
}[];

interface MetaProps {
  key: string;
  meta: Object;
}

export interface StyleSettingProps {
  elementType: 'nodes' | 'edges';
}

const StyleSettingPanel: React.FunctionComponent<StyleSettingProps> = ({ elementType = 'nodes' }) => {
  const {
    updateContext,
    data,
    config,
    assets,
    schemaData = {
      nodes: [],
      edges: [],
    },
  } = useContext();

  const elements = React.useMemo(() => {
    return utils.getElementsByAssets(assets.elements, data, schemaData);
  }, [schemaData, data]);

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
      draft.config[elementType] = JSON.parse(JSON.stringify(elementConfig));
      draft.layoutCache = true;
    });
  };
  
  return (
    <CommonStyleSetting
      schemaData={schemaData}
      onChange={handleChange}
      //@ts-ignore
      config={config}
      data={data}
      elementType={elementType}
      //@ts-ignore
      elements={elements[elementType]}
    />
  );
};

export default StyleSettingPanel;
