import type { GILayoutConfig, IGIAC } from '@antv/gi-sdk';
import { Icon, extra, useContext, utils } from '@antv/gi-sdk';
import { LayoutConfig } from '@antv/gi-sdk/lib/typing';
import { Card, Popover, Radio, Space } from 'antd';
import React, { useEffect, useMemo } from 'react';
import $i18n from '../../i18n';

const { GIAComponent } = extra;

export interface LayoutSwitchProps {
  GIAC: IGIAC;
  controlledValues?: LayoutConfig;
}
let timer: NodeJS.Timer;

const LayoutSwitch: React.FunctionComponent<LayoutSwitchProps> = props => {
  const { GIAC, controlledValues } = props;
  const { assets, config, data, schemaData, updateContext, updateHistory, graph } = useContext();
  const { layouts = {} } = assets;

  const handleClick = (layoutConfig: GILayoutConfig) => {
    handleUpdateHistory(layoutConfig, true, '');
    updateContext(draft => {
      draft.layout = layoutConfig.props;
      draft.config.layout = layoutConfig;
      draft.layoutCache = false;
    });
    clearTimeout(timer);
    timer = setTimeout(() => {
      graph.fitCenter(true);
    }, 60);
  };

  /**
   * 更新到历史记录
   * @param success 是否成功
   * @param errorMsg 若失败，填写失败信息
   * @param value 查询语句
   */
  const handleUpdateHistory = (layoutConfig: GILayoutConfig, success: boolean, errorMsg?: string) => {
    const { props: layoutProps } = layoutConfig;
    updateHistory({
      componentId: 'LayoutSwitch',
      type: 'configure',
      subType: $i18n.get({ id: 'basic.components.LayoutSwitch.Component.LayoutSwitching', dm: '布局切换' }),
      statement: $i18n.get(
        {
          id: 'basic.components.LayoutSwitch.Component.LayoutLayoutpropstype',
          dm: '布局 {layoutPropsType}',
        },
        { layoutPropsType: layoutProps.type },
      ),
      success,
      errorMsg,
      params: layoutProps,
    });
  };

  /**
   * 受控参数变化，自动进行分析
   * e.g. ChatGPT，历史记录模版等
   */
  useEffect(() => {
    if (controlledValues) {
      const { type } = controlledValues;
      handleClick({
        id: type as string,
        props: controlledValues,
      });
    }
  }, [controlledValues]);

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
            <Radio value={id} onClick={() => handleClick(layoutConfig)} key={id}>
              <Icon type={icon} />
              &nbsp;{name}
            </Radio>
          );
        })}
      </Space>
    );
  }, [layouts]);

  const content = (
    <Card
      title={$i18n.get({ id: 'basic.components.LayoutSwitch.Component.LayoutScheme', dm: '布局方案' })}
      size="small"
    >
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
