import { CommonStyleSetting, Utils } from '@alipay/gi-common-components';
import { useContext } from '@alipay/graphinsight';
import React from 'react';
import { NodeConfig } from '../../elements/SimpleNode/registerTransform';

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
  elementType: 'nodes' | 'edges';
}

const StyleSetting: React.FunctionComponent<StyleSettingProps> = ({ shapeOptions, elementType = 'nodes' }) => {
  const { updateContext, data, config, assets } = useContext();

  const elements = React.useMemo(() => {
    return Utils.getElementsByAssets(assets.elements, data);
  }, []);

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
