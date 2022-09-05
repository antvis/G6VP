import { CommonStyleSetting } from '@alipay/gi-common-components';
import { useContext, utils, GIConfig } from '@alipay/graphinsight';
import React from 'react';

export interface StyleSettingProps {
  elementType: 'nodes' | 'edges';
  service?: any;
}

const StyleSettingPanel: React.FunctionComponent<StyleSettingProps> = ({ elementType = 'nodes', service }) => {
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
    const elementConfig: GIConfig['nodes'] | GIConfig['edges'] = styleGroups.map(c => {
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

    if (service) {
      // debugger
      service(JSON.parse(JSON.stringify(elementConfig)), elementType);
    }
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
