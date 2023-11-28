import { CommonStyleSetting } from '@antv/gi-common-components';
import { GIConfig, useContext, utils } from '@antv/gi-sdk';
import React, { useEffect } from 'react';
import $i18n from '../../i18n';

export interface StyleSettingProps {
  elementType: 'nodes' | 'edges';
  service?: any;
  controlledValues?: {
    elementType: string;
    styleGroups: any;
  };
  onOpen?: () => void;
}

const StyleSettingPanel: React.FunctionComponent<StyleSettingProps> = ({
  elementType = 'nodes',
  service,
  controlledValues,
  onOpen,
}) => {
  const { updateContext, updateHistory, context, assets } = useContext();
  const {
    data,
    nodes,
    edges,
    schemaData = {
      nodes: [],
      edges: [],
    },
  } = context;

  const config = {
    nodes,
    edges,
  };

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

    const clonedConfig = JSON.parse(JSON.stringify(elementConfig));

    updateContext(draft => {
      draft[elementType] = clonedConfig;
    });

    updateHistory({
      componentId: 'StyleSettingPanel',
      type: 'configure',
      subType: $i18n.get({ id: 'advance.components.StyleSetting.StyleSettingPanel.StyleSettings', dm: '样式设置' }),
      statement: $i18n.get({ id: 'advance.components.StyleSetting.StyleSettingPanel.StyleSettings', dm: '样式设置' }),
      success: true,
      params: {
        elementType,
        styleGroups: JSON.parse(JSON.stringify(styleGroups)),
      },
    });

    if (service) {
      service(clonedConfig, elementType);
    }
  };

  /**
   * 受控参数变化，自动进行分析
   * e.g. ChatGPT，历史记录模版等
   */
  useEffect(() => {
    const { elementType: controlledType, styleGroups } = controlledValues || {};
    if (controlledValues && controlledType === elementType) {
      handleChange(styleGroups);
      onOpen?.();
    }
  }, [controlledValues]);

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
