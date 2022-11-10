import type { GILayoutConfig, IGIAC } from '@antv/gi-sdk';
import { extra, Icon, useContext, utils } from '@antv/gi-sdk';
import { Card, Popover, Radio, Space } from 'antd';
import React, { useMemo } from 'react';
const { GIAComponent } = extra;

export interface LayoutSwitchProps {
  GIAC: IGIAC;
}

const LayoutSwitch: React.FunctionComponent<LayoutSwitchProps> = props => {
  const { GIAC } = props;
  const { assets, config, data, schemaData, updateContext } = useContext();
  const { layouts = {} } = assets;

  const handleClick = (layoutConfig: GILayoutConfig) => {
    updateContext(draft => {
      draft.layout = layoutConfig.props;
      draft.config.layout = layoutConfig;
      draft.layoutCache = false;
    });
  };

  const Radios = useMemo(() => {
    return (
      <Space direction="vertical">
        {Object.keys(layouts).map(key => {
          const layout = layouts[key];
          const {
            registerMeta = () => {
              return {};
            },

            info = {},
          } = layout;
          const keys = utils.getKeysByData(data, 'node');
          // @ts-ignore
          const { id, name, options = {}, icon = '' } = info;
          const configObj = registerMeta({ data, keys, schemaData });
          /** 默认的配置值 */
          const defaultProps = utils.getDefaultValues({ type: 'object', properties: configObj });
          const layoutConfig = {
            id,
            props: {
              ...options,
              ...defaultProps,
            },
          };
          return (
            <Radio value={id} onClick={() => handleClick(layoutConfig)}>
              <Icon type={icon} />
              {name}
            </Radio>
          );
        })}
      </Space>
    );
  }, [layouts]);

  const content = (
    <Card title="布局方案" size="small">
      <Radio.Group value={config.layout?.id}>{Radios}</Radio.Group>
    </Card>
  );

  return (
    <Popover content={content} placement="right">
      <GIAComponent GIAC={GIAC} />
    </Popover>
  );
};

export default LayoutSwitch;
