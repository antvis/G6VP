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
  shapeOptions: MetaProps[];
  data: { nodes: any[]; edges: any[] };
  elementType: 'nodes' | 'edges';
}

const StyleSetting: React.FunctionComponent<StyleSettingProps> = ({ shapeOptions, elementType = 'nodes' }) => {
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
    const nodesConfig: NodesConfig = styleGroups.map(c => {
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
      draft.config.nodes = JSON.parse(JSON.stringify(nodesConfig));
      //@ts-check
      draft.layoutCache = true;
    });
  };
  //@ts-ignore
  return (
    <CommonStyleSetting
      schemaData={schemaData}
      onChange={handleChange}
      //@ts-ignore
      config={config}
      data={data}
      elementType={elementType}
      //@ts-ignore
      elements={elements.nodes}
    />
  );
};

export default StyleSetting;
